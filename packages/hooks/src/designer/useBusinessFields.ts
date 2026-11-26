import type {
  ComponentSchema,
  PageSchema,
  Property,
} from '@nada-designer/types';

import { computed, ref } from 'vue';

import {
  buildFieldSchema,
  findSchemaById,
  findSchemaInfoById,
  findSchemas,
  hasFieldInScope,
  isValidSchemaName,
  mapPropertyType,
  resolveScopeNode,
} from '@nada-designer/utils';

/** 元数据加载状态：empty 未指定对象/未提供 loader，loading 加载中，ready 就绪，error 失败 */
export type BusinessFieldsStatus = 'empty' | 'error' | 'loading' | 'ready';

/** 元数据校验中发现的问题（单条失败不影响其余字段） */
export interface BusinessFieldIssue {
  field?: string;
  message: string;
}

/** 组件配置的精简结构（只取 hook 需要的部分） */
export interface ComponentConfigLike {
  attribute?: { field?: string }[];
  defaultSchema?: ComponentSchema;
  editConstraints?: { childImmovable?: boolean };
}

/** 插入业务字段的选项 */
export interface InsertFieldOptions {
  /** 插入成功后的回调（选中节点 / 撤销记录由调用方负责） */
  onInserted?: (node: ComponentSchema) => void;
  /** 插入目标节点 id；不传时插入根作用域 */
  targetId?: string;
}

export interface UseBusinessFieldsOptions {
  /** 取当前 UI 库的组件配置；由调用方注入（hooks 不运行时依赖 manager） */
  getComponentConfig?: (type: string) => ComponentConfigLike | undefined;
  /** 业务字段元数据加载器（可直接返回静态数组，便于测试/离线） */
  loader?: (modelId: string) => Promise<Property[]> | Property[];
}

/** 支持的数据类型（规格 §6.3.1） */
const FIELD_TYPES = new Set([
  'boolean',
  'date',
  'list',
  'money',
  'number',
  'ref',
  'text',
]);

/** 元数据内存缓存（只读、跨实例共享） */
const propertiesCache = new Map<string, Property[]>();

/**
 * 校验并规范化元数据
 * @description 单条失败只影响该字段（规格 §6.4）
 * @param rawList 原始元数据
 * @param getComponentConfig 取组件配置，用于校验当前 UI 库是否存在映射后的组件
 */
export function validateProperty(
  rawList: unknown,
  getComponentConfig?: (type: string) => ComponentConfigLike | undefined,
): { issues: BusinessFieldIssue[]; properties: Property[] } {
  const issues: BusinessFieldIssue[] = [];

  if (!Array.isArray(rawList)) {
    return { issues: [{ message: '元数据不是数组' }], properties: [] };
  }

  const properties: Property[] = [];
  const seen = new Set<string>();

  rawList.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object') {
      issues.push({ message: `第 ${index + 1} 条元数据不是对象` });
      return;
    }

    const meta = raw as Partial<Property>;
    const field = typeof meta.field === 'string' ? meta.field.trim() : '';

    if (!field) {
      issues.push({ message: `第 ${index + 1} 条元数据缺少 field` });
      return;
    }

    if (!isValidSchemaName(field)) {
      issues.push({ field, message: '字段名不符合字符集，已跳过' });
      return;
    }

    if (seen.has(field)) {
      issues.push({ field, message: '字段名重复，已忽略后者' });
      return;
    }
    seen.add(field);

    const type = meta.type as Property['type'];
    if (!FIELD_TYPES.has(type)) {
      issues.push({ field, message: `不支持的数据类型：${String(meta.type)}` });
      return;
    }

    const componentType = mapPropertyType(type);
    if (!componentType) {
      issues.push({ field, message: '该数据类型暂不支持，已跳过' });
      return;
    }

    if (getComponentConfig && !getComponentConfig(componentType)) {
      issues.push({
        field,
        message: `当前 UI 库不存在组件 ${componentType}，已跳过`,
      });
      return;
    }

    if (type === 'ref' && !meta.entity) {
      issues.push({ field, message: 'ref 字段缺少 entity，已跳过' });
      return;
    }

    if (meta.active === false) {
      // 不进入面板，但仍记录在元数据中（用于漂移提示）
      return;
    }

    const label =
      typeof meta.label === 'string' && meta.label.trim()
        ? meta.label.trim()
        : field;

    properties.push({
      active: true,
      entity: meta.entity,
      field,
      label,
      scale: typeof meta.scale === 'number' ? meta.scale : undefined,
      type,
      unit: meta.unit,
    });
  });

  return { issues, properties };
}

/**
 * 业务字段元数据：加载、校验、缓存、两段式切换与节点构造
 * @param pageSchema 页面数据（用于解析作用域与已放置字段）
 * @param options 注入的 loader 与组件配置查询
 */
export function useBusinessFields(
  pageSchema: PageSchema,
  options: UseBusinessFieldsOptions,
) {
  const modelId = ref<null | string>(null);
  const error = ref<null | string>(null);
  const properties = ref<Property[]>([]);
  const issues = ref<BusinessFieldIssue[]>([]);
  const status = ref<BusinessFieldsStatus>('empty');

  /** 请求令牌：切换业务对象时丢弃过期响应 */
  let token = 0;

  const isLoading = computed(() => status.value === 'loading');
  const isReady = computed(() => status.value === 'ready');
  const propertyMap = computed(() => {
    const map = new Map<string, Property>();
    properties.value.forEach((item) => map.set(item.field, item));
    return map;
  });

  /**
   * 加载指定业务对象的元数据
   * @param nextModelId 业务对象模型 id
   * @param loadOptions 加载选项
   * @param loadOptions.force 是否绕过缓存
   * @returns 是否加载成功（过期或失败返回 false）
   */
  async function load(
    nextModelId: string,
    loadOptions: { force?: boolean } = {},
  ): Promise<boolean> {
    if (!nextModelId) {
      status.value = 'empty';
      error.value = '未指定业务对象';
      properties.value = [];
      return false;
    }

    const cached = propertiesCache.get(nextModelId);
    if (cached && !loadOptions.force) {
      modelId.value = nextModelId;
      properties.value = cached;
      issues.value = [];
      error.value = null;
      status.value = 'ready';
      return true;
    }

    if (!options.loader) {
      status.value = 'empty';
      error.value = '未提供 businessFieldLoader';
      properties.value = [];
      return false;
    }

    const currentToken = (token += 1);
    modelId.value = nextModelId;
    status.value = 'loading';
    error.value = null;

    try {
      const raw = await options.loader(nextModelId);
      if (currentToken !== token) return false;

      const result = validateProperty(raw, options.getComponentConfig);
      propertiesCache.set(nextModelId, result.properties);
      properties.value = result.properties;
      issues.value = result.issues;
      status.value = 'ready';

      result.issues.forEach((issue) => {
        console.warn(
          `[受控字段] 业务对象 ${nextModelId} 的元数据问题：${issue.message}${
            issue.field ? `（field: ${issue.field}）` : ''
          }`,
        );
      });
      return true;
    } catch (error_) {
      if (currentToken !== token) return false;
      error.value = error_ instanceof Error ? error_.message : String(error_);
      properties.value = [];
      status.value = 'error';
      return false;
    }
  }

  /**
   * schema 晚到时校正业务对象（两段式解析，规格 §6.2）
   * @param nextModelId schema 中的业务对象模型 id
   */
  async function switchTo(nextModelId?: null | string): Promise<boolean> {
    if (!nextModelId) return false;
    if (nextModelId === modelId.value && status.value === 'ready') {
      return true;
    }
    return load(nextModelId);
  }

  /** 重新加载当前业务对象（跳过缓存） */
  async function retry(): Promise<boolean> {
    if (!modelId.value) return false;
    return load(modelId.value, { force: true });
  }

  /**
   * 解析节点所属作用域节点
   * @param nodeId 节点 id；不传时返回根节点
   */
  function resolveScope(nodeId?: string): ComponentSchema | null {
    return resolveScopeNode(pageSchema.schemas, nodeId);
  }

  /**
   * 判断字段在当前作用域内是否已放置
   * @param field 业务字段标识
   * @param nodeId 用于解析作用域的节点 id
   */
  function isFieldPlaced(field: string, nodeId?: string): boolean {
    return hasFieldInScope(resolveScope(nodeId), field);
  }

  /**
   * 由元数据构造业务字段节点（按当前 UI 库属性表过滤预设 props）
   * @param meta 业务字段元数据
   * @param scopeId 作用域节点 id
   */
  function buildNode(meta: Property, scopeId: string): ComponentSchema | null {
    const componentType = mapPropertyType(meta.type);
    if (!componentType) return null;

    const config = options.getComponentConfig?.(componentType);
    if (!config?.defaultSchema) return null;

    const allowedProps = (config.attribute ?? [])
      .map((item) =>
        typeof item.field === 'string' && item.field.startsWith('props.')
          ? item.field.slice('props.'.length)
          : '',
      )
      .filter(Boolean);

    return buildFieldSchema({
      allowedProps,
      base: config.defaultSchema,
      meta,
      scopeId,
    });
  }

  /**
   * 校验业务字段能否放入指定作用域
   * @description 返回构造好的节点或失败原因（重复、id 冲突、不支持的类型）
   * @param meta 业务字段元数据
   * @param scopeId 作用域节点 id
   */
  function checkProperty(
    meta: Property,
    scopeId: string,
  ): { message?: string; node?: ComponentSchema; ok: boolean } {
    const node = buildNode(meta, scopeId);
    if (!node) {
      return { message: `不支持的数据类型：${meta.type}`, ok: false };
    }

    const scope = findSchemaById(pageSchema.schemas, scopeId);
    if (hasFieldInScope(scope, meta.field)) {
      return {
        message: `字段「${meta.label}」已存在，不能重复放置`,
        ok: false,
      };
    }
    if (node.id && findSchemaById(pageSchema.schemas, node.id)) {
      return { message: `节点 id「${node.id}」已存在`, ok: false };
    }

    return { node, ok: true };
  }

  /**
   * 获取当前作用域内已放置的字段名
   * @description 用于面板置灰（规格 §10.2）；跨作用域是否重复由落点校验兜底
   * @param nodeId 用于解析作用域的节点 id
   */
  function getPlacedFields(nodeId?: string): string[] {
    const scope = resolveScope(nodeId);
    if (!scope) return [];

    return (
      findSchemas(
        scope.children ?? [],
        (node) => node.input === true && Boolean(node.field),
      ) as ComponentSchema[]
    ).map((node) => node.field as string);
  }

  /**
   * 插入业务字段节点
   * @description 校验 → 构造 → 按选中节点位置插入（容器插到末尾，叶子插到其后）；回调负责选中与撤销
   * @param meta 业务字段元数据
   * @param insertOptions 插入选项
   */
  function insertProperty(
    meta: Property,
    insertOptions: InsertFieldOptions = {},
  ): { message?: string; node?: ComponentSchema; ok: boolean } {
    const targetId = insertOptions.targetId ?? pageSchema.schemas[0]?.id;
    if (!targetId) {
      return { message: '页面为空，无法插入字段', ok: false };
    }

    const scope = resolveScope(targetId);
    if (!scope?.id) {
      return { message: '未找到业务字段作用域', ok: false };
    }

    const result = checkProperty(meta, scope.id);
    if (!result.ok || !result.node) return result;

    const data = findSchemaInfoById(pageSchema.schemas, targetId);
    if (!data) {
      return { message: '未找到插入位置', ok: false };
    }

    let { index, schema: checkedSchema, list } = data;
    const childImmovable = options.getComponentConfig?.(checkedSchema.type)
      ?.editConstraints?.childImmovable;
    if (checkedSchema.children && !childImmovable) {
      list = checkedSchema.children;
      index = list.length - 1;
    }

    list.splice(index + 1, 0, result.node);
    insertOptions.onInserted?.(result.node);
    return result;
  }

  return {
    buildNode,
    checkProperty,
    error,
    getPlacedFields,
    insertProperty,
    isFieldPlaced,
    isLoading,
    isReady,
    issues,
    load,
    modelId,
    properties,
    propertyMap,
    resolveScope,
    retry,
    status,
    switchTo,
  };
}

export type BusinessFieldsContext = ReturnType<typeof useBusinessFields>;

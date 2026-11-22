import type {
  ComponentSchema,
  FieldMeta,
  PageSchema,
} from '@nada-designer/types';

import { computed, ref } from 'vue';

import {
  buildFieldSchema,
  findSchemaById,
  findSchemas,
  hasFieldInScope,
  isValidSchemaName,
  mapFieldDataType,
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
}

export interface UseBusinessFieldsOptions {
  /** 取当前 UI 库的组件配置；由调用方注入（hooks 不运行时依赖 manager） */
  getComponentConfig?: (type: string) => ComponentConfigLike | undefined;
  /** 业务字段元数据加载器（可直接返回静态数组，便于测试/离线） */
  loader?: (businessObject: string) => FieldMeta[] | Promise<FieldMeta[]>;
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
const fieldsCache = new Map<string, FieldMeta[]>();

/**
 * 校验并规范化元数据
 * @description 单条失败只影响该字段（规格 §6.4）
 * @param rawList 原始元数据
 * @param getComponentConfig 取组件配置，用于校验当前 UI 库是否存在映射后的组件
 */
export function validateFieldMeta(
  rawList: unknown,
  getComponentConfig?: (type: string) => ComponentConfigLike | undefined,
): { fields: FieldMeta[]; issues: BusinessFieldIssue[] } {
  const issues: BusinessFieldIssue[] = [];

  if (!Array.isArray(rawList)) {
    return { fields: [], issues: [{ message: '元数据不是数组' }] };
  }

  const fields: FieldMeta[] = [];
  const seen = new Set<string>();

  rawList.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object') {
      issues.push({ message: `第 ${index + 1} 条元数据不是对象` });
      return;
    }

    const meta = raw as Partial<FieldMeta>;
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

    const type = meta.type as FieldMeta['type'];
    if (!FIELD_TYPES.has(type)) {
      issues.push({ field, message: `不支持的数据类型：${String(meta.type)}` });
      return;
    }

    const componentType = mapFieldDataType(type);
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

    fields.push({
      active: true,
      entity: meta.entity,
      field,
      label,
      scale: typeof meta.scale === 'number' ? meta.scale : undefined,
      type,
      unit: meta.unit,
    });
  });

  return { fields, issues };
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
  const businessObject = ref<null | string>(null);
  const error = ref<null | string>(null);
  const fields = ref<FieldMeta[]>([]);
  const issues = ref<BusinessFieldIssue[]>([]);
  const status = ref<BusinessFieldsStatus>('empty');

  /** 请求令牌：切换业务对象时丢弃过期响应 */
  let token = 0;

  const isLoading = computed(() => status.value === 'loading');
  const isReady = computed(() => status.value === 'ready');
  const fieldMap = computed(() => {
    const map = new Map<string, FieldMeta>();
    fields.value.forEach((item) => map.set(item.field, item));
    return map;
  });

  /**
   * 加载指定业务对象的元数据
   * @param nextBusinessObject 业务对象 code
   * @param loadOptions 加载选项
   * @param loadOptions.force 是否绕过缓存
   * @returns 是否加载成功（过期或失败返回 false）
   */
  async function load(
    nextBusinessObject: string,
    loadOptions: { force?: boolean } = {},
  ): Promise<boolean> {
    if (!nextBusinessObject) {
      status.value = 'empty';
      error.value = '未指定业务对象';
      fields.value = [];
      return false;
    }

    const cached = fieldsCache.get(nextBusinessObject);
    if (cached && !loadOptions.force) {
      businessObject.value = nextBusinessObject;
      fields.value = cached;
      issues.value = [];
      error.value = null;
      status.value = 'ready';
      return true;
    }

    if (!options.loader) {
      status.value = 'empty';
      error.value = '未提供 businessFieldLoader';
      fields.value = [];
      return false;
    }

    const currentToken = (token += 1);
    businessObject.value = nextBusinessObject;
    status.value = 'loading';
    error.value = null;

    try {
      const raw = await options.loader(nextBusinessObject);
      if (currentToken !== token) return false;

      const result = validateFieldMeta(raw, options.getComponentConfig);
      fieldsCache.set(nextBusinessObject, result.fields);
      fields.value = result.fields;
      issues.value = result.issues;
      status.value = 'ready';

      result.issues.forEach((issue) => {
        console.warn(
          `[受控字段] 业务对象 ${nextBusinessObject} 的元数据问题：${issue.message}${
            issue.field ? `（field: ${issue.field}）` : ''
          }`,
        );
      });
      return true;
    } catch (error_) {
      if (currentToken !== token) return false;
      error.value = error_ instanceof Error ? error_.message : String(error_);
      fields.value = [];
      status.value = 'error';
      return false;
    }
  }

  /**
   * schema 晚到时校正业务对象（两段式解析，规格 §6.2）
   * @param nextBusinessObject schema 中的业务对象 code
   */
  async function switchTo(
    nextBusinessObject?: null | string,
  ): Promise<boolean> {
    if (!nextBusinessObject) return false;
    if (
      nextBusinessObject === businessObject.value &&
      status.value === 'ready'
    ) {
      return true;
    }
    return load(nextBusinessObject);
  }

  /** 重新加载当前业务对象（跳过缓存） */
  async function retry(): Promise<boolean> {
    if (!businessObject.value) return false;
    return load(businessObject.value, { force: true });
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
  function buildNode(meta: FieldMeta, scopeId: string): ComponentSchema | null {
    const componentType = mapFieldDataType(meta.type);
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
  function checkField(
    meta: FieldMeta,
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

  return {
    buildNode,
    businessObject,
    checkField,
    error,
    fieldMap,
    fields,
    getPlacedFields,
    isFieldPlaced,
    isLoading,
    isReady,
    issues,
    load,
    resolveScope,
    retry,
    status,
    switchTo,
  };
}

export type BusinessFieldsContext = ReturnType<typeof useBusinessFields>;

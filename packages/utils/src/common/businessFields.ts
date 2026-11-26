import type { ActionsModel } from '@nada-designer/manager';
import type {
  ComponentSchema,
  Property,
  PropertyType,
} from '@nada-designer/types';

import { deepClone, findSchemas, getMatchedById } from './data';
import { isValidSchemaName } from './string';

/** 预设属性白名单的固定例外：宿主协议字段，不参与白名单过滤 */
const PRESET_WHITELIST_EXCEPTIONS = new Set(['entity']);

/**
 * 元数据数据类型 → 组件层 type
 * @description 见 specs/controlled-mode.md §6.3.1，暂不支持的类型返回 null
 * @param dataType 元数据数据类型
 */
export function mapPropertyType(dataType: PropertyType): null | string {
  switch (dataType) {
    case 'boolean': {
      return 'switch';
    }
    case 'date': {
      return 'date';
    }
    case 'money':
    case 'number': {
      return 'number';
    }
    case 'ref': {
      return 'select';
    }
    case 'text': {
      return 'input';
    }
    default: {
      return null;
    }
  }
}

/**
 * 数据类型相关的预设属性
 * @description money / number 写 precision；ref 写 entity（白名单例外）；unit 不入 props
 * @param meta 业务字段元数据
 */
export function getFieldPresets(meta: Property): Record<string, unknown> {
  const presets: Record<string, unknown> = {};
  if (
    (meta.type === 'money' || meta.type === 'number') &&
    typeof meta.scale === 'number'
  ) {
    presets.precision = meta.scale;
  }
  if (meta.type === 'ref' && meta.entity) {
    presets.entity = meta.entity;
  }
  return presets;
}

/**
 * 按白名单过滤预设属性，`entity` 为固定例外
 * @param presets 预设属性
 * @param allowedProps 允许写入的属性名；不传表示不过滤
 */
function filterPresetProps(
  presets: Record<string, unknown>,
  allowedProps?: string[],
): Record<string, unknown> {
  if (!allowedProps) return presets;

  const allowed = new Set(allowedProps);
  return Object.fromEntries(
    Object.entries(presets).filter(
      ([key]) => allowed.has(key) || PRESET_WHITELIST_EXCEPTIONS.has(key),
    ),
  );
}

/**
 * 解析节点所属的作用域节点
 * @description 最近的 form 祖先；找不到时回退页面根节点（见 spec §8.1）
 * @param schemas 页面节点
 * @param nodeId 节点 id；不传时返回根节点
 */
export function resolveScopeNode(
  schemas: ComponentSchema[],
  nodeId?: string,
): ComponentSchema | null {
  const root = schemas[0] ?? null;
  if (!root) return null;
  if (!nodeId) return root;

  const path = getMatchedById(schemas, nodeId);
  for (let index = path.length - 1; index >= 0; index--) {
    if (path[index]?.type === 'form') {
      return path[index];
    }
  }
  return root;
}

/**
 * 判断作用域内是否已存在同 field 的输入节点（含旧页面自由字段）
 * @param scope 作用域节点
 * @param field 业务字段标识
 */
export function hasFieldInScope(
  scope: ComponentSchema | null,
  field: string,
): boolean {
  if (!scope || !field) return false;

  return Boolean(
    findSchemas(
      scope.children ?? [],
      (node) => node.input === true && node.field === field,
      true,
    ),
  );
}

interface BuildFieldSchemaParams {
  /** 允许写入的预设 props（当前 UI 库该组件的 config.attribute）；不传表示不过滤 */
  allowedProps?: string[];
  /** 映射后组件类型的 defaultSchema */
  base: ComponentSchema;
  /** 业务字段元数据 */
  meta: Property;
  /** 作用域节点 id */
  scopeId: string;
}

/**
 * 由元数据构造业务字段节点
 * @description 纯函数，不修改入参；字段身份、label、预设属性在此写入（见 spec §7.2）
 * @param params 构造参数
 * @param params.allowedProps 允许写入的预设 props；不传表示不过滤
 * @param params.base 映射后组件类型的 defaultSchema
 * @param params.meta 业务字段元数据
 * @param params.scopeId 作用域节点 id
 */
export function buildFieldSchema({
  allowedProps,
  base,
  meta,
  scopeId,
}: BuildFieldSchemaParams): ComponentSchema | null {
  if (!scopeId || !meta?.field || !meta?.label) return null;

  const presets = getFieldPresets(meta);
  const node = deepClone(base);
  node.id = `${scopeId}_${meta.field}`;
  node.field = meta.field;
  node.label = meta.label;
  node.props = {
    ...node.props,
    ...filterPresetProps(presets, allowedProps),
  };
  return node;
}

/**
 * 改写页面动作中引用的组件 id
 * @description 跨 form 移动后保持动作引用有效（见 spec §7.4）
 * @param schemas 页面节点
 * @param oldId 旧 id
 * @param newId 新 id
 * @returns 实际改写的引用数量
 */
export function rewriteComponentRefs(
  schemas: ComponentSchema[],
  oldId: string,
  newId: string,
): number {
  if (!oldId || !newId || oldId === newId) return 0;

  let count = 0;
  findSchemas(schemas, (node) => {
    const events = node.on;
    if (!events) return false;

    Object.values(events).forEach((actions) => {
      (actions as ActionsModel[]).forEach((action) => {
        if (action?.componentId === oldId) {
          action.componentId = newId;
          count += 1;
        }
      });
    });
    return false;
  });
  return count;
}

/**
 * 收集全页动作中出现的组件 id 引用
 * @param schemas 页面节点
 */
export function collectComponentRefIds(schemas: ComponentSchema[]): string[] {
  const ids = new Set<string>();

  findSchemas(schemas, (node) => {
    Object.values(node.on ?? {}).forEach((actions) => {
      (actions as ActionsModel[]).forEach((action) => {
        if (action?.componentId) {
          ids.add(action.componentId);
        }
      });
    });
    return false;
  });

  return [...ids];
}

/** 页面校验问题 */
export interface PageValidationIssue {
  message: string;
  type: 'duplicateField' | 'duplicateId' | 'invalidName';
}

/**
 * 受控模式导入校验：id / field 字符集、id 唯一、作用域内 field 唯一
 * @param schemas 页面节点
 */
export function validateControlledPage(
  schemas: ComponentSchema[],
): PageValidationIssue[] {
  const issues: PageValidationIssue[] = [];
  const rootId = schemas[0]?.id ?? '';
  const idCounts = new Map<string, number>();
  const fieldKeys = new Set<string>();

  const walk = (nodes: ComponentSchema[], scopeId: string) => {
    nodes.forEach((node) => {
      if (node.id) {
        if (!isValidSchemaName(node.id)) {
          issues.push({
            message: `节点 id 字符集非法：${node.id}`,
            type: 'invalidName',
          });
        }
        idCounts.set(node.id, (idCounts.get(node.id) ?? 0) + 1);
      }

      const nextScope = node.type === 'form' && node.id ? node.id : scopeId;

      if (node.input === true && node.field) {
        if (!isValidSchemaName(node.field)) {
          issues.push({
            message: `字段名字符集非法：${node.field}`,
            type: 'invalidName',
          });
        }
        const key = `${nextScope}:${node.field}`;
        if (fieldKeys.has(key)) {
          issues.push({
            message: `表单 ${nextScope} 内字段重复：${node.field}`,
            type: 'duplicateField',
          });
        } else {
          fieldKeys.add(key);
        }
      }

      if (node.children) walk(node.children, nextScope);
      Object.values(node.slots ?? {}).forEach((children) =>
        walk(children, nextScope),
      );
    });
  };

  walk(schemas, rootId);

  idCounts.forEach((count, id) => {
    if (count > 1) {
      issues.push({ message: `节点 id 重复：${id}`, type: 'duplicateId' });
    }
  });

  return issues;
}

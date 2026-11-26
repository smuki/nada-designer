import type { ComponentSchema, Property } from '@nada-designer/types';

import { computed, reactive, ref } from 'vue';

import { pluginManager } from '@nada-designer/manager';
import { vi } from 'vitest';

/** 测试用页面数据：根节点为 form */
export function makePageSchema(): any {
  return {
    modelId: '销售单据',
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [],
        id: 'root',
        label: '表单',
        props: { colon: true, name: 'default' },
        type: 'form',
      },
    ],
    script: '',
  };
}

/** 测试用业务字段元数据 */
export function makeProperties(): Property[] {
  return [
    { field: 'u_销售单号', label: '销售单号', type: 'text' },
    { field: 'u_销售金额', label: '销售金额', scale: 2, type: 'money' },
    { field: 'u_业务员', label: '业务员', type: 'ref', entity: 'organization.Staff' },
    { active: false, field: 'u_已废弃', label: '已废弃', type: 'text' },
  ];
}

/**
 * 注册测试用的最小组件集合
 * @description 组件面板/属性面板直接 import 单例 pluginManager，需注册后才能渲染
 */
export function registerMockComponents() {
  const specs: {
    attribute?: { field?: string; label?: string }[];
    groupName: string;
    type: string;
  }[] = [
    { groupName: '表单', type: 'input' },
    { groupName: '表单', type: 'number' },
    { groupName: '表单', type: 'switch' },
    { groupName: '表单', type: 'select' },
    { groupName: '布局', type: 'card' },
    { groupName: '布局', type: 'row' },
    { groupName: '布局', type: 'tabs' },
    { groupName: '表单', type: 'form' },
  ];

  specs.forEach(({ attribute, groupName, type }) => {
    const configAttribute =
      type === 'input'
        ? [
            { field: 'field', label: '数据字段', type: 'EpField' },
            { field: 'label', label: '标题', type: 'input' },
          ]
        : type === 'form'
          ? [{ field: 'props.name', label: 'Name', type: 'input' }]
          : (attribute ?? []);

    pluginManager.component.register({
      component: { render: () => null },
      config: {
        action: [],
        attribute: configAttribute as any,
      },
      defaultSchema: {
        field: type,
        input: type !== 'card' && type !== 'row' && type !== 'tabs',
        label: `组件-${type}`,
        props: {},
        type,
      },
      groupName,
    } as any);
  });
}

export interface MockDesignerContextOptions {
  designMode?: 'controlled' | 'free';
  properties?: Property[];
  pageSchema?: any;
  placedFields?: string[];
  selectedNode?: ComponentSchema;
}

/**
 * 构造 mock 的 DesignerContext（面板/属性面板消费的字段）
 */
export function makeDesignerContext(
  options: MockDesignerContextOptions = {},
): any {
  const pageSchema = options.pageSchema ?? makePageSchema();
  const selectedNode = options.selectedNode ?? pageSchema.schemas[0];
  const properties = options.properties ?? makeProperties();
  const placedFields = options.placedFields ?? [];

  const propertyMap = computed(() => {
    const map = new Map<string, Property>();
    properties
      .filter((item) => item.active !== false)
      .forEach((item) => map.set(item.field, item));
    return map;
  });

  const businessFields = {
    buildNode: () => null,
    modelId: ref('销售单据'),
    checkProperty: () => ({ ok: true }),
    error: ref(null),
    propertyMap,
    properties: ref(properties.filter((item) => item.active !== false)),
    getPlacedFields: () => placedFields,
    isFieldPlaced: (field: string) => placedFields.includes(field),
    isLoading: ref(false),
    isReady: ref(true),
    issues: ref([]),
    load: () => Promise.resolve(true),
    resolveScope: () => pageSchema.schemas[0],
    retry: () => Promise.resolve(true),
    status: ref('ready'),
    switchTo: () => Promise.resolve(true),
  };

  return {
    businessFields,
    designMode: options.designMode ?? 'controlled',
    handleDelete: () => undefined,
    handleDuplicate: () => undefined,
    handleImported: () => undefined,
    handleToggleDeviceMode: () => undefined,
    importSchema: () => Promise.resolve(true),
    pageSchema,
    preview: () => undefined,
    props: {},
    reset: () => undefined,
    revoke: { push: () => undefined },
    save: () => undefined,
    setDisabledHover: () => undefined,
    setHoverNode: () => undefined,
    setSelectedNode: () => undefined,
    state: reactive({
      disabledHover: false,
      hoverNode: null,
      matched: [selectedNode],
      selectedNode,
    }),
  };
}

/** 用 spy 覆盖全局 message，便于断言提示 */
export function spyGlobalMessage() {
  pluginManager.global.$message = {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  } as any;
  return pluginManager.global.$message as any;
}

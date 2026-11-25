import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./switch.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.defaultValue', label: '默认值', type: 'switch' },
      { field: 'props.label', label: '开关文本', type: 'input' },
      {
        field: 'props.size',
        label: '尺寸',
        props: {
          clearable: true,
          options: [
            { label: '大号', value: 'large' },
            { label: '中等', value: 'medium' },
            { label: '小型', value: 'small' },
          ],
        },
        type: 'select',
      },
      { field: 'props.loading', label: '加载状态', type: 'switch' },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        props: { ruleType: 'boolean' },
        type: 'ERuleEditor',
      },
    ],
    event: [{ description: '状态发生变化时', type: 'change' }],
  },
  defaultSchema: {
    field: 'switch',
    input: true,
    label: '开关',
    props: {},
    type: 'switch',
  },
  groupName: '表单',
  icon: 'icon--nada--toggle-off-outline',
  sort: 930,
} as ComponentConfigModel;

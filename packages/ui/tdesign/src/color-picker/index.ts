import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./color-picker.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      {
        field: 'props.format',
        label: '颜色格式',
        props: {
          clearable: true,
          options: [
            { label: 'HEX', value: 'HEX' },
            { label: 'RGB', value: 'RGB' },
            { label: 'RGBA', value: 'RGBA' },
            { label: 'HSL', value: 'HSL' },
            { label: 'CSS', value: 'CSS' },
          ],
        },
        type: 'select',
      },
      { field: 'props.enableAlpha', label: '透明度选择', type: 'switch' },
      {
        field: 'props.size',
        label: '尺寸',
        props: {
          clearable: true,
          options: [
            { label: '小号', value: 'small' },
            { label: '中等', value: 'medium' },
            { label: '大号', value: 'large' },
          ],
        },
        type: 'select',
      },
      { field: 'props.clearable', label: '可清空', type: 'switch' },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        type: 'ERuleEditor',
      },
    ],
    event: [{ description: '值变化时', type: 'change' }],
  },
  defaultSchema: {
    field: 'color',
    input: true,
    label: '颜色选择器',
    props: { format: 'HEX' },
    type: 'color-picker',
  },
  groupName: '表单',
  icon: 'icon--nada--palette-outline',
  sort: 950,
} as ComponentConfigModel;

import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./select.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.defaultValue', label: '默认值', type: 'input' },
      { field: 'props.placeholder', label: '占位内容', type: 'input' },
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
      { field: 'props.multiple', label: '可多选', type: 'switch' },
      { field: 'props.filterable', label: '可搜索', type: 'switch' },
      {
        field: 'props.reserveKeyword',
        label: '保留搜索关键字',
        type: 'switch',
      },
      { field: 'props.clearable', label: '可清空', type: 'switch' },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
      {
        description: '配置选项',
        field: 'props.options',
        label: '选项管理',
        layout: 'vertical',
        type: 'EOptionsEditor',
      },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        type: 'ERuleEditor',
      },
    ],
    event: [
      { description: '值变化时', type: 'change' },
      { description: '获取焦点时', type: 'focus' },
      { description: '失去焦点时', type: 'blur' },
      { description: '点击清空按钮时', type: 'clear' },
    ],
  },
  defaultSchema: {
    field: 'select',
    input: true,
    label: '选择器',
    props: {
      clearable: true,
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
      placeholder: '请选择',
    },
    type: 'select',
  },
  groupName: '表单',
  icon: 'icon--nada--select',
  sort: 900,
} as ComponentConfigModel;

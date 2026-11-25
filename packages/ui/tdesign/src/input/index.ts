import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./input.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.defaultValue', label: '默认值', type: 'input' },
      { field: 'props.placeholder', label: '占位内容', type: 'input' },
      { field: 'props.tips', label: '提示信息', type: 'input' },
      {
        defaultValue: 'medium',
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
      {
        field: 'props.maxlength',
        label: '最大输入长度',
        props: { min: 0 },
        type: 'number',
      },
      { field: 'props.clearable', label: '可清空', type: 'switch' },
      {
        field: 'props.status',
        label: '校验状态',
        props: {
          clearable: true,
          options: [
            { label: '默认', value: 'default' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' },
          ],
        },
        type: 'select',
      },
      { field: 'props.readonly', label: '只读', type: 'switch' },
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
    event: [
      { description: '值变化时', type: 'change' },
      { description: '获取焦点时', type: 'focus' },
      { description: '失去焦点时', type: 'blur' },
      { description: '点击清空按钮时', type: 'clear' },
    ],
  },
  defaultSchema: {
    field: 'input',
    input: true,
    label: '输入框',
    props: {
      clearable: true,
      placeholder: '请输入',
    },
    type: 'input',
  },
  groupName: '表单',
  icon: 'icon--nada--border-color-outline-rounded',
  sort: 700,
} as ComponentConfigModel;

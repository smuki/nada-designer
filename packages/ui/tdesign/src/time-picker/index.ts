import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./time-picker.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.placeholder', label: '占位内容', type: 'input' },
      {
        defaultValue: 'HH:mm:ss',
        field: 'props.format',
        label: '显示格式',
        type: 'input',
      },
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
      {
        description: '允许直接输入时间',
        field: 'props.allowInput',
        label: '允许输入',
        type: 'switch',
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
    event: [
      { description: '值变化时', type: 'change' },
      { description: '确认选择时', type: 'confirm' },
      { description: '获取焦点时', type: 'focus' },
      { description: '失去焦点时', type: 'blur' },
    ],
  },
  defaultSchema: {
    field: 'time',
    input: true,
    label: '时间选择器',
    props: {
      clearable: true,
      format: 'HH:mm:ss',
      placeholder: '请选择',
    },
    type: 'time',
  },
  groupName: '表单',
  icon: 'icon--nada--time-line',
  sort: 920,
} as ComponentConfigModel;

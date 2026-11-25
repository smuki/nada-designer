import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./input-number.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.defaultValue', label: '默认值', type: 'number' },
      { field: 'props.placeholder', label: '占位内容', type: 'input' },
      { field: 'props.min', label: '最小值', type: 'number' },
      { field: 'props.max', label: '最大值', type: 'number' },
      { field: 'props.step', label: '步长', type: 'number' },
      { field: 'props.precision', label: '精度', type: 'number' },
      {
        field: 'props.theme',
        label: '按钮布局',
        props: {
          clearable: true,
          options: [
            { label: '默认', value: 'normal' },
            { label: '纵向', value: 'column' },
            { label: '横向', value: 'row' },
          ],
        },
        type: 'select',
      },
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
      {
        field: 'props.align',
        label: '对齐方式',
        props: {
          clearable: true,
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' },
          ],
        },
        type: 'select',
      },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        props: { ruleType: 'number' },
        type: 'ERuleEditor',
      },
    ],
    event: [
      { description: '值变化时', type: 'change' },
      { description: '获取焦点时', type: 'focus' },
      { description: '失去焦点时', type: 'blur' },
    ],
  },
  defaultSchema: {
    field: 'number',
    input: true,
    label: '数字输入框',
    props: {
      max: 100,
      min: 0,
      step: 1,
      theme: 'normal',
    },
    type: 'number',
  },
  groupName: '表单',
  icon: 'icon--nada--123-rounded',
  sort: 710,
} as ComponentConfigModel;

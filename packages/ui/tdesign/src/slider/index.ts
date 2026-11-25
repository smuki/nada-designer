import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./slider.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.min', label: '最小值', type: 'number' },
      { field: 'props.max', label: '最大值', type: 'number' },
      { field: 'props.step', label: '步长', type: 'number' },
      { field: 'props.range', label: '开启选择范围', type: 'switch' },
      { field: 'props.showStep', label: '显示刻度', type: 'switch' },
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
      { description: '拖拽实时触发', type: 'change' },
      { description: '拖拽结束改变值时', type: 'end' },
    ],
  },
  defaultSchema: {
    field: 'slider',
    input: true,
    label: '滑块',
    props: {
      max: 100,
      min: 0,
      step: 1,
    },
    type: 'slider',
  },
  groupName: '表单',
  icon: 'icon--nada--switches',
  sort: 930,
} as ComponentConfigModel;

import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./checkbox.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.max', label: '最大选中数', type: 'number' },
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
        props: { ruleType: 'array' },
        type: 'ERuleEditor',
      },
    ],
    event: [{ description: '值变化时', type: 'change' }],
  },
  defaultSchema: {
    field: 'checkbox',
    input: true,
    label: '多选框',
    props: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
    },
    type: 'checkbox',
  },
  groupName: '表单',
  icon: 'icon--nada--dialogs-outline-rounded',
  sort: 860,
} as ComponentConfigModel;

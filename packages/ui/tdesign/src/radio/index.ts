import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./radio.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      {
        field: 'props.theme',
        label: '风格',
        props: {
          clearable: true,
          options: [
            { label: '单选', value: 'radio' },
            { label: '按钮', value: 'button' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.variant',
        label: '按钮风格',
        props: {
          clearable: true,
          options: [
            { label: '描边', value: 'outline' },
            { label: '主色填充', value: 'primary-filled' },
            { label: '默认填充', value: 'default-filled' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.direction',
        label: '排列方向',
        props: {
          clearable: true,
          options: [
            { label: '水平', value: 'horizontal' },
            { label: '垂直', value: 'vertical' },
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
    event: [{ description: '值变化时', type: 'change' }],
  },
  defaultSchema: {
    field: 'radio',
    input: true,
    label: '单选框',
    props: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
      theme: 'radio',
    },
    type: 'radio',
  },
  groupName: '表单',
  icon: 'icon--nada--radio-button-checked-outline',
  sort: 850,
} as ComponentConfigModel;

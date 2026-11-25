import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./button.vue'),
  config: {
    attribute: [
      { field: 'label', label: '标题', type: 'input' },
      {
        field: 'props.theme',
        label: '主题',
        props: {
          clearable: true,
          options: [
            { label: 'default', value: 'default' },
            { label: 'primary', value: 'primary' },
            { label: 'danger', value: 'danger' },
            { label: 'warning', value: 'warning' },
            { label: 'success', value: 'success' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.variant',
        label: '变体',
        props: {
          clearable: true,
          options: [
            { label: 'base', value: 'base' },
            { label: 'outline', value: 'outline' },
            { label: 'dashed', value: 'dashed' },
            { label: 'text', value: 'text' },
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
            { label: 'small', value: 'small' },
            { label: 'medium', value: 'medium' },
            { label: 'large', value: 'large' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.shape',
        label: '形状',
        props: {
          clearable: true,
          options: [
            { label: 'rectangle', value: 'rectangle' },
            { label: 'square', value: 'square' },
            { label: 'round', value: 'round' },
            { label: 'circle', value: 'circle' },
          ],
        },
        type: 'select',
      },
      { field: 'props.block', label: '块级按钮', type: 'switch' },
      { field: 'props.loading', label: '加载状态', type: 'switch' },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.ghost', label: '幽灵按钮', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
    ],
    event: [
      { description: '点击按钮时', type: 'click' },
      { description: '双击按钮时', type: 'dblclick' },
    ],
  },
  defaultSchema: {
    field: 'input',
    input: false,
    label: '按钮',
    props: {
      theme: 'primary',
      variant: 'base',
    },
    type: 'button',
  },
  editConstraints: {
    inline: true,
  },
  groupName: '表单',
  icon: 'icon--nada--fit-screen-rounded',
  sort: 1200,
} as ComponentConfigModel;

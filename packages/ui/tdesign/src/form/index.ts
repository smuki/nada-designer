import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./form.vue'),
  config: {
    action: [
      {
        description: '获取表单数据',
        type: 'getData',
      },
      {
        description: '设置表单数据',
        type: 'setData',
      },
      {
        description: '校验表单',
        type: 'validate',
      },
    ],
    attribute: [
      {
        field: 'props.name',
        label: 'Name',
        type: 'input',
      },
      {
        field: 'props.layout',
        label: '布局方式',
        props: {
          clearable: true,
          options: [
            {
              label: '水平',
              value: '',
            },
            {
              label: '垂直',
              value: 'vertical',
            },
            {
              label: '行内',
              value: 'inline',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.labelAlign',
        label: '标签对齐',
        props: {
          clearable: true,
          options: [
            {
              label: '左边',
              value: 'left',
            },
            {
              label: '右边',
              value: 'right',
            },
            {
              label: '顶部',
              value: 'top',
            },
          ],
          radioButton: true,
        },
        type: 'radio',
      },
      {
        field: 'props.labelWidth',
        label: '标签宽度',
        type: 'EInputSize',
      },
      {
        field: 'props.requiredMark',
        label: '必填星号',
        type: 'switch',
      },
      {
        field: 'props.showErrorMessage',
        label: '显示校验信息',
        type: 'switch',
      },
      {
        field: 'props.scrollToFirstError',
        label: '滚动到首个错误',
        type: 'switch',
      },
      {
        field: 'props.statusIcon',
        label: '校验反馈图标',
        type: 'switch',
      },
      {
        field: 'props.colon',
        label: '标签后加冒号',
        type: 'switch',
      },
      {
        field: 'props.resetType',
        label: '重置方式',
        props: {
          clearable: true,
          options: [
            {
              label: '清空',
              value: 'empty',
            },
            {
              label: '恢复初始值',
              value: 'initial',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.disabled',
        label: '禁用',
        type: 'switch',
      },
      {
        field: 'props.readonly',
        label: '只读',
        type: 'switch',
      },
      {
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
      },
    ],
  },
  defaultSchema: {
    label: '表单',
    props: {
      labelWidth: '100px',
      name: 'default',
    },
    type: 'form',
    children: [],
  },
  groupName: '表单',
  icon: 'icon--nada--list-alt-outline-rounded',
  sort: 600,
} as ComponentConfigModel;

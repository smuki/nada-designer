import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./tabs'),
  config: {
    action: [],
    attribute: [
      {
        field: 'props.placement',
        label: '页签位置',
        props: {
          clearable: true,
          options: [
            {
              label: 'top',
              value: 'top',
            },
            {
              label: 'right',
              value: 'right',
            },
            {
              label: 'bottom',
              value: 'bottom',
            },
            {
              label: 'left',
              value: 'left',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.theme',
        label: '类型',
        props: {
          clearable: true,
          options: [
            {
              label: '默认',
              value: 'normal',
            },
            {
              label: '卡片',
              value: 'card',
            },
          ],
          radioButton: true,
        },
        type: 'radio',
      },
      {
        field: 'children',
        label: '页签管理',
        layout: 'vertical',
        type: 'ETabPaneEditor',
      },
      {
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
      },
    ],
    event: [
      {
        description: '页签被选中时触发',
        type: 'change',
      },
    ],
  },
  defaultSchema: {
    label: '标签页',
    props: {
      defaultValue: '标签1',
      placement: 'top',
      theme: 'normal',
    },
    type: 'tabs',
    children: [
      {
        children: [],
        label: '标签1',
        type: 'tab-pane',
      },
      {
        children: [],
        label: '标签2',
        type: 'tab-pane',
      },
    ],
  },
  editConstraints: {
    childImmovable: true,
  },
  groupName: '布局',
  icon: 'icon--nada--layout-tabs',
} as ComponentConfigModel;

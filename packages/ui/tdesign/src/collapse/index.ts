import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./collapse'),
  config: {
    attribute: [
      {
        field: 'children',
        label: '折叠项管理',
        type: 'EColEditor',
      },
      {
        field: 'props.borderless',
        label: '无边框',
        type: 'switch',
      },
      {
        field: 'props.expandMutex',
        label: '手风琴模式',
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
    label: '折叠面板',
    type: 'collapse',
    children: [
      {
        children: [],
        type: 'collapse-item',
      },
      {
        children: [],
        type: 'collapse-item',
      },
    ],
  },
  icon: 'nada-icon-xiala',
} as ComponentConfigModel;

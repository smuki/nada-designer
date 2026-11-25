import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./tabPane'),
  config: {
    attribute: [
      {
        field: 'label',
        label: '页签标题',
        type: 'input',
      },
    ],
  },
  defaultSchema: {
    label: '标签内容',
    type: 'tab-pane',
    children: [],
  },
  editConstraints: {
    locked: true,
  },
} as ComponentConfigModel;

import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./collapseItem'),
  config: {
    attribute: [
      {
        field: 'label',
        label: '标题',
        type: 'input',
      },
    ],
  },
  defaultSchema: {
    label: '折叠项',
    type: 'collapse-item',
    children: [],
  },
} as ComponentConfigModel;

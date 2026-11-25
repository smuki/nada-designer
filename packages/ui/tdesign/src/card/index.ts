import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./card'),
  config: {
    attribute: [
      {
        field: 'label',
        label: '标题',
        type: 'input',
      },
      {
        field: 'props.bordered',
        label: '显示边框',
        type: 'switch',
      },
      {
        field: 'props.hoverShadow',
        label: '悬浮阴影',
        type: 'switch',
      },
      {
        field: 'props.shadow',
        label: '阴影',
        type: 'switch',
      },
      {
        field: 'props.size',
        label: '尺寸',
        props: {
          clearable: true,
          options: [
            {
              label: 'medium',
              value: 'medium',
            },
            {
              label: 'small',
              value: 'small',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
      },
    ],
  },
  defaultSchema: {
    label: '卡片布局',
    props: {},
    type: 'card',
    children: [],
  },
  groupName: '布局',
  icon: 'icon--nada--wysiwyg-rounded',
  sort: 700,
} as ComponentConfigModel;

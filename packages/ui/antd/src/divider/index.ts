import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./divider.vue'),
  config: {
    attribute: [
      {
        field: 'props.type',
        label: '线型',
        props: {
          options: [
            { label: '实线', value: 'solid' },
            { label: '虚线', value: 'dashed' },
            { label: '点线', value: 'dotted' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.color',
        label: '颜色',
        type: 'color-picker',
      },
      {
        field: 'props.thickness',
        label: '粗细',
        type: 'number',
      },
      {
        field: 'props.margin',
        label: '上下间距',
        type: 'number',
      },
    ],
  },
  defaultSchema: {
    label: '分隔线',
    props: {
      color: '#dcdfe6',
      margin: 8,
      thickness: 1,
      type: 'solid',
    },
    type: 'divider',
  },
  groupName: '展示',
  icon: 'icon--nada--border-color-outline-rounded',
  sort: 910,
} as ComponentConfigModel;

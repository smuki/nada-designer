import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./textBlock.vue'),
  config: {
    attribute: [
      {
        field: 'props.content',
        label: '说明内容',
        type: 'textarea',
      },
      {
        field: 'props.align',
        label: '对齐方式',
        props: {
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.fontSize',
        label: '字号',
        type: 'number',
      },
      {
        field: 'props.color',
        label: '颜色',
        type: 'color-picker',
      },
    ],
  },
  defaultSchema: {
    label: '说明文字',
    props: {
      align: 'left',
      content: '说明文字',
      fontSize: 14,
    },
    type: 'text-block',
  },
  groupName: '展示',
  icon: 'icon--nada--edit-square-outline-rounded',
  sort: 900,
} as ComponentConfigModel;

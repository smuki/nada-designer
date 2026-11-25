import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  bindModel: 'modelValue',
  component: () => import('./uploadFile'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.action', label: '请求地址', type: 'input' },
      { field: 'props.name', label: '上传字段', type: 'input' },
      { field: 'props.multiple', label: '多选', type: 'switch' },
      {
        field: 'props.max',
        label: '最大数量',
        props: { min: 0 },
        type: 'number',
      },
      { field: 'props.accept', label: '文件类型', type: 'input' },
      { field: 'props.tips', label: '提示', type: 'input' },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        props: { ruleType: 'string' },
        type: 'ERuleEditor',
      },
    ],
    event: [{ description: '值变化时', type: 'change' }],
  },
  defaultSchema: {
    field: 'uploadFile',
    input: true,
    label: '上传文件',
    props: {
      // 上传地址留空，由 pluginManager.global.uploadFile 或用户在属性面板中设置
      action: undefined,
      name: 'file',
    },
    type: 'upload-file',
  },
  groupName: '表单',
  icon: 'icon--nada--upload-rounded',
  sort: 920,
} as ComponentConfigModel;

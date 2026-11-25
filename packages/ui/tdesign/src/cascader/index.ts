import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./cascader.vue'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      {
        description: '配置选项',
        field: 'props.options',
        label: '选项管理',
        layout: 'vertical',
        props: { tree: true },
        type: 'EOptionsEditor',
      },
      { field: 'props.placeholder', label: '占位内容', type: 'input' },
      {
        field: 'props.size',
        label: '尺寸',
        props: {
          clearable: true,
          options: [
            { label: '小号', value: 'small' },
            { label: '中等', value: 'medium' },
            { label: '大号', value: 'large' },
          ],
        },
        type: 'select',
      },
      { field: 'props.multiple', label: '可多选', type: 'switch' },
      { field: 'props.filterable', label: '可搜索', type: 'switch' },
      {
        description: '父子节点不互相关联',
        field: 'props.checkStrictly',
        label: '父级可选',
        type: 'switch',
      },
      {
        description:
          'onlyLeaf 仅叶子节点；parentFirst 父节点优先；all 任意节点',
        field: 'props.valueMode',
        label: '选中值模式',
        props: {
          clearable: true,
          options: [
            { label: '仅叶子节点', value: 'onlyLeaf' },
            { label: '父节点优先', value: 'parentFirst' },
            { label: '任意节点', value: 'all' },
          ],
        },
        type: 'select',
      },
      {
        description: 'single 仅存叶子值；full 存完整路径数组',
        field: 'props.valueType',
        label: '值类型',
        props: {
          clearable: true,
          options: [
            { label: '单值', value: 'single' },
            { label: '完整路径', value: 'full' },
          ],
        },
        type: 'select',
      },
      { field: 'props.clearable', label: '可清空', type: 'switch' },
      { field: 'props.disabled', label: '禁用', type: 'switch' },
      { field: 'props.hidden', label: '隐藏', type: 'switch' },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        type: 'ERuleEditor',
      },
    ],
    event: [
      { description: '值变化时', type: 'change' },
      { description: '失去焦点时', type: 'blur' },
      { description: '获取焦点时', type: 'focus' },
    ],
  },
  defaultSchema: {
    field: 'cascader',
    input: true,
    label: '级联选择器',
    props: {
      clearable: true,
      options: [
        {
          label: '选项1',
          value: '1',
          children: [{ label: '选项1-1', value: '1-1' }],
        },
        { label: '选项2', value: '2' },
      ],
      placeholder: '请选择',
      valueMode: 'onlyLeaf',
      valueType: 'single',
    },
    type: 'cascader',
  },
  groupName: '表单',
  icon: 'icon--nada--full-coverage-outline',
  sort: 900,
} as ComponentConfigModel;

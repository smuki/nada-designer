import type { ComponentConfigModel } from '@nada-designer/types';

export default {
  component: () => import('./date-picker'),
  config: {
    attribute: [
      { field: 'field', label: '数据字段', type: 'EpField' },
      { field: 'label', label: '标题', type: 'input' },
      { field: 'props.defaultValue', label: '默认值', type: 'input' },
      {
        field: 'props.type',
        label: '日期类型',
        onChange: ({ value, values }: any) => {
          values.props.defaultValue = null;
          if (['year', 'yearrange'].includes(value)) {
            values.props.valueFormat = 'YYYY';
          } else if (['month', 'monthrange'].includes(value)) {
            values.props.valueFormat = 'YYYY-MM';
          } else {
            values.props.valueFormat = 'YYYY-MM-DD';
          }
        },
        props: {
          clearable: true,
          options: [
            { label: '日期', value: 'date' },
            { label: '月份', value: 'month' },
            { label: '年份', value: 'year' },
            { label: '日期范围', value: 'daterange' },
            { label: '月份范围', value: 'monthrange' },
            { label: '年份范围', value: 'yearrange' },
          ],
        },
        type: 'select',
      },
      { field: 'props.placeholder', label: '占位内容', type: 'input' },
      { field: 'props.valueFormat', label: '数据格式', type: 'input' },
      {
        field: 'props.size',
        label: '尺寸',
        props: {
          clearable: true,
          options: [
            { label: '大号', value: 'large' },
            { label: '中等', value: 'medium' },
            { label: '小型', value: 'small' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.enableTimePicker',
        label: '可选择时间',
        show: ({ values }: any) => values.props.type !== 'year',
        type: 'switch',
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
      { description: '确认选择时', type: 'confirm' },
    ],
  },
  defaultSchema: {
    field: 'date',
    input: true,
    label: '日期选择器',
    props: {
      clearable: true,
      placeholder: '请选择',
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
    },
    type: 'date',
  },
  groupName: '表单',
  icon: 'icon--nada--calendar-month-outline-rounded',
  sort: 910,
} as ComponentConfigModel;

import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { defineComponent, h } from 'vue';

import { DatePicker, DateRangePicker } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

// 日期模式，与日期范围模式共用
const DATE_MODES = new Set(['date', 'month', 'year']);

export default defineComponent({
  inheritAttrs: false,
  name: 'TDatePicker',
  props: {
    componentSchema: {
      default: undefined,
      type: Object as PropType<ComponentSchema>,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const schemaProps = props.componentSchema?.props ?? {};
      const type: string = schemaProps.type ?? 'date';
      const mode = type.replace(/range$/, '');
      const isRange = type.includes('range');

      // type 与 valueFormat 只用于推导组件与 valueType，不直接传给组件
      const forwardProps: Record<string, any> = {
        ...normalizeSize(attrs as Record<string, unknown>),
      };
      delete forwardProps.type;
      delete forwardProps.valueFormat;

      if (DATE_MODES.has(mode)) {
        forwardProps.mode = mode;
      }
      // 统一以字符串作为绑定值，保证数据可直接序列化
      forwardProps.valueType =
        attrs.valueFormat ?? schemaProps.valueFormat ?? 'YYYY-MM-DD';

      // 区间选择器与单值选择器的 props 定义不同，这里按运行时分支，类型上做收窄
      const Picker = (isRange ? DateRangePicker : DatePicker) as any;
      return h(Picker, sanitizeAttrs(Picker, forwardProps));
    };
  },
});

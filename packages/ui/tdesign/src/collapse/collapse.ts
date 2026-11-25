import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { defineComponent, h, renderSlot } from 'vue';

import { Collapse as TCollapse } from 'tdesign-vue-next';

export default defineComponent({
  inheritAttrs: false,
  props: {
    componentSchema: {
      default: () => ({}),
      type: Object as PropType<ComponentSchema>,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const segmentSchema = props.componentSchema ?? {};
      const children = segmentSchema.children ?? [];
      const editNodes = slots['edit-node']?.() ?? [];
      const isDesignMode = editNodes.length > 0;

      // 设计态默认展开全部，保证折叠项内容可直接拖拽编辑
      const designValues = children.map(
        (child, index) => child.label ?? child.id ?? index,
      );

      const collapseProps: Record<string, any> = {
        ...attrs,
        ...segmentSchema.props,
        modelValue: isDesignMode
          ? designValues
          : segmentSchema.props?.modelValue,
      };

      return h(TCollapse, collapseProps, {
        default: () => [
          renderSlot(slots, 'edit-node', {}, () =>
            children.map((child) =>
              renderSlot(slots, 'node', { componentSchema: child }),
            ),
          ),
        ],
      });
    };
  },
});

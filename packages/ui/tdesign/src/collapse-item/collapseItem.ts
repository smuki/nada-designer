import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { defineComponent, h, renderSlot } from 'vue';

import { CollapsePanel as TCollapsePanel } from 'tdesign-vue-next';

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
      const schema = props.componentSchema ?? {};
      const children = schema.children ?? [];

      const panelProps: Record<string, any> = {
        ...attrs,
        ...schema.props,
        header: schema.label ?? '',
        value: schema.label ?? schema.id,
      };
      delete panelProps.children;

      return h(TCollapsePanel, panelProps, {
        default: () =>
          renderSlot(slots, 'edit-node', {}, () =>
            children.map((child) =>
              renderSlot(slots, 'node', { componentSchema: child }),
            ),
          ),
      });
    };
  },
});

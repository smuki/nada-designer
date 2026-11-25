import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { defineComponent, h, renderSlot } from 'vue';

import { Card as TCard } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

export default defineComponent({
  inheritAttrs: false,
  props: {
    componentSchema: {
      default: () => ({}),
      required: true,
      type: Object as PropType<ComponentSchema>,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const componentSchema = {
        ...props.componentSchema,
        title: props.componentSchema?.label ?? '',
      } as ComponentSchema;
      const children = componentSchema.children ?? [];
      delete componentSchema.children;

      return h(
        TCard,
        {
          ...sanitizeAttrs(
            TCard,
            normalizeSize(attrs as Record<string, unknown>),
          ),
          ...componentSchema,
        },
        {
          default: () =>
            renderSlot(slots, 'edit-node', {}, () =>
              children.map((node: ComponentSchema) =>
                renderSlot(slots, 'node', { componentSchema: node }),
              ),
            ),
        },
      );
    };
  },
});

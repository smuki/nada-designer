import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { defineComponent, h, renderSlot } from 'vue';

import { Row as TRow } from 'tdesign-vue-next';

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
        TRow,
        { ...attrs, ...componentSchema },
        {
          default: () => [
            renderSlot(slots, 'edit-node', {}, () =>
              children.map((subcomponentSchema: ComponentSchema) =>
                renderSlot(slots, 'node', {
                  componentSchema: subcomponentSchema,
                }),
              ),
            ),
          ],
        },
      );
    };
  },
});

import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { defineComponent, h, inject, renderSlot } from 'vue';

import { TabPanel as TTabPanel } from 'tdesign-vue-next';

export default defineComponent({
  inheritAttrs: false,
  props: {
    componentSchema: {
      default: () => ({}),
      type: Object as PropType<ComponentSchema>,
    },
  },
  setup(props, { slots }) {
    // TTabs 通过 provide('tabs') 提供上下文；设计态下本组件由 Tabs 的编辑列表直接渲染，
    // 此时没有 tabs 上下文，TTabPanel 内部 inject 会拿到 undefined 并报错
    const tabsContext = inject<null | { value: unknown }>('tabs', null);

    return () => {
      const schema = props.componentSchema ?? {};
      const children = schema.children ?? [];
      const label = schema.label ?? '';
      const renderChildren = () =>
        renderSlot(slots, 'edit-node', {}, () =>
          children.map((child) =>
            renderSlot(slots, 'node', { componentSchema: child }),
          ),
        );

      if (!tabsContext) {
        return h('div', { class: 'ep-tdesign-tab-pane-design' }, [
          h(
            'div',
            { class: 'ep-tdesign-tab-pane-design__header' },
            label || '标签',
          ),
          h('div', { class: 'ep-tdesign-tab-pane-design__content' }, [
            renderChildren(),
          ]),
        ]);
      }

      return h(TTabPanel, { label, value: label }, { default: renderChildren });
    };
  },
});

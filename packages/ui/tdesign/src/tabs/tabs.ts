import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import {
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  ref,
  renderSlot,
  Text,
  watch,
} from 'vue';

import { Tabs as TTabs } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

export default defineComponent({
  inheritAttrs: false,
  props: {
    componentSchema: {
      default: () => ({}),
      type: Object as PropType<ComponentSchema>,
    },
  },
  setup(props, { attrs, slots }) {
    const activeValue = ref<number | string>('');
    const children = computed(() => props.componentSchema?.children ?? []);

    // 页签值以标签名标识，与设计器 children.label 保持一致
    function paneValue(pane: ComponentSchema, index: number): number | string {
      return pane.label ?? pane.id ?? index;
    }

    watch(
      () => props.componentSchema?.props?.defaultValue,
      (newValue) => {
        const labels = children.value
          .map((node) => node.label)
          .filter(Boolean) as string[];
        activeValue.value = labels.includes(newValue as string)
          ? (newValue as string)
          : (labels[0] ?? '');
      },
      {
        immediate: true,
      },
    );

    // node.vue 在运行时也会转发一个空的 edit-node 插槽（渲染为注释节点），
    // 因此不能仅用「插槽是否返回内容」判断设计态，必须过滤注释/文本/空 Fragment
    function getDesignNodes() {
      const nodes = slots['edit-node']?.() ?? [];
      return nodes.filter(
        (node: any) =>
          node &&
          node.type !== Comment &&
          node.type !== Text &&
          node.type !== Fragment,
      );
    }

    return () => {
      const editNodes = getDesignNodes();

      // 设计态：TTabs 只会收集 type.name === 'TTabPanel' 的子节点（源码 getSlotPanels 硬过滤），
      // 无法接收 NadaNodes 可拖拽列表，因此退化为纵向可编辑面板；预览态仍使用真实 Tabs
      if (editNodes.length > 0) {
        return h('div', { class: 'ep-tdesign-tabs-design' }, [
          h(
            'div',
            { class: 'ep-tdesign-tabs-design__header' },
            children.value.map((pane, index) =>
              h(
                'span',
                {
                  class: [
                    'ep-tdesign-tabs-design__tab',
                    paneValue(pane, index) === activeValue.value
                      ? 'ep-tdesign-tabs-design__tab--active'
                      : '',
                  ],
                  onClick: () => {
                    activeValue.value = paneValue(pane, index);
                  },
                },
                pane.label ?? `标签${index + 1}`,
              ),
            ),
          ),
          h('div', { class: 'ep-tdesign-tabs-design__content' }, editNodes),
        ]);
      }

      // 预览态：通过 list 渲染，TTabs 内部据此创建 TTabPanel，panel 提供每个页签的内容
      const tabsProps: Record<string, any> = {
        ...sanitizeAttrs(
          TTabs,
          normalizeSize(attrs as Record<string, unknown>),
        ),
        ...props.componentSchema?.props,
        modelValue: activeValue.value,
        'onUpdate:modelValue': (value: number | string) => {
          activeValue.value = value;
        },
        list: children.value.map((pane, index) => ({
          label: pane.label ?? `标签${index + 1}`,
          panel: () =>
            (pane.children ?? []).map((child) =>
              renderSlot(slots, 'node', { componentSchema: child }),
            ),
          value: paneValue(pane, index),
        })),
      };
      // defaultValue 是设计器内部字段（用于确定初始页签），不传给 TDesign
      delete tabsProps.defaultValue;

      return h(TTabs, tabsProps);
    };
  },
});

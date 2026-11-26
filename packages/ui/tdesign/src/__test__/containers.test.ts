import type { ComponentSchema } from '@nada-designer/types';

import { mount } from '@vue/test-utils';
import { Button as TButton } from 'tdesign-vue-next';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import Button from '../button/button.vue';
import Card from '../card/card';
import Col from '../col/col';
import Collapse from '../collapse/collapse';
import Modal from '../modal/modal.vue';
import Row from '../row/row';
import TabPane from '../tab-pane/tabPane';
import Tabs from '../tabs/tabs';

/**
 * 容器组件结构测试
 *
 * TDesign 的 TTabs 只收集 `type.name === 'TTabPanel'` 的直接子节点（源码 getSlotPanels 硬过滤），
 * 因此 tabs 包装器必须走 list + panel；这里把「预览态渲染真实 Tabs、设计态渲染可编辑面板」的行为钉住。
 */

const tabsSchema: ComponentSchema = {
  children: [
    { children: [], label: '标签1', type: 'tab-pane' },
    { children: [], label: '标签2', type: 'tab-pane' },
  ],
  label: '标签页',
  props: { defaultValue: '标签1' },
  type: 'tabs',
};

const renderNode = (data: any) =>
  h('div', { class: 'pane-child' }, data.componentSchema?.label ?? 'child');

describe('tabs 容器', () => {
  it('预览态渲染 TDesign Tabs，并通过 node 插槽渲染页签内容', () => {
    const wrapper = mount(Tabs as any, {
      props: { componentSchema: tabsSchema },
      slots: { node: renderNode },
    });

    // TDesign Tabs 的根类名为 t-tabs
    expect(wrapper.find('.t-tabs').exists()).toBe(true);
    expect(wrapper.html()).toContain('标签1');
  });

  it('预览态通过 list 声明页签，值取标签名', () => {
    const wrapper = mount(Tabs as any, {
      props: { componentSchema: tabsSchema },
      slots: { node: renderNode },
    });

    const tabs = wrapper.findComponent({ name: 'TTabs' });
    const list = tabs.props('list') as Array<{
      label: string;
      panel: () => unknown[];
      value: string;
    }>;
    expect(list).toHaveLength(2);
    expect(list.map((item) => item.value)).toEqual(['标签1', '标签2']);
    expect(list[0].label).toBe('标签1');
  });

  it('切换页签时更新内部激活值', async () => {
    const wrapper = mount(Tabs as any, {
      props: { componentSchema: tabsSchema },
      slots: { node: renderNode },
    });

    wrapper
      .findComponent({ name: 'TTabs' })
      .vm.$emit('update:modelValue', '标签2');
    await nextTick();

    expect(wrapper.findComponent({ name: 'TTabs' }).props('modelValue')).toBe(
      '标签2',
    );
  });

  it('设计态退化为可编辑面板，并保留 edit-node 内容', () => {
    const wrapper = mount(Tabs as any, {
      props: { componentSchema: tabsSchema },
      slots: {
        'edit-node': () => [h('div', { class: 'edit-node-stub' }, 'edit')],
      },
    });

    expect(wrapper.find('.ep-tdesign-tabs-design').exists()).toBe(true);
    expect(wrapper.find('.edit-node-stub').exists()).toBe(true);
    // 设计态不应渲染真实 Tabs（会被 TTabPanel 过滤导致空白）
    expect(wrapper.find('.t-tabs').exists()).toBe(false);
  });
});

describe('tab-pane 容器', () => {
  it('无 tabs 上下文（设计态）时渲染可编辑占位块', () => {
    const wrapper = mount(TabPane as any, {
      props: {
        componentSchema: {
          children: [{ children: [], label: '子节点', type: 'input' }],
          label: '标签1',
          type: 'tab-pane',
        },
      },
      slots: { node: renderNode },
    });

    expect(wrapper.find('.ep-tdesign-tab-pane-design').exists()).toBe(true);
    expect(wrapper.find('.pane-child').exists()).toBe(true);
    expect(wrapper.html()).toContain('标签1');
  });
});

describe('collapse 容器', () => {
  const collapseSchema: ComponentSchema = {
    children: [
      { children: [], label: '折叠1', type: 'collapse-item' },
      { children: [], label: '折叠2', type: 'collapse-item' },
    ],
    label: '折叠面板',
    type: 'collapse',
  };

  it('渲染 TDesign Collapse，并通过 edit-node 渲染折叠项', () => {
    const wrapper = mount(Collapse as any, {
      props: { componentSchema: collapseSchema },
      slots: {
        'edit-node': () => [h('div', { class: 'collapse-item-stub' }, 'item')],
      },
    });

    expect(wrapper.find('.t-collapse').exists()).toBe(true);
    expect(wrapper.find('.collapse-item-stub').exists()).toBe(true);
  });

  it('设计态默认展开全部折叠项（保证内容可编辑）', () => {
    const wrapper = mount(Collapse as any, {
      props: { componentSchema: collapseSchema },
      slots: {
        'edit-node': () => [h('div', { class: 'collapse-item-stub' })],
      },
    });

    const collapse = wrapper.findComponent({ name: 'TCollapse' });
    expect(collapse.props('modelValue')).toEqual(['折叠1', '折叠2']);
  });
});

describe('modal 容器', () => {
  const modalSchema: ComponentSchema = {
    children: [],
    label: '对话框',
    type: 'modal',
  };

  it('modelValue 桥接为 TDialog 的 visible', () => {
    const wrapper = mount(Modal as any, {
      global: { stubs: { teleport: true } },
      props: { componentSchema: modalSchema, modelValue: true },
    });

    const dialog = wrapper.findComponent({ name: 'TDialog' });
    expect(dialog.props('visible')).toBe(true);
    expect(dialog.props('header')).toBe('对话框');
  });

  it('TDialog 关闭时向外派发 update:modelValue', () => {
    const wrapper = mount(Modal as any, {
      global: { stubs: { teleport: true } },
      props: { componentSchema: modalSchema, modelValue: true },
    });

    wrapper
      .findComponent({ name: 'TDialog' })
      .vm.$emit('update:visible', false);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(false);
  });

  it('隐藏状态懒渲染：未打开时不挂载内容（避免提前挂载 Monaco 等重组件）', async () => {
    const wrapper = mount(Modal as any, {
      global: { stubs: { teleport: true } },
      props: { modelValue: false },
      slots: {
        default: () => h('div', { class: 'lazy-guard-marker' }, 'hidden'),
      },
    });

    await nextTick();
    expect(wrapper.find('.lazy-guard-marker').exists()).toBe(false);
    wrapper.unmount();
  });

  it('确认/取消按钮派发 ok / close 事件', async () => {
    const wrapper = mount(Modal as any, {
      props: { componentSchema: modalSchema, modelValue: true },
    });

    await nextTick();
    await nextTick();

    // TDialog 通过 Teleport 挂载到 body，因此从 document 查询最后一个弹窗内的按钮
    const dialogs = document.body.querySelectorAll('.t-dialog__ctx');
    const dialog = Array.from(dialogs).at(-1) as HTMLElement;
    const buttons = Array.from(
      dialog.querySelectorAll('.t-button'),
    ) as HTMLElement[];

    expect(buttons.length).toBeGreaterThanOrEqual(2);

    buttons.at(-1)!.click();
    await nextTick();
    expect(wrapper.emitted('ok')).toBeTruthy();

    buttons.at(0)!.click();
    await nextTick();
    expect(wrapper.emitted('close')).toBeTruthy();

    // 清理 Teleport 到 body 的内容，避免影响后续用例
    wrapper.unmount();
  });
});
describe('card / row / col 容器', () => {
  it('card：label 作为 title，children 通过 node 插槽渲染', () => {
    const wrapper = mount(Card as any, {
      props: {
        componentSchema: {
          children: [{ children: [], label: '子节点', type: 'input' }],
          label: '卡片标题',
          type: 'card',
        },
      },
      slots: { node: renderNode },
    });

    expect(wrapper.find('.t-card').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'TCard' }).props('title')).toBe(
      '卡片标题',
    );
    expect(wrapper.find('.pane-child').exists()).toBe(true);
  });

  it('row：gutter 透传并将子节点交给 edit-node', () => {
    const wrapper = mount(Row as any, {
      attrs: { gutter: 12 },
      props: {
        componentSchema: {
          children: [{ children: [], type: 'col' }],
          label: '栅格布局',
          props: { gutter: 12 },
          type: 'row',
        },
      },
      slots: {
        'edit-node': () => [h('div', { class: 'col-stub' })],
      },
    });

    expect(wrapper.findComponent({ name: 'TRow' }).props('gutter')).toBe(12);
    expect(wrapper.find('.col-stub').exists()).toBe(true);
  });

  it('col：span 透传并渲染子节点', () => {
    // 单独挂载 TCol 时缺少 rowContext，TDesign 会打印注入告警，这里静默掉
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(Col as any, {
      attrs: { span: 8 },
      props: {
        componentSchema: {
          children: [{ children: [], label: '子节点', type: 'input' }],
          label: '列',
          props: { span: 8 },
          type: 'col',
        },
      },
      slots: { node: renderNode },
    });

    expect(wrapper.findComponent({ name: 'TCol' }).props('span')).toBe(8);
    expect(wrapper.find('.pane-child').exists()).toBe(true);
    warnSpy.mockRestore();
  });
});

describe('直接使用（设计器外壳）时的插槽与标题', () => {
  it('button：渲染默认插槽内容（头部「预览/保存」按钮靠插槽传图标与文案）', () => {
    const wrapper = mount(Button as any, {
      props: { componentSchema: { label: '兜底文案', type: 'button' } },
      slots: { default: () => '插槽文案' },
    });

    expect(wrapper.text()).toContain('插槽文案');
    expect(wrapper.text()).not.toContain('兜底文案');
  });

  it('button：无插槽时回退到 componentSchema.label', () => {
    const wrapper = mount(Button as any, {
      props: { componentSchema: { label: '兜底文案', type: 'button' } },
    });

    expect(wrapper.text()).toContain('兜底文案');
  });

  it('modal：无 componentSchema 时 header 回退到 title，并渲染默认插槽', async () => {
    const wrapper = mount(Modal as any, {
      attrs: { title: '预览' },
      props: { modelValue: false },
      slots: {
        default: () => h('div', { class: 'modal-slot-content' }, '弹窗内容'),
      },
    });

    // 直接使用时为懒渲染：需要真实打开一次才会挂载内容
    await wrapper.setProps({ modelValue: true });
    await nextTick();
    await nextTick();

    // 直接使用场景的标题来自 attrs.title
    expect(wrapper.findComponent({ name: 'TDialog' }).props('header')).toBe(
      '预览',
    );

    // Teleport 到 body，从 document 查询
    const dialogs = document.body.querySelectorAll('.t-dialog__ctx');
    const dialog = Array.from(dialogs).at(-1) as HTMLElement;
    expect(dialog.querySelector('.modal-slot-content')?.textContent).toBe(
      '弹窗内容',
    );

    wrapper.unmount();
  });
});

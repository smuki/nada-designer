import type { ComponentSchema } from '@nada-designer/types';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import Collapse from '../collapse/collapse';
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
      global: { stubs: { teleport: true } },
      props: { componentSchema: tabsSchema },
      slots: { node: renderNode },
    });

    // TDesign Tabs 的根类名为 t-tabs
    expect(wrapper.find('.t-tabs').exists()).toBe(true);
    expect(wrapper.html()).toContain('标签1');
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
  it('渲染 TDesign Collapse，并通过 edit-node 渲染折叠项', () => {
    const wrapper = mount(Collapse as any, {
      props: {
        componentSchema: {
          children: [
            { children: [], label: '折叠1', type: 'collapse-item' },
            { children: [], label: '折叠2', type: 'collapse-item' },
          ],
          label: '折叠面板',
          type: 'collapse',
        },
      },
      slots: {
        'edit-node': () => [h('div', { class: 'collapse-item-stub' }, 'item')],
      },
    });

    expect(wrapper.find('.t-collapse').exists()).toBe(true);
    expect(wrapper.find('.collapse-item-stub').exists()).toBe(true);
  });
});

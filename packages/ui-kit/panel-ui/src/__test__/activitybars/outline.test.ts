// 先加载 manager，建立正确的模块加载顺序（否则 utils ↔ manager ↔ hooks 循环依赖会初始化不完整）
import '@nada-designer/manager';

import { DESIGNER_CONTEXT_KEY } from '@nada-designer/hooks';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

import {
  makeDesignerContext,
  registerMockComponents,
} from '../helpers/mockDesigner';

let OutlineView: any;

beforeAll(async () => {
  registerMockComponents();
  ({ default: OutlineView } = await import(
    '../../activitybars/outline/outline.vue'
  ));
});

function mountOutline(designMode: 'controlled' | 'free') {
  const context = makeDesignerContext({ designMode });
  return mount(OutlineView, {
    global: {
      provide: { [DESIGNER_CONTEXT_KEY as any]: context },
    },
  });
}

describe('大纲 · 受控模式', () => {
  it('禁用大纲拖拽', () => {
    const wrapper = mountOutline('controlled');
    const tree = wrapper.findComponent({ name: 'ETree' });

    expect(tree.exists()).toBe(true);
    expect(tree.props('draggable')).toBe(false);
  });
});

describe('大纲 · 自由模式', () => {
  it('允许大纲拖拽', () => {
    const wrapper = mountOutline('free');
    const tree = wrapper.findComponent({ name: 'ETree' });

    expect(tree.exists()).toBe(true);
    expect(tree.props('draggable')).toBe(true);
  });
});

// 先加载 manager，建立正确的模块加载顺序（否则 utils ↔ manager ↔ hooks 循环依赖会初始化不完整）
import '@nada-designer/manager';

import { DESIGNER_CONTEXT_KEY } from '@nada-designer/hooks';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

import type { MockDesignerContextOptions } from '../helpers/mockDesigner';

import {
  makeDesignerContext,
  registerMockComponents,
  spyGlobalMessage,
} from '../helpers/mockDesigner';

let ComponentView: any;

beforeAll(async () => {
  registerMockComponents();
  ({ default: ComponentView } = await import(
    '../../activitybars/componentView/index.vue'
  ));
});

function mountPanel(options: MockDesignerContextOptions = {}) {
  const context = makeDesignerContext(options);
  const message = spyGlobalMessage();
  const wrapper = mount(ComponentView, {
    global: {
      provide: { [DESIGNER_CONTEXT_KEY as any]: context },
    },
  });
  return { context, message, wrapper };
}

describe('组件面板 · 受控模式', () => {
  it('只展示业务字段与布局白名单', () => {
    const { wrapper } = mountPanel({ designMode: 'controlled' });
    const text = wrapper.text();

    expect(text).toContain('业务字段');
    expect(text).toContain('销售单号');
    expect(text).toContain('销售金额');
    // active:false 的字段不出现
    expect(text).not.toContain('已废弃');
    // 布局白名单
    expect(text).toContain('组件-card');
    expect(text).toContain('组件-row');
    expect(text).toContain('组件-tabs');
    expect(text).toContain('组件-form');
  });

  it('不展示原始输入组件', () => {
    const { wrapper } = mountPanel({ designMode: 'controlled' });
    const text = wrapper.text();

    expect(text).not.toContain('组件-input');
    expect(text).not.toContain('组件-number');
    expect(text).not.toContain('组件-switch');
    expect(text).not.toContain('组件-select');
  });

  it('已放置字段置灰且点击给出提示', async () => {
    const { message, wrapper } = mountPanel({
      designMode: 'controlled',
      placedFields: ['u_销售单号'],
    });

    const placed = wrapper.findAll('.ep-component-item.is-placed');
    expect(placed.length).toBe(1);
    expect(placed[0].text()).toContain('销售单号');

    await placed[0].trigger('click');
    expect(message.info).toHaveBeenCalled();
  });
});

describe('组件面板 · 自由模式', () => {
  it('展示注册组件、不展示业务字段', () => {
    const { wrapper } = mountPanel({ designMode: 'free' });
    const text = wrapper.text();

    expect(text).toContain('组件-number');
    expect(text).toContain('组件-switch');
    expect(text).not.toContain('销售单号');
  });

  it('没有置灰项', () => {
    const { wrapper } = mountPanel({ designMode: 'free' });
    expect(wrapper.findAll('.is-placed').length).toBe(0);
  });
});

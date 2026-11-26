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

/** 受控模式版式白名单（布局 / 展示 / 动作） */
const LAYOUT_TYPES = ['card', 'row', 'tabs', 'form', 'button', 'divider', 'text-block'];

/** 白名单外的输入类组件（不允许从面板直接放置） */
const INPUT_TYPES = ['input', 'number', 'switch', 'select', 'slider'];

describe('组件面板（受控单轨）', () => {
  it('展示业务字段与版式白名单', () => {
    const { wrapper } = mountPanel();
    const text = wrapper.text();

    expect(text).toContain('业务字段');
    expect(text).toContain('销售单号');
    expect(text).toContain('销售金额');
    // active:false 的字段不出现
    expect(text).not.toContain('已废弃');

    LAYOUT_TYPES.forEach((type) => {
      expect(text).toContain(`组件-${type}`);
    });
  });

  it('不展示白名单外的输入组件', () => {
    const { wrapper } = mountPanel();
    const text = wrapper.text();

    INPUT_TYPES.forEach((type) => {
      expect(text).not.toContain(`组件-${type}`);
    });
  });

  it('已放置字段置灰且点击给出提示', async () => {
    const { message, wrapper } = mountPanel({
      placedFields: ['u_销售单号'],
    });

    const placed = wrapper.findAll('.ep-component-item.is-placed');
    expect(placed.length).toBe(1);
    expect(placed[0].text()).toContain('销售单号');

    await placed[0].trigger('click');
    expect(message.info).toHaveBeenCalled();
  });
});

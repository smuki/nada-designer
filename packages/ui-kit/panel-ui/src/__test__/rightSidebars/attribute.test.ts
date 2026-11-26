// 先加载 manager，建立正确的模块加载顺序（否则 utils ↔ manager ↔ hooks 循环依赖会初始化不完整）
import '@nada-designer/manager';

import { DESIGNER_CONTEXT_KEY } from '@nada-designer/hooks';
import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';

import type { MockDesignerContextOptions } from '../helpers/mockDesigner';

import {
  makeDesignerContext,
  makePageSchema,
  registerMockComponents,
} from '../helpers/mockDesigner';

let AttributeView: any;

const AttrItemStub = {
  name: 'EAttributeItem',
  props: ['schema'],
  template: '<div class="attr-item-stub">{{ schema.label }}</div>',
};

beforeAll(async () => {
  registerMockComponents();
  ({ default: AttributeView } = await import(
    '../../rightSidebars/attribute/attribute.vue'
  ));
});

function mountAttribute(options: MockDesignerContextOptions = {}) {
  const context = makeDesignerContext(options);
  const wrapper = mount(AttributeView, {
    global: {
      provide: { [DESIGNER_CONTEXT_KEY as any]: context },
      stubs: { EAttributeItem: AttrItemStub },
    },
  });
  return { context, wrapper };
}

/** 构造一个已放置的输入节点 */
function makeInputNode() {
  return {
    field: 'u_销售单号',
    id: 'root_u_销售单号',
    input: true,
    label: '销售单号',
    props: {},
    type: 'input',
  };
}

describe('属性面板 · 受控模式', () => {
  it('隐藏「数据字段」编辑项并展示业务字段只读信息', () => {
    const { wrapper } = mountAttribute({
      designMode: 'controlled',
      selectedNode: makeInputNode(),
    });
    const text = wrapper.text();

    expect(text).not.toContain('数据字段');
    expect(text).toContain('标题');
    expect(text).toContain('业务字段');
    expect(text).toContain('（text）');
  });

  it('元数据中不存在该字段时给出提示', () => {
    const { wrapper } = mountAttribute({
      designMode: 'controlled',
      selectedNode: { ...makeInputNode(), field: 'u_未知字段' },
    });

    expect(wrapper.text()).toContain('元数据中不存在');
  });

  it('根表单名称不可修改（隐藏 Name 项）', () => {
    const pageSchema = makePageSchema();
    const { wrapper } = mountAttribute({
      designMode: 'controlled',
      pageSchema,
      selectedNode: pageSchema.schemas[0],
    });
    const text = wrapper.text();

    expect(text).not.toContain('Name');
    // 根节点仍可配置画布宽高
    expect(text).toContain('画布宽度');
  });
});

describe('属性面板 · 自由模式', () => {
  it('保留「数据字段」编辑项，无业务字段只读行', () => {
    const { wrapper } = mountAttribute({
      designMode: 'free',
      selectedNode: makeInputNode(),
    });
    const text = wrapper.text();

    expect(text).toContain('数据字段');
    expect(text).not.toContain('业务字段');
  });
});

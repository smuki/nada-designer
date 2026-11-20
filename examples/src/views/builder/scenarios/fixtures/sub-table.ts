import type { ScenarioFixture } from '../types';

import { registerScenarioDemoComponents, SCENARIO_SUBTABLE_TYPE } from '../demoComponents';
import { createForm, input } from '../shared';

/**
 * 场景：子表组件
 * 使用 isSubTable 的演示组件（播放器里临时注册），验证子表与普通字段混排。
 */
const fixture: ScenarioFixture = {
  description:
    '验证子表组件的渲染：演示组件注册时标记了 isSubTable，可与普通输入框混排。开启「表格视图」场景可看到它被重排到末尾。',
  formData: {
    orderNo: 'SO-2026-0001',
  },
  name: '子表组件',
  pageSchema: createForm([
    input('orderNo', '订单号'),
    {
      children: [],
      id: 'subtable-1',
      label: '订单明细（子表）',
      props: { rowCount: 5 },
      type: SCENARIO_SUBTABLE_TYPE,
    },
    input('buyer', '采购人'),
  ]),
  setup: registerScenarioDemoComponents,
};

export default fixture;

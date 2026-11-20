import type { ScenarioFixture } from '../types';

import { registerScenarioDemoComponents, SCENARIO_SUBTABLE_TYPE } from '../demoComponents';
import { createForm, input, number } from '../shared';

/**
 * 场景：表格视图（tableView）
 *
 * EBuilder 的 tableView 会把表单重排：输入组件全宽、子表被移动到末尾。
 * 对比「子表组件」场景（未开 tableView）可以看到布局差异。
 */
const fixture: ScenarioFixture = {
  description:
    '验证 EBuilder 的 tableView 模式：输入组件会被加上 ep-full-width 全宽样式，isSubTable 的子表组件被重排到表单末尾。',
  formData: {
    orderNo: 'SO-2026-0002',
    qty: 10,
  },
  name: '表格视图',
  pageSchema: createForm([
    input('orderNo', '订单号'),
    {
      children: [],
      id: 'subtable-1',
      label: '订单明细（子表）',
      props: { rowCount: 8 },
      type: SCENARIO_SUBTABLE_TYPE,
    },
    number('qty', '数量'),
  ]),
  setup: registerScenarioDemoComponents,
  tableView: true,
};

export default fixture;

import type { ScenarioFixture } from '../types';

import { createForm, input } from '../shared';

/**
 * 场景：未知组件类型
 * schema 里出现注册表没有的 type，验证降级行为（不应让整页崩掉）。
 */
const fixture: ScenarioFixture = {
  description:
    'schema 里包含一个未注册的组件类型 unknown-widget-xyz：期望其它字段仍能正常渲染和取值，控制台给出提示而不是整页崩溃。',
  formData: {
    after: '未知组件之后的字段',
    before: '未知组件之前的字段',
  },
  name: '未知组件类型',
  pageSchema: createForm([
    input('before', '正常字段（前）'),
    {
      children: [],
      id: 'unknown-1',
      label: '未知组件',
      props: {},
      type: 'unknown-widget-xyz',
    },
    input('after', '正常字段（后）'),
  ]),
};

export default fixture;

import type { ScenarioFixture } from '../types';

import { createForm, input } from '../shared';

/**
 * 场景：标签页 + 折叠面板
 * 验证 tabs / tab-pane / collapse / collapse-item 组合下的字段渲染与取值。
 */
const fixture: ScenarioFixture = {
  description:
    '验证标签页与折叠面板内的表单：切换标签、展开折叠面板后，字段数据应仍能通过 getData 取到。',
  formData: {
    collapseA: '折叠面板内容 A',
    collapseB: '折叠面板内容 B',
    tabA: '标签1内容',
    tabB: '标签2内容',
  },
  name: '标签页与折叠',
  pageSchema: createForm([
    {
      children: [
        {
          children: [input('tabA', '标签1字段')],
          id: 'tab-pane-1',
          label: '标签1',
          type: 'tab-pane',
        },
        {
          children: [input('tabB', '标签2字段')],
          id: 'tab-pane-2',
          label: '标签2',
          type: 'tab-pane',
        },
      ],
      id: 'tabs-1',
      label: '标签页',
      props: { defaultValue: '标签1', type: '' },
      type: 'tabs',
    },
    {
      children: [
        {
          children: [input('collapseA', '折叠A字段')],
          id: 'collapse-item-1',
          label: '折叠项1',
          props: {},
          type: 'collapse-item',
        },
        {
          children: [input('collapseB', '折叠B字段')],
          id: 'collapse-item-2',
          label: '折叠项2',
          props: {},
          type: 'collapse-item',
        },
      ],
      id: 'collapse-1',
      label: '折叠面板',
      props: {},
      type: 'collapse',
    },
  ]),
};

export default fixture;

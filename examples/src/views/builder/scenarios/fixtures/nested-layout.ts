import type { ScenarioFixture } from '../types';

import { createForm, input, number } from '../shared';

/**
 * 场景：嵌套布局
 * card > row > col 多层容器递归渲染，验证容器内表单组件的数据绑定。
 */
const fixture: ScenarioFixture = {
  description:
    '验证容器组件的递归渲染：卡片 > 栅格行 > 栅格列 > 表单组件。修改任意字段，右侧 getData 应能取到。',
  formData: {
    amount: 100,
    contact: '张三',
    remark: '嵌套布局里的文本',
  },
  name: '嵌套布局',
  pageSchema: createForm([
    {
      children: [
        {
          children: [
            {
              children: [input('contact', '联系人')],
              id: 'col-1',
              label: '栅格列1',
              props: { span: 12 },
              type: 'col',
            },
            {
              children: [number('amount', '金额')],
              id: 'col-2',
              label: '栅格列2',
              props: { span: 12 },
              type: 'col',
            },
          ],
          id: 'row-1',
          label: '栅格行',
          props: { gutter: 12 },
          type: 'row',
        },
        input('remark', '备注'),
      ],
      id: 'card-1',
      label: '卡片',
      props: { title: '基础信息（卡片容器）' },
      type: 'card',
    },
  ]),
};

export default fixture;

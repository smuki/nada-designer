import type { ScenarioFixture } from '../types';

import { createForm } from '../shared';

/**
 * 场景：数组字段
 * 多选组件绑定数组，验证回显与 getData 结构。
 */
const fixture: ScenarioFixture = {
  description:
    '多选下拉绑定数组字段 tags：初始回显 ["a","c"]，增删选项后 getData 应返回数组。',
  formData: {
    tags: ['a', 'c'],
  },
  name: '数组字段',
  pageSchema: createForm([
    {
      field: 'tags',
      id: 'tags',
      input: true,
      label: '标签（多选）',
      props: {
        mode: 'multiple',
        multiple: true,
        options: [
          { label: '标签A', value: 'a' },
          { label: '标签B', value: 'b' },
          { label: '标签C', value: 'c' },
        ],
        placeholder: '请选择标签',
      },
      type: 'select',
    },
  ]),
};

export default fixture;

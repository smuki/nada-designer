import type { ScenarioFixture } from '../types';

import { createForm, input, number } from '../shared';

/**
 * 场景：嵌套对象写入
 * 字段使用带点号的路径（user.name / user.address.city），
 * formData 用真实嵌套对象，验证双向绑定与 getData 结构。
 */
const fixture: ScenarioFixture = {
  description:
    '字段路径为 user.name / user.age / user.address.city，formData 为嵌套对象：修改后 getData 应保持嵌套结构。',
  formData: {
    user: {
      address: { city: '南宁' },
      age: 30,
      name: '赵六',
    },
  },
  name: '嵌套对象写入',
  pageSchema: createForm([
    input('user.name', '用户名'),
    number('user.age', '年龄'),
    input('user.address.city', '城市'),
  ]),
};

export default fixture;

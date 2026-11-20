import type { ScenarioFixture } from '../types';

import { createForm, input } from '../shared';

/**
 * 场景：局部 setData 与 resetData
 * 验证：
 * 1) formData 只给部分字段时，其它字段为空；
 * 2) formData 里带 schema 未声明的多余字段，getData 是否保留；
 * 3) resetData 后各字段是否回到默认值。
 */
const fixture: ScenarioFixture = {
  description:
    'formData 只提供 name，并额外带一个 schema 未声明的 extraField：观察 getData 是否保留多余字段；点「重置表单」验证 resetData 行为。',
  formData: {
    extraField: 'schema 里没有这个字段',
    name: '只回显这一个字段',
  },
  name: '局部数据与重置',
  pageSchema: createForm([
    input('name', '姓名'),
    input('phone', '手机号（无回显）'),
  ]),
};

export default fixture;

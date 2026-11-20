import type { ScenarioFixture } from '../types';

import { input } from '../shared';

/**
 * 场景：多表单
 * 一个页面里两个 form，验证 getForms / setForms / validateAll。
 * （播放器的「刷新数据」用 getForms()，「校验」用 validateAll()）
 */
const fixture: ScenarioFixture = {
  description:
    '同一页面有两个表单（formA / formB）：刷新数据走 getForms()，校验走 validateAll()，验证多表单场景的数据与校验聚合。',
  formData: {},
  name: '多表单',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [input('a1', 'A表单字段1'), input('a2', 'A表单字段2')],
        id: 'form-a',
        label: '表单A',
        props: { labelLayout: 'fixed', labelWidth: 120, name: 'formA' },
        type: 'form',
      },
      {
        children: [input('b1', 'B表单字段')],
        id: 'form-b',
        label: '表单B',
        props: { labelLayout: 'fixed', labelWidth: 120, name: 'formB' },
        type: 'form',
      },
    ],
    script: '',
  },
  readData: (builder: any) => builder?.getForms?.(),
  runValidate: (builder: any) => builder?.validateAll?.(),
};

export default fixture;

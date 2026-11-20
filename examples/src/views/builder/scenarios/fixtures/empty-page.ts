import type { ScenarioFixture } from '../types';

/**
 * 场景：空页面
 * 只有一个没有子节点的 page 根节点，验证不白屏、不报错、ready 能正常触发。
 */
const fixture: ScenarioFixture = {
  description:
    '页面根节点下没有任何子节点：应正常渲染空页面并触发 ready，getData 返回空对象，且控制台不应出现异常。',
  formData: {},
  name: '空页面',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [],
        id: 'root',
        label: '空页面',
        props: {},
        type: 'page',
      },
    ],
    script: '',
  },
};

export default fixture;

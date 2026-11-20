import type { ScenarioFixture } from '../types';

import { createForm, input } from '../shared';

/**
 * 场景：弹窗表单
 * 弹窗组件的显隐由 v-model（formData.modalVisible）驱动，
 * 验证渲染在 dialog 里的字段能否正常读写。
 */
const fixture: ScenarioFixture = {
  description:
    '验证弹窗（modal）内表单：弹窗显隐通过 formData.modalVisible 控制。关闭后重新打开，检查字段值是否保留。',
  formData: {
    modalVisible: true,
    modalRemark: '弹窗里的内容',
  },
  name: '弹窗表单',
  pageSchema: createForm([
    input('outside', '弹窗外字段'),
    {
      children: [input('modalRemark', '弹窗内字段')],
      field: 'modalVisible',
      id: 'modal-1',
      label: '弹窗',
      props: {},
      type: 'modal',
    },
  ]),
};

export default fixture;

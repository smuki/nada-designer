import type { ScenarioFixture } from '../types';

import { createForm, input } from '../shared';

/**
 * 场景：上传组件
 * 使用 httpbin 作为模拟上传地址（可正常 POST），验证图片/文件上传组件的渲染与表单值结构。
 */
const fixture: ScenarioFixture = {
  description:
    '图片上传 + 文件上传组件，上传地址指向 https://httpbin.org/post（可用于验证请求是否发出）。上传后的值会写入 getData，注意查看数据结构。',
  formData: {
    attachment: '',
    avatar: '',
    remark: '上传场景',
  },
  name: '上传组件',
  pageSchema: createForm([
    input('remark', '备注'),
    {
      field: 'avatar',
      id: 'avatar',
      input: true,
      label: '头像（图片）',
      props: {
        action: 'https://httpbin.org/post',
        maxCount: 1,
      },
      type: 'upload-image',
    },
    {
      field: 'attachment',
      id: 'attachment',
      input: true,
      label: '附件（文件）',
      props: {
        action: 'https://httpbin.org/post',
        maxCount: 2,
      },
      type: 'upload-file',
    },
  ]),
};

export default fixture;

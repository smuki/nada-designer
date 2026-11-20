import type { ScenarioFixture } from '../types';

/**
 * 场景 2：数据回显
 * 覆盖：嵌套字段路径（user.name）、null / undefined、数字与字符串混合、空表单。
 */
const fixture: ScenarioFixture = {
  description:
    '验证数据回显：嵌套路径字段（user.name / user.age）、null 值、未赋值字段，以及 setData/resetData 的行为。',
  formData: {
    'user.age': 28,
    'user.name': '李四',
    city: null,
    email: 'lisi@example.com',
    score: 0,
  },
  name: '数据回显',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [
          {
            field: 'user.name',
            id: 'user-name',
            input: true,
            label: '用户名',
            props: { placeholder: '请输入用户名' },
            type: 'input',
          },
          {
            field: 'user.age',
            id: 'user-age',
            input: true,
            label: '年龄',
            props: {},
            type: 'number',
          },
          {
            field: 'email',
            id: 'email',
            input: true,
            label: '邮箱',
            props: { placeholder: '请输入邮箱' },
            type: 'input',
          },
          {
            field: 'city',
            id: 'city',
            input: true,
            label: '城市（回显为 null）',
            props: { placeholder: '请输入城市' },
            type: 'input',
          },
          {
            field: 'score',
            id: 'score',
            input: true,
            label: '分数（回显为 0）',
            props: {},
            type: 'number',
          },
        ],
        id: 'root',
        label: '表单',
        props: { labelLayout: 'fixed', labelWidth: 140, name: 'default' },
        type: 'form',
      },
    ],
    script: '',
  },
};

export default fixture;

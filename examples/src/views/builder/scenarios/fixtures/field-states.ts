import type { ScenarioFixture } from '../types';

/**
 * 场景 5：字段状态（权限）
 * 覆盖 FieldStates 的四种状态：WRITE / READ / DISABLED / HIDE，以及条件生效。
 */
const fixture: ScenarioFixture = {
  description:
    '验证字段状态：name 为 READ（只读）、age 大于等于 18 时 interests 为 DISABLED、gender 为「女」时 secret 为 HIDE。修改上方字段观察状态变化。',
  fieldStates: [
    { field: 'name', state: 'READ' },
    {
      condition: (formData) => Number(formData.age) >= 18,
      field: 'interests',
      state: 'DISABLED',
    },
    {
      condition: (formData) => formData.gender === '女',
      field: 'secret',
      state: 'HIDE',
    },
  ],
  formData: {
    age: 20,
    gender: '女',
    interests: '阅读',
    name: '王五（只读）',
    secret: '隐藏字段的值',
  },
  name: '字段状态',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [
          {
            field: 'name',
            id: 'name',
            input: true,
            label: '姓名（READ）',
            props: { placeholder: '只读' },
            type: 'input',
          },
          {
            field: 'age',
            id: 'age',
            input: true,
            label: '年龄',
            props: {},
            type: 'number',
          },
          {
            field: 'gender',
            id: 'gender',
            input: true,
            label: '性别',
            props: {
              options: [
                { label: '男', value: '男' },
                { label: '女', value: '女' },
              ],
            },
            type: 'select',
          },
          {
            field: 'interests',
            id: 'interests',
            input: true,
            label: '爱好（≥18 禁选）',
            props: { placeholder: '请输入爱好' },
            type: 'input',
          },
          {
            field: 'secret',
            id: 'secret',
            input: true,
            label: '机密（女时隐藏）',
            props: { placeholder: '选「女」时隐藏' },
            type: 'input',
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

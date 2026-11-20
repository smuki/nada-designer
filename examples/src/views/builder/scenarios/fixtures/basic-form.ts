import type { ScenarioFixture } from '../types';

/**
 * 场景 1：基础表单
 * 覆盖最常见的输入类组件，验证 EBuilder 默认渲染 + getData 取值。
 */
const fixture: ScenarioFixture = {
  description:
    '最基础的表单渲染，覆盖 input / number / select / textarea / switch，验证默认值与 getData 取值。',
  formData: {
    age: 18,
    name: '张三',
    remark: '默认备注',
    role: 'admin',
    enabled: true,
  },
  name: '基础表单',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [
          {
            field: 'name',
            id: 'name',
            input: true,
            label: '姓名',
            props: { placeholder: '请输入姓名' },
            rules: [{ message: '请输入姓名', required: true }],
            type: 'input',
          },
          {
            field: 'age',
            id: 'age',
            input: true,
            label: '年龄',
            props: { placeholder: '请输入年龄' },
            type: 'number',
          },
          {
            field: 'role',
            id: 'role',
            input: true,
            label: '角色',
            props: {
              options: [
                { label: '管理员', value: 'admin' },
                { label: '普通用户', value: 'user' },
              ],
              placeholder: '请选择角色',
            },
            type: 'select',
          },
          {
            field: 'remark',
            id: 'remark',
            input: true,
            label: '备注',
            props: { placeholder: '请输入备注', rows: 3 },
            type: 'textarea',
          },
          {
            field: 'enabled',
            id: 'enabled',
            input: true,
            label: '启用',
            props: {},
            type: 'switch',
          },
        ],
        id: 'root',
        label: '表单',
        props: { labelLayout: 'fixed', labelWidth: 100, name: 'default' },
        type: 'form',
      },
    ],
    script: '',
  },
};

export default fixture;

import type { ScenarioFixture } from '../types';

/**
 * 场景 3：表单校验
 * 覆盖：必填、长度区间、正则、数字范围，以及 validate 失败时的表现。
 */
const fixture: ScenarioFixture = {
  description:
    '验证校验规则：必填、长度区间、正则、数字范围。点「校验」按钮查看 validate() 结果，非法时右侧面板会显示错误。',
  formData: {
    phone: '123',
    username: 'ab',
  },
  name: '表单校验',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [
          {
            field: 'username',
            id: 'username',
            input: true,
            label: '用户名',
            props: { placeholder: '3~10 个字符' },
            rules: [
              { message: '请输入用户名', required: true },
              { message: '长度需在 3~10 之间', max: 10, min: 3 },
            ],
            type: 'input',
          },
          {
            field: 'phone',
            id: 'phone',
            input: true,
            label: '手机号',
            props: { placeholder: '请输入 11 位手机号' },
            rules: [
              { message: '请输入手机号', required: true },
              {
                message: '手机号格式不正确',
                pattern: '^1[3-9]\\d{9}$',
              },
            ],
            type: 'input',
          },
          {
            field: 'amount',
            id: 'amount',
            input: true,
            label: '金额',
            props: { placeholder: '1~1000' },
            rules: [{ message: '金额需在 1~1000 之间', max: 1000, min: 1, type: 'number' }],
            type: 'number',
          },
          {
            field: 'agree',
            id: 'agree',
            input: true,
            label: '同意协议',
            props: {},
            rules: [{ message: '必须同意协议', required: true }],
            type: 'switch',
          },
        ],
        id: 'root',
        label: '表单',
        props: { labelLayout: 'fixed', labelWidth: 110, name: 'default' },
        type: 'form',
      },
    ],
    script: '',
  },
};

export default fixture;

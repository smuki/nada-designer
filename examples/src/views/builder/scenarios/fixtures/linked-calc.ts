import type { ScenarioFixture } from '../types';

/**
 * 场景 4：联动计算
 * 使用页面脚本 + change 动作：数值1 + 数值2 自动写入「合计」，并演示条件文本。
 */
const fixture: ScenarioFixture = {
  description:
    '验证事件动作 + 页面脚本的联动：修改「数值1 / 数值2」时通过 custom 动作重新计算「合计」与「说明」。',
  formData: {
    a: 10,
    b: 20,
    total: 30,
  },
  name: '联动计算',
  pageSchema: {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children: [
          {
            field: 'a',
            id: 'a',
            input: true,
            label: '数值1',
            on: { change: [{ methodName: 'calc', type: 'custom' }] },
            props: { placeholder: '请输入数值' },
            type: 'number',
          },
          {
            field: 'b',
            id: 'b',
            input: true,
            label: '数值2',
            on: { change: [{ methodName: 'calc', type: 'custom' }] },
            props: { placeholder: '请输入数值' },
            type: 'number',
          },
          {
            field: 'total',
            id: 'total',
            input: true,
            label: '合计（自动）',
            props: { placeholder: '自动计算' },
            type: 'number',
          },
          {
            field: 'note',
            id: 'note',
            input: true,
            label: '说明（自动）',
            props: { placeholder: '自动填充' },
            type: 'input',
          },
        ],
        id: 'root',
        label: '表单',
        props: { labelLayout: 'fixed', labelWidth: 110, name: 'default' },
        type: 'form',
      },
    ],
    script: [
      'const { defineExpose, find } = nada;',
      '',
      'function calc() {',
      '  const a = Number(find("a")?.getValue()) || 0;',
      '  const b = Number(find("b")?.getValue()) || 0;',
      '  const total = a + b;',
      '  find("total")?.setValue(total);',
      '  find("note")?.setValue(total > 100 ? "超过 100" : "未超过 100");',
      '}',
      '',
      'defineExpose({ calc });',
    ].join('\n'),
  },
};

export default fixture;

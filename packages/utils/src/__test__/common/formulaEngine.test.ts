import { describe, expect, it, vi } from 'vitest';

import { FormulaEngine } from '../../formula/formulaEngine';

/**
 * 公式引擎契约测试（联动计算核心）
 *
 * 覆盖：四则/比较/逻辑/一元运算、内置函数、$formData/$event/$vars 取值、
 * 上下文合并、异常与不支持节点的降级行为。
 */

const ctx = {
  event: { value: 7 },
  formData: {
    a: 41,
    b: 1,
    price: 10,
    qty: 3,
    user: { address: { city: '南宁' } },
  },
  vars: { rate: 2 },
};

describe('FormulaEngine 基础运算', () => {
  const engine = new FormulaEngine();

  it('空表达式或非字符串返回 null', () => {
    expect(engine.calculate('')).toBeNull();
    expect(engine.calculate(null as any)).toBeNull();
    expect(engine.calculate(undefined as any)).toBeNull();
  });

  it('字面量：数字与字符串', () => {
    expect(engine.calculate('123')).toBe(123);
    expect(engine.calculate('"abc"')).toBe('abc');
  });

  it('四则运算', () => {
    expect(engine.calculate('1 + 2')).toBe(3);
    expect(engine.calculate('5 - 2')).toBe(3);
    expect(engine.calculate('3 * 4')).toBe(12);
    expect(engine.calculate('10 / 2')).toBe(5);
  });

  it('加号对字符串做数字转换（"1" + 1 = 2）', () => {
    expect(engine.calculate('"1" + 1')).toBe(2);
  });

  it('除以 0 返回 0 而不是 Infinity', () => {
    expect(engine.calculate('10 / 0')).toBe(0);
  });

  it('比较运算', () => {
    expect(engine.calculate('1 < 2')).toBe(true);
    expect(engine.calculate('2 >= 2')).toBe(true);
    expect(engine.calculate('1 == 1')).toBe(true);
    expect(engine.calculate('1 === 1')).toBe(true);
    expect(engine.calculate('1 != 2')).toBe(true);
  });

  it('逻辑运算 && / ||（1.1.18 修复：此前恒返回 0）', () => {
    // jsep 把 && / || 解析成 BinaryExpression，历史上 _applyOperator 未实现这两个运算符，
    // 会走 default 分支恒返回 0；现已补上。
    expect(engine.calculate('1 && 0')).toBe(0);
    expect(engine.calculate('1 && 1')).toBe(1);
    expect(engine.calculate('0 || 5')).toBe(5);
  });

  it('一元负号', () => {
    expect(engine.calculate('-5')).toBe(-5);
  });

  it('逻辑非 ! 取反（1.1.18 修复：此前返回原值）', () => {
    expect(engine.calculate('!1')).toBe(false);
    expect(engine.calculate('!0')).toBe(true);
  });
});

describe('FormulaEngine 内置函数', () => {
  const engine = new FormulaEngine();

  it('SUM / AVERAGE / MAX / MIN / ABS', () => {
    expect(engine.calculate('SUM(1, 2, 3)')).toBe(6);
    expect(engine.calculate('AVERAGE(2, 4)')).toBe(3);
    expect(engine.calculate('MAX(1, 5)')).toBe(5);
    expect(engine.calculate('MIN(1, 5)')).toBe(1);
    expect(engine.calculate('ABS(-3)')).toBe(3);
  });

  it('IF 条件函数', () => {
    expect(engine.calculate('IF(1 > 0, "yes", "no")')).toBe('yes');
    expect(engine.calculate('IF(1 < 0, "yes", "no")')).toBe('no');
  });

  it('MU_TO_SQM 换算', () => {
    expect(engine.calculate('MU_TO_SQM(1)')).toBeCloseTo(666.67);
  });

  it('函数名大小写不敏感', () => {
    expect(engine.calculate('sum(1, 2)')).toBe(3);
  });

  it('未知函数返回 0 并告警', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(engine.calculate('NOT_EXIST(1)')).toBe(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('FormulaEngine 上下文取值', () => {
  const engine = new FormulaEngine();

  it('读取 $formData / $event / $vars', () => {
    expect(engine.calculate('$formData.a', ctx)).toBe(41);
    expect(engine.calculate('$event.value', ctx)).toBe(7);
    expect(engine.calculate('$vars.rate', ctx)).toBe(2);
  });

  it('支持深层层级属性', () => {
    expect(engine.calculate('$formData.user.address.city', ctx)).toBe('南宁');
  });

  it('与运算、函数组合使用', () => {
    expect(engine.calculate('$formData.price * $formData.qty', ctx)).toBe(30);
    expect(engine.calculate('SUM($formData.a, $formData.b)', ctx)).toBe(42);
  });

  it('构造函数上下文与运行时上下文合并，运行时优先', () => {
    const withDefault = new FormulaEngine({ formData: { a: 1 } });
    expect(withDefault.calculate('$formData.a', { formData: { b: 2 } })).toBe(1);
    expect(withDefault.calculate('$formData.a', { formData: { a: 9 } })).toBe(9);
  });

  it('属性不存在时返回 undefined', () => {
    expect(engine.calculate('$formData.notExist', ctx)).toBeUndefined();
  });

  it('深层路径遇到 undefined 会抛错并被兜底成 null', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(engine.calculate('$formData.notExist.deep', ctx)).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('FormulaEngine 异常与降级', () => {
  const engine = new FormulaEngine();

  it('语法错误返回 null 并打日志', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(engine.calculate('1 +')).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('不支持的节点类型（三元表达式）返回 0 并告警', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(engine.calculate('true ? 1 : 2')).toBe(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

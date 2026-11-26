import { describe, expect, it } from 'vitest';

import { isValidSchemaName, normalizeType } from '../../';

describe('normalizeType 函数测试', () => {
  it('把中划线替换为下划线', () => {
    expect(normalizeType('color-picker')).toBe('color_picker');
    expect(normalizeType('input')).toBe('input');
  });
});

describe('isValidSchemaName 函数测试', () => {
  it('允许中文、字母、数字、下划线，首字符不能是数字', () => {
    expect(isValidSchemaName('报销金额')).toBe(true);
    expect(isValidSchemaName('u_销售单号')).toBe(true);
    expect(isValidSchemaName('_a1')).toBe(true);
    expect(isValidSchemaName('1a')).toBe(false);
  });

  it('拒绝中划线、空格等特殊字符与空值', () => {
    expect(isValidSchemaName('color-picker')).toBe(false);
    expect(isValidSchemaName('a b')).toBe(false);
    expect(isValidSchemaName('u_借款统计(系统)')).toBe(false);
    expect(isValidSchemaName('')).toBe(false);
    expect(isValidSchemaName(undefined)).toBe(false);
  });
});

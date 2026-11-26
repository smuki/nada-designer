import { describe, expect, it } from 'vitest';

import {
  CONTROLLED_COMPONENT_TYPES,
  isControlledComponentType,
} from '../../common/controlledMode';

describe('controlledMode 白名单', () => {
  it('包含布局 / 展示 / 动作组件', () => {
    ['card', 'form', 'row', 'tabs', 'divider', 'text-block', 'button'].forEach(
      (type) => {
        expect(isControlledComponentType(type)).toBe(true);
      },
    );
  });

  it('不包含输入类组件', () => {
    [
      'input',
      'textarea',
      'number',
      'date',
      'switch',
      'select',
      'radio',
      'checkbox',
      'slider',
      'upload-file',
    ].forEach((type) => {
      expect(isControlledComponentType(type)).toBe(false);
    });
  });

  it('空值与未知组件返回 false', () => {
    expect(isControlledComponentType()).toBe(false);
    expect(isControlledComponentType('unknown')).toBe(false);
  });

  it('白名单无重复项', () => {
    expect(new Set(CONTROLLED_COMPONENT_TYPES).size).toBe(
      CONTROLLED_COMPONENT_TYPES.length,
    );
  });
});

import type { ComponentSchema } from '@nada-designer/types';

import { mount } from '@vue/test-utils';
import { Button as TButton, Input as TInput } from 'tdesign-vue-next';
import { describe, expect, it, vi } from 'vitest';

import Button from '../button/button.vue';
import Input from '../input/input.vue';
import Select from '../select/select.vue';

/**
 * 跨 UI 库 schema 兼容测试
 *
 * 设计器保存的 schema 可能来自 antd / element-plus / naive-ui：旧枚举值（如
 * type="primary"、size="middle"）会触发 TDesign 的 prop validator 告警。
 * 这里把「旧值映射 / 非法值过滤」的行为钉住。
 */

const schema = (type: string): ComponentSchema => ({
  children: [],
  label: '测试',
  props: {},
  type,
});

describe('属性兼容：旧库枚举值归一化', () => {
  it('button：type=primary 映射为 theme，且不再透传非法的 type', () => {
    const wrapper = mount(Button as any, {
      attrs: { type: 'primary' },
      props: { componentSchema: schema('button') },
    });

    const button = wrapper.findComponent(TButton);
    expect(button.props('theme')).toBe('primary');
    // TDesign 的 type 只接受 submit/reset/button
    expect(button.props('type')).toBe('button');
  });

  it('button：type=text / dashed 映射为 variant', () => {
    const text = mount(Button as any, {
      attrs: { type: 'text' },
      props: { componentSchema: schema('button') },
    });
    expect(text.findComponent(TButton).props('variant')).toBe('text');

    const dashed = mount(Button as any, {
      attrs: { type: 'dashed' },
      props: { componentSchema: schema('button') },
    });
    expect(dashed.findComponent(TButton).props('variant')).toBe('dashed');
  });

  it('button：原生 type=submit 保留', () => {
    const wrapper = mount(Button as any, {
      attrs: { type: 'submit' },
      props: { componentSchema: schema('button') },
    });
    expect(wrapper.findComponent(TButton).props('type')).toBe('submit');
  });

  it('size：middle / default → medium，tiny / mini → small', () => {
    const middle = mount(Input as any, {
      attrs: { size: 'middle' },
      props: { componentSchema: schema('input') },
    });
    expect(middle.findComponent(TInput).props('size')).toBe('medium');

    const tiny = mount(Input as any, {
      attrs: { size: 'tiny' },
      props: { componentSchema: schema('input') },
    });
    expect(tiny.findComponent(TInput).props('size')).toBe('small');
  });

  it('非法枚举值被丢弃，不触发 validator 告警', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(Input as any, {
      attrs: { status: 'not-a-status' },
      props: { componentSchema: schema('input') },
    });

    // 非法值被丢弃后回到 TDesign 默认值 default
    expect(wrapper.findComponent(TInput).props('status')).toBe('default');
    const invalidPropWarnings = warnSpy.mock.calls.filter((args) =>
      String(args[0] ?? '').includes('custom validator check failed'),
    );
    expect(invalidPropWarnings).toEqual([]);

    warnSpy.mockRestore();
  });

  it('合法属性照常透传', () => {
    const wrapper = mount(Select as any, {
      attrs: {
        clearable: true,
        options: [{ label: 'A', value: 'a' }],
        size: 'large',
      },
      props: { componentSchema: schema('select') },
    });

    const select = wrapper.findComponent({ name: 'TSelect' });
    expect(select.props('clearable')).toBe(true);
    expect(select.props('size')).toBe('large');
  });
});

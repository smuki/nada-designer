import type { ComponentSchema } from '@nada-designer/types';

import { mount } from '@vue/test-utils';
import {
  Button as TButton,
  Input as TInput,
  RadioGroup as TRadioGroup,
} from 'tdesign-vue-next';
import { describe, expect, it, vi } from 'vitest';

import Button from '../button/button.vue';
import Input from '../input/input.vue';
import Select from '../select/select.vue';
import Radio from '../radio/radio.vue';
import Switch from '../switch/switch.vue';
import { sanitizeAttrs } from '../utils/attrs';

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

  it('button：未指定 theme 时回落到 default（避免默认渲染成 primary 蓝色）', () => {
    const wrapper = mount(Button as any, {
      attrs: {},
      props: { componentSchema: schema('button') },
    });

    expect(wrapper.findComponent(TButton).props('theme')).toBe('default');
    expect(wrapper.findComponent(TButton).props('variant')).toBe('outline');
  });

  it('button：显式 theme 不被覆盖（画布按钮默认 primary）', () => {
    const wrapper = mount(Button as any, {
      attrs: { theme: 'primary' },
      props: { componentSchema: schema('button') },
    });

    expect(wrapper.findComponent(TButton).props('theme')).toBe('primary');
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

describe('属性面板控件：旧 schema 的异常值归一化', () => {
  it('switch：对象值（如 element 的 autosize）视为开启，不触发类型告警', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(Switch as any, {
      // 属性面板会把 schema 原值透传给控件
      attrs: { modelValue: { maxRows: 5, minRows: 2 } },
      props: { componentSchema: schema('switch') },
    });

    expect(wrapper.findComponent({ name: 'TSwitch' }).props('modelValue')).toBe(
      true,
    );
    const typeWarnings = warnSpy.mock.calls.filter((args) =>
      String(args[0] ?? '').includes('type check failed'),
    );
    expect(typeWarnings).toEqual([]);

    warnSpy.mockRestore();
  });

  it('textarea 默认 schema 不再用对象作为 autosize（避免属性面板开关收到对象）', async () => {
    const textareaConfig = (await import('../textarea/index')).default as any;

    expect(typeof textareaConfig.defaultSchema.props.autosize).not.toBe(
      'object',
    );
    // 可选：确认属性面板里不再出现依赖对象路径的编辑器
    const fields = (textareaConfig.config.attribute ?? []).map(
      (item: any) => item.field,
    );
    expect(fields).not.toContain('props.autosize.minRows');
  });
});

describe('sanitizeAttrs 只过滤、不注入默认值（回归）', () => {
  it('空 attrs 不产生任何属性（此前误把按钮的 theme 回落写进了通用清洗器）', () => {
    expect(sanitizeAttrs(TRadioGroup, {})).toEqual({});
  });

  it('属性面板风格的 radio 不会收到 theme=default', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(Radio as any, {
      attrs: {
        clearable: true,
        modelValue: 'left',
        options: [
          { label: '左边', value: 'left' },
          { label: '右边', value: 'right' },
          { label: '顶部', value: 'top' },
        ],
        radioButton: true,
      },
      props: { componentSchema: schema('radio') },
    });

    // TDesign RadioGroup 的 theme 只接受 radio / button，缺省应为 radio
    expect(wrapper.findComponent({ name: 'TRadioGroup' }).props('theme')).toBe(
      'radio',
    );
    const warnings = warnSpy.mock.calls.filter((args) =>
      String(args[0] ?? '').includes('validator check failed'),
    );
    expect(warnings).toEqual([]);

    warnSpy.mockRestore();
  });
});

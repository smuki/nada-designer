import type { ComponentSchema } from '@nada-designer/types';

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Button from '../button/button.vue';
import Cascader from '../cascader/cascader.vue';
import Checkbox from '../checkbox/checkbox.vue';
import ColorPicker from '../color-picker/color-picker.vue';
import DatePicker from '../date-picker/date-picker';
import InputNumber from '../input-number/input-number.vue';
import Input from '../input/input.vue';
import Radio from '../radio/radio.vue';
import Select from '../select/select.vue';
import Slider from '../slider/slider.vue';
import Switch from '../switch/switch.vue';
import Textarea from '../textarea/textarea.vue';
import TimePicker from '../time-picker/time-picker.vue';
import UploadFile from '../upload-file/uploadFile';
import UploadImage from '../upload-image/uploadImage';

/**
 * 表单控件运行时测试
 *
 * 覆盖：渲染（组件库根节点）、v-model 回流、属性透传、禁用/只读、日期区间组件切换、
 * 上传值序列化与响应适配、按钮文本与点击事件。
 */

interface Case {
  Comp: any;
  cls: string;
  type: string;
  props?: Record<string, unknown>;
  value?: unknown;
}

const CASES: Case[] = [
  { Comp: Input, cls: 't-input', props: {}, type: 'input', value: 'abc' },
  {
    Comp: Textarea,
    cls: 't-textarea',
    props: {},
    type: 'textarea',
    value: 'abc',
  },
  {
    Comp: InputNumber,
    cls: 't-input-number',
    props: {},
    type: 'number',
    value: 1,
  },
  {
    Comp: Select,
    cls: 't-select',
    props: { options: [{ label: 'A', value: 'a' }] },
    type: 'select',
    value: 'a',
  },
  {
    Comp: Radio,
    cls: 't-radio-group',
    props: { options: [{ label: 'A', value: 'a' }] },
    type: 'radio',
    value: 'a',
  },
  {
    Comp: Checkbox,
    cls: 't-checkbox-group',
    props: { options: [{ label: 'A', value: 'a' }] },
    type: 'checkbox',
    value: ['a'],
  },
  { Comp: Switch, cls: 't-switch', props: {}, type: 'switch', value: true },
  { Comp: Slider, cls: 't-slider', props: {}, type: 'slider', value: 30 },
  {
    Comp: DatePicker,
    cls: 't-date-picker',
    props: { valueFormat: 'YYYY-MM-DD' },
    type: 'date',
    value: '2026-01-01',
  },
  {
    Comp: TimePicker,
    cls: 't-time-picker',
    props: { format: 'HH:mm:ss' },
    type: 'time',
    value: '12:00:00',
  },
  {
    Comp: Cascader,
    cls: 't-cascader',
    props: { options: [{ children: [], label: 'A', value: 'a' }] },
    type: 'cascader',
    value: 'a',
  },
  {
    Comp: ColorPicker,
    cls: 't-color-picker',
    props: {},
    type: 'color-picker',
    value: '#fff',
  },
  {
    Comp: UploadFile,
    cls: 't-upload',
    props: {},
    type: 'upload-file',
    value: '',
  },
  {
    Comp: UploadImage,
    cls: 't-upload',
    props: {},
    type: 'upload-image',
    value: '',
  },
];

function mountControl(item: Case, extraAttrs: Record<string, unknown> = {}) {
  const componentSchema: ComponentSchema = {
    label: '测试',
    props: item.props ?? {},
    type: item.type,
  };

  return mount(item.Comp, {
    // 与 node.vue 的 getProps 一致：schema.props 会被摊平后作为 attrs 传入
    attrs: { ...(item.props ?? {}), modelValue: item.value, ...extraAttrs },
    props: { componentSchema },
  });
}

describe('控件渲染', () => {
  it.each(CASES)('$type 渲染出 TDesign 根节点 $cls', (item) => {
    const wrapper = mountControl(item);
    expect(wrapper.html()).toContain(item.cls);
  });
});

describe('v-model 双向绑定', () => {
  it('input：初始值回显，输入后向外派发 update:modelValue', async () => {
    const onUpdate = vi.fn();
    const wrapper = mountControl(CASES[0], {
      'onUpdate:modelValue': onUpdate,
    });

    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('abc');

    await input.setValue('xyz');
    expect(onUpdate).toHaveBeenCalled();
    expect(onUpdate.mock.calls.at(-1)?.[0]).toBe('xyz');
  });

  it('switch：选中态由 modelValue 决定，点击后派发布尔值', async () => {
    const onUpdate = vi.fn();
    const wrapper = mountControl(CASES[6], {
      'onUpdate:modelValue': onUpdate,
    });

    expect(wrapper.html()).toContain('t-is-checked');

    await wrapper.find('.t-switch').trigger('click');
    expect(onUpdate).toHaveBeenCalled();
    expect(onUpdate.mock.calls.at(-1)?.[0]).toBe(false);
  });
});

describe('属性透传', () => {
  it('input：disabled / readonly / placeholder 透传到原生输入框', () => {
    const wrapper = mountControl(CASES[0], {
      disabled: true,
      placeholder: '请输入姓名',
      readonly: true,
    });

    const input = wrapper.find('input').element as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.placeholder).toBe('请输入姓名');
  });

  it('select：options 透传到 TSelect', () => {
    const wrapper = mountControl(CASES[3]);
    const select = wrapper.findComponent({ name: 'TSelect' });
    expect(select.props('options')).toEqual([{ label: 'A', value: 'a' }]);
  });
});

describe('date-picker 组件切换', () => {
  it('普通日期使用 TDatePicker，且值以字符串格式存储', () => {
    const wrapper = mount(DatePicker, {
      attrs: { modelValue: '2026-01-01' },
      props: {
        componentSchema: {
          label: '日期',
          props: { type: 'date', valueFormat: 'YYYY-MM-DD' },
          type: 'date',
        },
      },
    });

    const picker = wrapper.findComponent({ name: 'TDatePicker' });
    expect(picker.exists()).toBe(true);
    expect(picker.props('valueType')).toBe('YYYY-MM-DD');
    expect(picker.props('mode')).toBe('date');
  });

  it('区间日期切换到 TDateRangePicker', () => {
    const wrapper = mount(DatePicker, {
      attrs: { modelValue: ['2026-01-01', '2026-01-02'] },
      props: {
        componentSchema: {
          label: '日期区间',
          props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' },
          type: 'date',
        },
      },
    });

    expect(wrapper.findComponent({ name: 'TDateRangePicker' }).exists()).toBe(
      true,
    );
  });
});

describe('上传组件', () => {
  it('上传图片：逗号字符串初始值转换为文件列表', () => {
    const wrapper = mount(UploadImage, {
      attrs: { modelValue: 'https://a.png,https://b.png' },
      props: {
        componentSchema: { label: '图片', props: {}, type: 'upload-image' },
      },
    });

    const upload = wrapper.findComponent({ name: 'TUpload' });
    const files = upload.props('modelValue') as Array<{ url: string }>;
    expect(files.map((file) => file.url)).toEqual([
      'https://a.png',
      'https://b.png',
    ]);
    expect(upload.props('theme')).toBe('image');
  });

  it('上传图片：列表变化后序列化为逗号字符串', () => {
    const wrapper = mount(UploadImage, {
      attrs: { modelValue: '' },
      props: {
        componentSchema: { label: '图片', props: {}, type: 'upload-image' },
      },
    });

    const upload = wrapper.findComponent({ name: 'TUpload' });
    const formatResponse = upload.props('formatResponse') as (
      response: unknown,
    ) => { status: string; url?: string };

    expect(formatResponse({ data: { url: 'https://c.png' } })).toEqual({
      status: 'success',
      url: 'https://c.png',
    });
    expect(formatResponse({ data: 'https://d.png' })).toEqual({
      status: 'success',
      url: 'https://d.png',
    });
    expect(formatResponse({})).toMatchObject({ status: 'fail' });

    upload.vm.$emit('change', [
      { status: 'success', url: 'https://c.png' },
      { status: 'progress', url: 'https://e.png' },
    ]);

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(
      'https://c.png',
    );
  });

  it('上传文件：theme 为 file，全局上传地址优先于 action', async () => {
    const { pluginManager } = await import('@nada-designer/manager');
    pluginManager.global.uploadFile = 'https://global-upload';

    const wrapper = mount(UploadFile, {
      attrs: { action: 'https://schema-upload', modelValue: '' },
      props: {
        componentSchema: { label: '文件', props: {}, type: 'upload-file' },
      },
    });

    const upload = wrapper.findComponent({ name: 'TUpload' });
    expect(upload.props('theme')).toBe('file');
    expect(upload.props('action')).toBe('https://global-upload');

    pluginManager.global.uploadFile = null;
  });
});

describe('button', () => {
  it('渲染标签文本并透传点击事件', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      attrs: { onClick },
      props: {
        componentSchema: { label: '提交', props: {}, type: 'button' },
      },
    });

    expect(wrapper.text()).toContain('提交');
    await wrapper.find('.t-button').trigger('click');
    expect(onClick).toHaveBeenCalled();
  });
});

import type { ComponentSchema } from '@nada-designer/types';

// 注意：必须先加载 manager 再加载 hooks，否则 hooks → manager → hooks 的循环依赖
// 会在 manager 单例初始化时拿到未初始化的 useFormSchema
import { createPageManager } from '@nada-designer/manager';
import { PAGE_MANAGER_KEY } from '@nada-designer/hooks';
import { mount } from '@vue/test-utils';
import { Input as TInput, FormItem as TFormItem } from 'tdesign-vue-next';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

import FormItem from '../form-item/formItem.vue';
import Form from '../form/form.vue';

/**
 * 表单与校验契约测试
 *
 * 覆盖三条与其它适配器对齐的语义：
 * 1. form-item 的 `field` → TDesign `name` 映射（TDesign 用 name 从 form.data 取值）
 * 2. 设计器规则 `type`（数据类型）→ TDesign 规则（type 表示消息级别，数据类型用布尔标记）
 * 3. form.validate 校验失败必须 reject（TDesign 原生是 resolve 结果对象）
 */

describe('form-item 契约', () => {
  function mountItem(attrs: Record<string, unknown>) {
    return mount(FormItem, {
      attrs,
      props: { componentSchema: { label: '字段', type: 'form-item' } },
    });
  }

  it('field 映射为 TDesign 的 name', () => {
    const wrapper = mountItem({ field: 'user.email', label: '邮箱' });
    const child = wrapper.findComponent(TFormItem);
    expect(child.props('name')).toBe('user.email');
    expect(child.props('label')).toBe('邮箱');
  });

  it('设计器规则 type=string 被剥离，数组 trigger 归一为 all', () => {
    const wrapper = mountItem({
      field: 'email',
      rules: [
        {
          message: '必填',
          required: true,
          trigger: ['blur', 'change'],
          type: 'string',
        },
      ],
    });

    const rules = wrapper.findComponent(TFormItem).props('rules') as any[];
    expect(rules).toHaveLength(1);
    expect(rules[0].type).toBeUndefined();
    expect(rules[0].trigger).toBe('all');
    expect(rules[0].required).toBe(true);
  });

  it('数据类型规则转换为 TDesign 布尔标记（number / date / email）', () => {
    const wrapper = mountItem({
      field: 'age',
      rules: [{ message: '必须是数字', type: 'number' }],
    });

    const rules = wrapper.findComponent(TFormItem).props('rules') as any[];
    expect(rules[0].number).toBe(true);
    expect(rules[0].type).toBeUndefined();
  });

  it('消息级别规则（error/warning）原样保留', () => {
    const wrapper = mountItem({
      field: 'name',
      rules: [{ message: '警告', type: 'warning' }],
    });

    const rules = wrapper.findComponent(TFormItem).props('rules') as any[];
    expect(rules[0].type).toBe('warning');
  });

  it('单数 rule 也能被接收', () => {
    const wrapper = mountItem({
      field: 'name',
      rule: { message: '必填', required: true },
    });

    const rules = wrapper.findComponent(TFormItem).props('rules') as any[];
    expect(rules).toHaveLength(1);
  });

  it('checkPayload 结果映射为 status / help', () => {
    const failWrapper = mount(FormItem, {
      attrs: { field: 'email' },
      props: {
        checkPayload: { message: '自定义错误', result: false },
        componentSchema: { label: '字段', type: 'form-item' },
      },
    });
    expect(failWrapper.findComponent(TFormItem).props('status')).toBe('error');
    expect(failWrapper.findComponent(TFormItem).props('help')).toBe(
      '自定义错误',
    );

    const passWrapper = mount(FormItem, {
      attrs: { field: 'email' },
      props: {
        checkPayload: { result: true },
        componentSchema: { label: '字段', type: 'form-item' },
      },
    });
    expect(passWrapper.findComponent(TFormItem).props('status')).toBe(
      'success',
    );
  });
});

describe('form 契约', () => {
  const formSchema: ComponentSchema = {
    children: [],
    label: '表单',
    props: { name: 'default' },
    type: 'form',
  };

  function mountForm() {
    const pageManager = createPageManager();
    return mount(Form, {
      global: { provide: { [PAGE_MANAGER_KEY]: pageManager } },
      props: { componentSchema: formSchema },
      slots: {
        'edit-node': () =>
          h(
            TFormItem,
            {
              label: '邮箱',
              name: 'email',
              rules: [{ message: '请输入邮箱', required: true }],
            },
            () => h(TInput, { modelValue: '' }),
          ),
      },
    });
  }

  it('校验失败时 validate 抛错（TDesign 原生 resolve，需要转换）', async () => {
    const wrapper = mountForm();
    await nextTick();
    await nextTick();

    await expect((wrapper.vm as any).validate()).rejects.toBeTruthy();
  });

  it('校验通过时 validate 返回 true', async () => {
    const wrapper = mountForm();
    await nextTick();
    await nextTick();

    (wrapper.vm as any).getData().email = 'a@b.com';
    await nextTick();

    await expect((wrapper.vm as any).validate()).resolves.toBe(true);
  });

  it('暴露 getData / setData / resetData', async () => {
    const wrapper = mountForm();
    await nextTick();

    (wrapper.vm as any).setData({ email: 'a@b.com' });
    expect((wrapper.vm as any).getData().email).toBe('a@b.com');

    expect(typeof (wrapper.vm as any).resetData).toBe('function');
  });
});

import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { setupTDesign } from '../index';

// 异步组件逐个解析，jsdom 下比浏览器慢，放宽单测超时
vi.setConfig({ testTimeout: 30_000 });

// panel-ui 会在模块加载时静态引入 monaco-editor；集成测试只渲染 EBuilder，
// 不会真正创建编辑器实例，这里用最小桩避免 jsdom 加载 monaco 的 DOM/Worker 依赖。
vi.mock('monaco-editor', () => ({
  editor: {},
  languages: {},
}));

/**
 * 端到端集成测试：schema → EBuilder → NadaNode → 适配包组件
 *
 * 完整走通「页面 schema → 渲染器 → 注册表 → 组件 → form-item 包裹 → 数据绑定 → 表单校验」。
 * 视觉、拖拽、真实上传仍需浏览器验证。
 */

// 直接引用 EBuilder 源码，绕过 @nada-designer/core 入口的 virtual:uno.css（UnoCSS 只在应用构建时提供）
async function loadBuilder() {
  const module = await import(
    '../../../../core/src/components/builder/src/builder.vue'
  );
  return module.default;
}

function schema(
  field: string,
  label: string,
  type = 'input',
  extra: Record<string, any> = {},
) {
  const containerTypes = [
    'card',
    'collapse',
    'collapse-item',
    'col',
    'form',
    'row',
    'tab-pane',
    'tabs',
  ];

  return {
    children: extra.children ?? [],
    field,
    id: `${field}-id`,
    input: !containerTypes.includes(type),
    label,
    props: extra.props ?? {},
    rules: extra.rules,
    type,
  };
}

const pageSchema = {
  canvas: { height: 800, width: 1200 },
  schemas: [
    {
      children: [
        schema('name', '姓名', 'input', {
          rules: [{ message: '请输入姓名', required: true }],
        }),
        schema('city', '城市', 'select', {
          props: {
            options: [
              { label: '北京', value: 'bj' },
              { label: '上海', value: 'sh' },
            ],
          },
        }),
        schema('birthday', '生日', 'date', {
          props: { type: 'date', valueFormat: 'YYYY-MM-DD' },
        }),
        schema('age', '年龄', 'number'),
        schema('enabled', '启用', 'switch'),
        schema('gender', '性别', 'radio', {
          props: {
            options: [
              { label: '男', value: 'm' },
              { label: '女', value: 'f' },
            ],
          },
        }),
        schema('hobby', '爱好', 'checkbox', {
          props: {
            options: [
              { label: '读书', value: 'read' },
              { label: '运动', value: 'sport' },
            ],
          },
        }),
        schema('avatar', '头像', 'upload-image'),
      ],
      field: 'form',
      id: 'form-id',
      input: false,
      label: '表单',
      props: { name: 'default' },
      type: 'form',
    },
    {
      children: [
        {
          children: [schema('street', '街道', 'input')],
          id: 'col-1',
          input: false,
          label: '列1',
          props: { span: 12 },
          type: 'col',
        },
        {
          children: [schema('district', '区域', 'input')],
          id: 'col-2',
          input: false,
          label: '列2',
          props: { span: 12 },
          type: 'col',
        },
      ],
      id: 'row-id',
      input: false,
      label: '栅格',
      props: { gutter: 12 },
      type: 'row',
    },
    {
      children: [schema('remark', '备注', 'input')],
      id: 'card-id',
      input: false,
      label: '卡片',
      type: 'card',
    },
    {
      children: [
        {
          children: [schema('c1', '折叠内容', 'input')],
          id: 'ci1',
          label: '折叠1',
          type: 'collapse-item',
        },
      ],
      id: 'collapse-id',
      input: false,
      label: '折叠面板',
      type: 'collapse',
    },
    {
      children: [
        {
          children: [schema('t1', '页签内容', 'input')],
          id: 'tp1',
          label: '标签1',
          type: 'tab-pane',
        },
        { children: [], id: 'tp2', label: '标签2', type: 'tab-pane' },
      ],
      id: 'tabs-id',
      input: false,
      label: '标签页',
      props: { defaultValue: '标签1' },
      type: 'tabs',
    },
  ],
};

// jsdom 中异步组件逐个解析完成，断言前轮询等待全部就绪
const EXPECTED_COMPONENTS = [
  'TForm',
  'TInput',
  'TSelect',
  'TDatePicker',
  'TInputNumber',
  'TSwitch',
  'TRadioGroup',
  'TCheckboxGroup',
  'TUpload',
  'TRow',
  'TCol',
  'TCard',
  'TCollapse',
  'TTabs',
];

async function waitForComponents(
  wrapper: any,
  timeout = 12_000,
): Promise<void> {
  const start = Date.now();
  let missing = EXPECTED_COMPONENTS.slice();

  while (Date.now() - start < timeout) {
    await nextTick();
    await flushPromises();
    missing = EXPECTED_COMPONENTS.filter(
      (name) => !wrapper.findComponent({ name }).exists(),
    );
    if (missing.length === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 15));
  }

  throw new Error(`等待组件渲染超时，未渲染: ${missing.join(', ')}`);
}

async function mountBuilder() {
  const Builder = await loadBuilder();
  const wrapper = mount(Builder as any, {
    props: { pageSchema: JSON.parse(JSON.stringify(pageSchema)) },
  });

  await waitForComponents(wrapper);

  return wrapper;
}

describe('TDesign 适配包端到端集成', () => {
  beforeAll(() => {
    setupTDesign();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('完整 schema 渲染出全部组件与布局容器', async () => {
    const wrapper = await mountBuilder();

    expect(wrapper.find('.ep-builder-main').exists()).toBe(true);

    EXPECTED_COMPONENTS.forEach((name) => {
      expect(wrapper.findComponent({ name }).exists(), `缺少 ${name}`).toBe(
        true,
      );
    });

    // 标签经由 form-item 渲染
    const html = wrapper.html();
    ['姓名', '城市', '折叠1', '标签1', '页签内容'].forEach((text) => {
      expect(html, `缺少文案 ${text}`).toContain(text);
    });
  });

  it('渲染过程不出现未注册组件', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await mountBuilder();

    const unregistered = errorSpy.mock.calls.filter((args) =>
      String(args[0] ?? '').includes('未注册'),
    );
    expect(unregistered).toEqual([]);
  });

  it('数据写入回显到 TDesign 输入组件', async () => {
    const wrapper = await mountBuilder();

    (wrapper.vm as any).setData({ city: 'bj', name: '张三' });
    await nextTick();
    await nextTick();

    const inputValues = wrapper
      .findAll('.t-input input')
      .map((item) => (item.element as HTMLInputElement).value);
    expect(inputValues).toContain('张三');
  });

  it('必填校验：空值 reject，填值后 resolve 并返回表单数据', async () => {
    const wrapper = await mountBuilder();

    await expect((wrapper.vm as any).validate()).rejects.toBeTruthy();

    (wrapper.vm as any).setData({ name: '张三' });
    await nextTick();

    await expect((wrapper.vm as any).validate()).resolves.toMatchObject({
      name: '张三',
    });
  });

  it('getData / resetData 走通表单实例链路', async () => {
    const wrapper = await mountBuilder();

    (wrapper.vm as any).setData({ name: '张三' });
    await nextTick();

    const data = await (wrapper.vm as any).getData();
    expect(data.name).toBe('张三');

    expect(typeof (wrapper.vm as any).resetData).toBe('function');
    (wrapper.vm as any).resetData();
    await nextTick();
  });
});

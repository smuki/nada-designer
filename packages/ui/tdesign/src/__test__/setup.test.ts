import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import { createPluginManager } from '@nada-designer/manager';

import { setupTDesign } from '../index';

/**
 * TDesign 适配包冒烟测试
 *
 * 覆盖：基础组件 type 注册、设计器外壳硬编码 type、全局提示函数、初始化状态、
 * 与其它适配包的 type 对齐、属性编辑器引用合法性、上传配置行为。
 * 任何一个 type 缺失都会让设计器在运行时静默降级（属性面板空白 / 组件不渲染）。
 */

// 适配包对外承诺的组件 type（与 elementPlus / naiveUi 适配包保持一致，另含 antd 独有的 time）
const EXPECTED_TYPES = [
  'button',
  'card',
  'cascader',
  'checkbox',
  'col',
  'collapse',
  'collapse-item',
  'color-picker',
  'date',
  'form',
  'form-item',
  'input',
  'modal',
  'number',
  'radio',
  'row',
  'select',
  'slider',
  'switch',
  'tab-pane',
  'tabs',
  'textarea',
  'time',
  'upload-file',
  'upload-image',
];

// 设计器外壳按固定 type 查找的组件，缺失会在运行时直接报错
const SHELL_TYPES = [
  'button',
  'form',
  'form-item',
  'input',
  'modal',
  'number',
  'radio',
  'select',
];

// 属性面板可用的编辑器 type：适配包自身组件 + 面板提供的编辑器
const EDITOR_TYPES = new Set([
  ...EXPECTED_TYPES,
  'EActionEditor',
  'EColEditor',
  'EInputSize',
  'EOptionsEditor',
  'ERuleEditor',
  'ETabPaneEditor',
  'EpField',
  'MonacoEditor',
  'Page',
]);

const CONTAINER_TYPES = [
  'card',
  'collapse',
  'col',
  'form',
  'modal',
  'row',
  'tabs',
];

describe('setupTDesign', () => {
  let pluginManager: ReturnType<typeof createPluginManager>;

  beforeEach(() => {
    pluginManager = createPluginManager();
    setupTDesign(pluginManager);
  });

  it('注册全部组件 type', () => {
    EXPECTED_TYPES.forEach((type) => {
      expect(
        pluginManager.component.get(type),
        `组件 type 未注册: ${type}`,
      ).toBeTruthy();
    });
  });

  it('注册设计器外壳硬编码的 type', () => {
    SHELL_TYPES.forEach((type) => {
      expect(
        pluginManager.component.get(type),
        `外壳依赖的 type 未注册: ${type}`,
      ).toBeTruthy();
    });
  });

  it('每个组件的配置与默认 schema 结构合法', () => {
    EXPECTED_TYPES.forEach((type) => {
      const config = pluginManager.component.getConfigByType(type);
      expect(config, `缺少组件配置: ${type}`).toBeTruthy();
      expect(config.defaultSchema.type).toBe(type);
      expect(config.config).toBeTruthy();
    });
  });

  it('容器组件声明了 children 数组', () => {
    CONTAINER_TYPES.forEach((type) => {
      const config = pluginManager.component.getConfigByType(type);
      expect(Array.isArray(config.defaultSchema.children), type).toBe(true);
    });
  });

  it('属性面板引用的编辑器 type 均存在（避免属性行空白）', () => {
    const missing: string[] = [];

    Object.values(pluginManager.component.getComponentConfigs()).forEach(
      (config) => {
        (config.config.attribute ?? []).forEach((attribute) => {
          if (attribute.type && !EDITOR_TYPES.has(attribute.type)) {
            missing.push(
              `${config.defaultSchema.type}.${String(attribute.field)} → ${attribute.type}`,
            );
          }
        });
      },
    );

    expect(missing).toEqual([]);
  });

  it('上传组件使用 modelValue 作为绑定字段', () => {
    ['upload-file', 'upload-image'].forEach((type) => {
      expect(
        pluginManager.component.getConfigByType(type).bindModel,
        type,
      ).toBe('modelValue');
    });
  });

  it('表单类组件被标记为 input 并生成 setValue/getValue 动作', () => {
    const inputConfig = pluginManager.component.getConfigByType('input');
    expect(inputConfig.defaultSchema.input).toBe(true);

    const actionTypes = (inputConfig.config.action ?? []).map(
      (action) => action.type,
    );
    expect(actionTypes).toContain('setValue');
    expect(actionTypes).toContain('getValue');
  });

  it('注册全局提示函数并标记初始化完成', () => {
    expect(pluginManager.global.$message.success).toBeTypeOf('function');
    expect(pluginManager.global.$message.error).toBeTypeOf('function');
    expect(pluginManager.global.$message.warning).toBeTypeOf('function');
    expect(pluginManager.global.$message.info).toBeTypeOf('function');
    expect(pluginManager.designer.initialized.value).toBe(true);
  });

  it('重复 setup（UI 切换场景）后组件仍然可用', () => {
    pluginManager.component.removeBaseComponents();
    pluginManager.designer.initialized.value = false;

    setupTDesign(pluginManager);

    EXPECTED_TYPES.forEach((type) => {
      expect(
        pluginManager.component.get(type),
        `切换 UI 后组件缺失: ${type}`,
      ).toBeTruthy();
    });
    expect(pluginManager.designer.initialized.value).toBe(true);
  });

  it('type 集合覆盖 elementPlus 与 naiveUi 适配包（schema 跨库迁移的基础）', async () => {
    const { setupElementPlus } = await import('nada-designer-element-plus');
    const { setupNaiveUi } = await import('nada-designer-naive-ui');

    const elementPlusManager = createPluginManager();
    setupElementPlus(elementPlusManager);
    const naiveUiManager = createPluginManager();
    setupNaiveUi(naiveUiManager);

    const ours = new Set(EXPECTED_TYPES);

    Object.keys(elementPlusManager.component.getComponentConfigs()).forEach(
      (type) => {
        expect(ours.has(type), `elementPlus 的 type 未覆盖: ${type}`).toBe(
          true,
        );
      },
    );

    Object.keys(naiveUiManager.component.getComponentConfigs()).forEach(
      (type) => {
        expect(ours.has(type), `naiveUi 的 type 未覆盖: ${type}`).toBe(true);
      },
    );
  }, 60_000);
});

describe('setupTDesign 上传配置', () => {
  it('config 上传地址写入 defaultSchema.props.action', () => {
    const pluginManager = createPluginManager();
    setupTDesign(pluginManager, {
      uploadFile: 'https://file-upload',
      uploadImage: 'https://image-upload',
    });

    expect(
      pluginManager.component.getConfigByType('upload-image').defaultSchema
        .props?.action,
    ).toBe('https://image-upload');
    expect(
      pluginManager.component.getConfigByType('upload-file').defaultSchema.props
        ?.action,
    ).toBe('https://file-upload');
  });

  it('全局上传地址命中时移除属性面板中的请求地址项', async () => {
    const pluginManager = createPluginManager();
    pluginManager.global.uploadImage = 'https://global-upload';
    pluginManager.global.uploadFile = 'https://global-file';

    setupTDesign(pluginManager);
    await nextTick();

    const imageAttrs =
      pluginManager.component.getConfigByType('upload-image').config
        .attribute ?? [];
    const fileAttrs =
      pluginManager.component.getConfigByType('upload-file').config.attribute ??
      [];

    expect(imageAttrs.some((item) => item.field === 'props.action')).toBe(
      false,
    );
    expect(fileAttrs.some((item) => item.field === 'props.action')).toBe(false);
  });
});

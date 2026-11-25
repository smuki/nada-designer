import { beforeEach, describe, expect, it } from 'vitest';

import { createPluginManager } from '@nada-designer/manager';

import { setupTDesign } from '../index';

/**
 * TDesign 适配包冒烟测试
 *
 * 覆盖：基础组件 type 注册、设计器外壳硬编码 type、全局提示函数、初始化状态。
 * 任何一个 type 缺失都会让设计器在运行时静默降级（属性面板空白 / 组件不渲染）。
 */

// 适配包对外承诺的组件 type（与 elementPlus / naiveUi 适配包保持一致，另含 antd 独有的 time）
const EXPECTED_TYPES = [
  'button',
  'card',
  'cascader',
  'checkbox',
  'collapse',
  'collapse-item',
  'color-picker',
  'col',
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
});

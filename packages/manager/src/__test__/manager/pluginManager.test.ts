import { describe, expect, it, vi } from 'vitest';

import { createPluginManager } from '../../';

/**
 * pluginManager 对外契约测试
 *
 * 覆盖：分组 API、旧 API 兼容代理、面板注册、公共方法、全局配置、初始化状态。
 * 这些是「pluginManager 注入化」重构时必须保持不变的行为。
 */

function makeConfig(overrides: Record<string, any> = {}): any {
  return {
    component: { render: () => null },
    config: { action: [], attribute: [] },
    defaultSchema: { input: true, label: '输入框', props: {}, type: 'input' },
    ...overrides,
  };
}

describe('createPluginManager 对外契约', () => {
  it('分组 API：component.register / get / getConfigByType 可用', () => {
    const pm = createPluginManager();
    const config = makeConfig();

    pm.component.register(config);

    expect(pm.component.get('input')).toBeTruthy();
    expect(pm.component.getConfigByType('input')).toBe(config);
    expect(pm.component.getLabel('input')).toBe('输入框');
  });

  it('旧 API 访问会通过 Proxy 转发到新分组，并打印迁移告警', () => {
    const pm = createPluginManager();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const config = makeConfig();

    // 旧写法：pm.register(config)
    (pm as any).registerComponent(config);

    expect(warnSpy).toHaveBeenCalled();
    expect(pm.component.getConfigByType('input')).toBe(config);
    warnSpy.mockRestore();
  });

  it('publicMethods：add / remove / methodsMap', () => {
    const pm = createPluginManager();
    const handler = vi.fn();

    pm.publicMethods.add({ handler, name: 'greet' } as any);
    expect(pm.publicMethods.methodsMap.greet).toBeDefined();
    expect(pm.publicMethods.methodsMap.greet.handler).toBe(handler);

    pm.publicMethods.remove('greet');
    expect(pm.publicMethods.methodsMap.greet).toBeUndefined();
  });

  it('publicMethods：兼容 methodName / method / describe 旧字段并告警', () => {
    const pm = createPluginManager();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const handler = vi.fn();

    pm.publicMethods.add({
      describe: '旧描述',
      method: handler,
      methodName: 'legacyFn',
    } as any);

    expect(pm.publicMethods.methodsMap.legacyFn.handler).toBe(handler);
    expect(warnSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
    warnSpy.mockRestore();
    pm.publicMethods.remove('legacyFn');
  });

  it('panel：注册活动栏 + 隐藏/显示', () => {
    const pm = createPluginManager();

    pm.panel.registerActivitybar({
      component: { render: () => null },
      icon: 'icon-a',
      id: 'bar-a',
      title: 'A',
    } as any);

    const ids = () => pm.panel.activityBars.value.map((item: any) => item.id);
    expect(ids()).toContain('bar-a');

    pm.panel.hideActivitybar('bar-a');
    expect(ids()).not.toContain('bar-a');

    pm.panel.showActivitybar('bar-a');
    expect(ids()).toContain('bar-a');
  });

  it('global：默认值为空，可写入全局配置', () => {
    const pm = createPluginManager();

    expect(pm.global.uploadFile).toBeNull();
    expect(pm.global.uploadImage).toBeNull();

    pm.global.uploadImage = 'https://example.com/upload';
    expect(pm.global.uploadImage).toBe('https://example.com/upload');
  });

  it('designer：setInitialized 控制 initialized 状态', () => {
    const pm = createPluginManager();

    expect(pm.designer.initialized.value).toBe(false);
    pm.designer.setInitialized(true);
    expect(pm.designer.initialized.value).toBe(true);
  });
});

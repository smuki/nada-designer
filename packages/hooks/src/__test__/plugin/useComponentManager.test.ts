import { createPluginManager } from '@nada-designer/manager';

import { describe, expect, it, vi } from 'vitest';

/**
 * 组件注册表契约测试
 *
 * 通过 createPluginManager() 拿到隔离实例，避免污染全局单例。
 * 这一层是 pluginManager 的核心，后续若做「pluginManager 注入化」重构，
 * 必须先保证这些行为完全不变。
 *
 * 注意：必须从 @nada-designer/manager 入口导入。直接按文件导入 hooks 里的
 * useComponentManager 会因为 utils ↔ manager ↔ hooks 的循环依赖导致模块初始化顺序出错
 * （TypeError: useComponentManager is not a function）。
 */

function makeConfig(overrides: Record<string, any> = {}): any {
  return {
    component: { render: () => null },
    config: { action: [], attribute: [] },
    defaultSchema: { input: true, label: '输入框', props: {}, type: 'input' },
    ...overrides,
  };
}

function createManager() {
  return createPluginManager().component;
}

describe('组件注册表契约（useComponentManager）', () => {
  it('register 按 defaultSchema.type 注册，可通过 get / getConfigByType / getLabel 取回', () => {
    const component = createManager();
    const config = makeConfig();

    component.register(config);

    expect(component.getConfigByType('input')).toBe(config);
    expect(component.get('input')).toBeTruthy();
    expect(component.getLabel('input')).toBe('输入框');
    expect(component.getIcon('input')).toBe('icon--nada--component');
    expect(component.getLocked('input')).toBeUndefined();
  });

  it('输入组件会自动注入 setValue / getValue / setAttr 三个动作', () => {
    const component = createManager();
    const config = makeConfig({
      config: {
        action: [],
        attribute: [
          { field: 'props.placeholder', label: '占位提示', type: 'input' },
        ],
      },
    });

    component.register(config);

    const actionTypes = config.config.action.map((item: any) => item.type);
    expect(actionTypes).toContain('setValue');
    expect(actionTypes).toContain('getValue');
    expect(actionTypes).toContain('setAttr');
  });

  it('setAttr 的 argsConfigs 只收 props.* 属性，并生成「选择属性」下拉选项', () => {
    const component = createManager();
    const config = makeConfig({
      config: {
        action: [],
        attribute: [
          { field: 'props.placeholder', label: '占位提示', type: 'input' },
          { field: 'field', label: '字段名', type: 'input' },
          { field: 'props.size', label: '尺寸', type: 'select' },
        ],
      },
    });

    component.register(config);

    const setAttr = config.config.action.find(
      (item: any) => item.type === 'setAttr',
    );
    expect(setAttr.argsConfigs[0].props.options).toEqual([
      { label: '占位提示', value: 'placeholder' },
      { label: '尺寸', value: 'size' },
    ]);
    expect(setAttr.argsConfigs[1].field).toBe('1');
  });

  it('非输入组件不注入 setValue / getValue，但仍注入 setAttr', () => {
    const component = createManager();
    const config = makeConfig({
      defaultSchema: { label: '按钮', props: {}, type: 'button' },
    });

    component.register(config);

    const actionTypes = config.config.action.map((item: any) => item.type);
    expect(actionTypes).not.toContain('setValue');
    expect(actionTypes).not.toContain('getValue');
    expect(actionTypes).toContain('setAttr');
  });

  it('register 会把旧字段 componentProps 迁移为 props 并告警', () => {
    const component = createManager();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const config = makeConfig({
      defaultSchema: {
        componentProps: { placeholder: '旧' },
        input: true,
        label: '输入框',
        type: 'legacy',
      },
    });

    component.register(config);

    expect(config.defaultSchema.props).toEqual({ placeholder: '旧' });
    expect(config.defaultSchema.componentProps).toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('只有带 groupName 的组件会进入组件分组', () => {
    const component = createManager();
    component.register(
      makeConfig({
        defaultSchema: { label: 'A', props: {}, type: 'a' },
        groupName: '基础',
      }),
    );
    component.register(
      makeConfig({ defaultSchema: { label: 'B', props: {}, type: 'b' } }),
    );

    const groups = component.getComponentSchemaGroups().value;
    expect(groups).toHaveLength(1);
    expect(groups[0].title).toBe('基础');
    expect(groups[0].list.map((item: any) => item.type)).toEqual(['a']);
  });

  it('分组内按 sort 升序，分组之间按 setSortedGroups 顺序', () => {
    const component = createManager();
    component.register(
      makeConfig({
        defaultSchema: { label: 'A2', props: {}, type: 'a2' },
        groupName: '基础',
        sort: 2,
      }),
    );
    component.register(
      makeConfig({
        defaultSchema: { label: 'A1', props: {}, type: 'a1' },
        groupName: '基础',
        sort: 1,
      }),
    );
    component.register(
      makeConfig({
        defaultSchema: { label: 'B', props: {}, type: 'b1' },
        groupName: '高级',
      }),
    );
    component.setSortedGroups(['高级', '基础']);

    const groups = component.getComponentSchemaGroups().value;
    expect(groups.map((group: any) => group.title)).toEqual(['高级', '基础']);
    expect(groups[1].list.map((item: any) => item.type)).toEqual(['a1', 'a2']);
  });

  it('hide 会让组件从分组消失，show 恢复', () => {
    const component = createManager();
    component.register(
      makeConfig({
        defaultSchema: { label: 'A', props: {}, type: 'a' },
        groupName: '基础',
      }),
    );

    component.hide('a');
    expect(component.getComponentSchemaGroups().value).toHaveLength(0);

    component.show('a');
    expect(component.getComponentSchemaGroups().value).toHaveLength(1);
  });

  it('remove 同时移除配置与组件实例', () => {
    const component = createManager();
    component.register(makeConfig());

    component.remove('input');

    expect(component.getConfigByType('input')).toBeUndefined();
    expect(component.get('input')).toBeUndefined();
  });

  it('add 低优先级不会覆盖已注册的高优先级实现', () => {
    const component = createManager();
    const high = { render: () => 'high' };
    const low = { render: () => 'low' };

    component.add('x', high as any, 100);
    component.add('x', low as any, 1);

    expect(component.get('x')).toBe(high);
  });
});

import { defineComponent } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import { createPageManager, pluginManager } from '../../';

describe('createPageManager 函数测试', () => {
  it('应该正确创建 PageManager 实例', () => {
    const pageManager = createPageManager();
    expect(pageManager).toBeDefined();
    expect(pageManager.componentInstances).toBeInstanceOf(Object);
    expect(pageManager.funcs).toBeInstanceOf(Object);
    expect(pageManager.isDesignMode).toBeInstanceOf(Object);
    expect(pageManager.defaultComponentIds).toBeInstanceOf(Object);
    expect(pageManager.forms).toBeInstanceOf(Object);
  });

  it('应该正确添加和移除组件实例', () => {
    const pageManager = createPageManager();
    const mockInstance = defineComponent({
      name: 'Cmp',
    }) as any; // 模拟 Vue 组件实例

    pageManager.addComponentInstance('component1', mockInstance);
    expect(pageManager.findInstance('component1')).toEqual(mockInstance);

    pageManager.removeComponentInstance('component1');
    expect(pageManager.findInstance('component1')).toBeNull();
  });

  it('应该正确设置和获取方法', () => {
    const pageManager = createPageManager();
    const mockScript = `const { defineExpose, find } = nada;

            function test (){
                return 'mock result'
            }

            // 通过defineExpose暴露的函数或者属性
            defineExpose({
            test
            })`;
    pageManager.setMethods(mockScript);

    expect(pageManager.funcs.value.test).toBeDefined();
    expect(pageManager.funcs.value.test()).toBe('mock result');
  });

  it('自定义脚本语法错误时应记录到 scriptError，而不是抛异常', () => {
    const pageManager = createPageManager();

    pageManager.setMethods('function {{{ 这不是合法 JS', true);

    expect(pageManager.scriptError.value).toBeInstanceOf(Error);
  });

  it('应该正确设置设计模式', () => {
    const pageManager = createPageManager();

    pageManager.setDesignMode(true);
    expect(pageManager.isDesignMode.value).toBe(true);

    pageManager.setDesignMode(false);
    expect(pageManager.isDesignMode.value).toBe(false);
  });

  it('应该正确设置表单数据', () => {
    const pageManager = createPageManager();
    const formData = { field1: 'value1' };

    pageManager.setFormData(formData, 'form1');
    expect(pageManager.forms.form1).toEqual(formData);
  });

  it('setFormData 同名表单应做合并而不是覆盖', () => {
    const pageManager = createPageManager();

    pageManager.setFormData({ a: 1 }, 'mergeForm');
    pageManager.setFormData({ b: 2 }, 'mergeForm');

    expect(pageManager.forms.mergeForm).toEqual({ a: 1, b: 2 });
  });

  it('应该正确设置默认组件 IDs', () => {
    const pageManager = createPageManager();
    const schemas = [
      { id: 'component1', type: 'component' },
      { id: 'component2', type: 'component' },
    ];

    pageManager.setDefaultComponentIds(schemas);
    expect(pageManager.defaultComponentIds.value).toEqual([
      'component2',
      'component1',
    ]);
  });

  it('findInstance 支持按 schema 字段查找组件实例', () => {
    const pageManager = createPageManager();
    pageManager.setPageSchema({
      schemas: [{ field: 'userName', id: 'n1', type: 'input' }],
      script: '',
    } as any);
    const instance = { exposed: { getValue: () => 1 } } as any;
    pageManager.addComponentInstance('n1', instance);

    expect(pageManager.findInstance('userName', 'field')).toEqual(instance);
    expect(pageManager.findInstance('not-exist', 'field')).toBeNull();
  });
});

describe('pageManager.doActions', () => {
  it('type=component 调用组件实例 exposed 上的方法', () => {
    const pageManager = createPageManager();
    const setValue = vi.fn();
    pageManager.addComponentInstance('c1', { exposed: { setValue } } as any);

    pageManager.doActions([
      {
        args: '["hello"]',
        componentId: 'c1',
        methodName: 'setValue',
        type: 'component',
      },
    ]);

    expect(setValue).toHaveBeenCalledWith('hello');
  });

  it('type=custom 调用页面脚本 defineExpose 出来的函数', () => {
    const pageManager = createPageManager();
    (globalThis as any).__nadaCalls = 0;
    pageManager.setMethods(
      'const { defineExpose } = nada;\nfunction hello(){ globalThis.__nadaCalls++; }\ndefineExpose({ hello });',
    );

    pageManager.doActions([{ methodName: 'hello', type: 'custom' }]);

    expect((globalThis as any).__nadaCalls).toBe(1);
    delete (globalThis as any).__nadaCalls;
  });

  it('type=public 调用 pluginManager 注册的公共方法', () => {
    const pageManager = createPageManager();
    const handler = vi.fn();
    pluginManager.publicMethods.add({ handler, name: 'testPublicFn' } as any);

    pageManager.doActions([{ methodName: 'testPublicFn', type: 'public' }]);

    expect(handler).toHaveBeenCalledTimes(1);
    pluginManager.publicMethods.remove('testPublicFn');
  });

  it('参数支持 __isExpression__ 表达式，按 formData 求值', () => {
    const pageManager = createPageManager();
    const setValue = vi.fn();
    pageManager.addComponentInstance('c1', { exposed: { setValue } } as any);
    pageManager.setFormData({ a: 41 }, 'default');

    pageManager.doActions([
      {
        args: JSON.stringify([
          { __isExpression__: true, content: '$formData.a + 1' },
        ]),
        componentId: 'c1',
        methodName: 'setValue',
        type: 'component',
      },
    ]);

    expect(setValue).toHaveBeenCalledWith(42);
  });

  it('动作列表为空时应发出告警且不报错', () => {
    const pageManager = createPageManager();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    pageManager.doActions([]);

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

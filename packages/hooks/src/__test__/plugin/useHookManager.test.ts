import { describe, expect, it, vi } from 'vitest';

import { useHookManager } from '../../plugin/useHookManager';

describe('useHookManager', () => {
  it('execute 应按注册顺序执行所有钩子（回归：此前只执行第一个）', async () => {
    const manager = useHookManager();
    const calls: string[] = [];

    manager.register('nodeRender', () => {
      calls.push('a');
    });
    manager.register('nodeRender', () => {
      calls.push('b');
    });
    manager.register('nodeRender', () => {
      calls.push('c');
    });

    await manager.execute('nodeRender', {});

    expect(calls).toEqual(['a', 'b', 'c']);
  });

  it('单个钩子抛错不应阻断后续钩子', async () => {
    const manager = useHookManager();
    const second = vi.fn();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    manager.register('formChange', () => {
      throw new Error('boom');
    });
    manager.register('formChange', second);

    await manager.execute('formChange', {});

    expect(second).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('register 返回的函数可以取消注册', async () => {
    const manager = useHookManager();
    const callback = vi.fn();
    const unregister = manager.register('nodeRender', callback);

    unregister();
    await manager.execute('nodeRender', {});

    expect(callback).not.toHaveBeenCalled();
    expect(manager.getCount('nodeRender')).toBe(0);
  });
});

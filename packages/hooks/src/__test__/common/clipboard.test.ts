// 先加载 manager，建立正确的模块加载顺序（否则 utils ↔ manager ↔ hooks 的
// 循环依赖会导致 hooks 内部模块初始化不完整）
import '@nada-designer/manager';

import { useClipboard } from '@nada-designer/hooks';

import { describe, expect, it, vi } from 'vitest';

/**
 * 剪贴板契约测试：复制 / 剪切 / 粘贴 / 复制一份
 */

function makePageSchema(): any {
  return {
    schemas: [
      {
        children: [
          { field: 'a', id: 'a', type: 'input' },
          { field: 'b', id: 'b', type: 'input' },
          { field: 'c', id: 'c', type: 'input' },
        ],
        id: 'root',
        type: 'page',
      },
    ],
  };
}

describe('useClipboard', () => {
  it('copy：没有选中节点时返回 false，有节点时返回 true', () => {
    const { copy } = useClipboard(makePageSchema(), vi.fn(), vi.fn());

    expect(copy(null)).toBe(false);
    expect(copy({ id: 'a', type: 'input' })).toBe(true);
  });

  it('paste：剪贴板为空时返回 false', () => {
    const { paste } = useClipboard(makePageSchema(), vi.fn(), vi.fn());

    expect(paste('a')).toBe(false);
  });

  it('paste：插入到选中节点之后，生成新 id，并选中新节点 + 记录撤销', () => {
    const pageSchema = makePageSchema();
    const setSelectedNode = vi.fn();
    const revokePush = vi.fn();
    const clipboard = useClipboard(pageSchema, setSelectedNode, revokePush);

    clipboard.copy({ children: [], field: 'x', id: 'a', type: 'input' });
    expect(clipboard.paste('a')).toBe(true);

    const children = pageSchema.schemas[0].children;
    expect(children).toHaveLength(4);
    expect(children[0].id).toBe('a');
    // 新节点插在 a 之后
    expect(children[1].id).not.toBe('a');
    expect(children[1].type).toBe('input');
    expect(setSelectedNode).toHaveBeenCalledWith(children[1]);
    expect(revokePush).toHaveBeenCalledWith('粘贴组件');
  });

  it('duplicate：直接以树中节点为模板复制一份，插入其后', () => {
    const pageSchema = makePageSchema();
    const setSelectedNode = vi.fn();
    const revokePush = vi.fn();
    const { duplicate } = useClipboard(pageSchema, setSelectedNode, revokePush);

    expect(duplicate('b')).toBe(true);

    const children = pageSchema.schemas[0].children;
    expect(children).toHaveLength(4);
    expect(children.map((item: any) => item.id).slice(0, 2)).toEqual([
      'a',
      'b',
    ]);
    expect(children[2].id).not.toBe('b');
    expect(revokePush).toHaveBeenCalledWith('复制组件');
  });

  it('已知缺陷：节点不存在时抛异常（调用方的 if (!data) 是死代码）', () => {
    // findSchemaInfoById 在找不到节点时直接 throw，
    // 因此 clipboard 里 `if (!data) return false` 永远不会执行。
    const { duplicate } = useClipboard(makePageSchema(), vi.fn(), vi.fn());

    expect(() => duplicate('not-exist')).toThrow(/没有查询到id/);
  });

  it('cut：把节点移入剪贴板并从树中删除，选中相邻节点', () => {
    const pageSchema = makePageSchema();
    const setSelectedNode = vi.fn();
    const revokePush = vi.fn();
    const clipboard = useClipboard(pageSchema, setSelectedNode, revokePush);

    expect(clipboard.cut({ id: 'c', type: 'input' })).toBe(true);

    const children = pageSchema.schemas[0].children;
    expect(children.map((item: any) => item.id)).toEqual(['a', 'b']);
    // 删除的是最后一个，选中前一个
    expect(setSelectedNode).toHaveBeenCalledWith(children[1]);
    expect(revokePush).toHaveBeenCalledWith('剪切组件');
    expect(clipboard.clipboardNode.value?.id).toBe('c');
  });

  it('cut：没有 id 时返回 false', () => {
    const { cut } = useClipboard(makePageSchema(), vi.fn(), vi.fn());

    expect(cut(null)).toBe(false);
  });

  it('剪切后再粘贴，会生成与原来不同的 id', () => {
    const pageSchema = makePageSchema();
    const clipboard = useClipboard(pageSchema, vi.fn(), vi.fn());

    clipboard.cut({ id: 'b', type: 'input' });
    clipboard.paste('a');

    const children = pageSchema.schemas[0].children;
    const pasted = children[1];
    expect(pasted.id).not.toBe('b');
    expect(pasted.type).toBe('input');
  });

  it('canMutate 返回 false 时四个 API 都静默失败且不写撤销栈', () => {
    const pageSchema = makePageSchema();
    const setSelectedNode = vi.fn();
    const revokePush = vi.fn();
    const clipboard = useClipboard(pageSchema, setSelectedNode, revokePush, {
      canMutate: () => false,
    });
    const before = JSON.stringify(pageSchema);

    expect(clipboard.copy({ id: 'a', type: 'input' })).toBe(false);
    expect(clipboard.cut({ id: 'b', type: 'input' })).toBe(false);
    expect(clipboard.paste('a')).toBe(false);
    expect(clipboard.duplicate('a')).toBe(false);

    expect(JSON.stringify(pageSchema)).toBe(before);
    expect(clipboard.clipboardNode.value).toBe(null);
    expect(revokePush).not.toHaveBeenCalled();
    expect(setSelectedNode).not.toHaveBeenCalled();
  });

  it('canMutate 默认允许（旧的三参调用不受影响）', () => {
    const pageSchema = makePageSchema();
    const clipboard = useClipboard(pageSchema, vi.fn(), vi.fn());

    expect(clipboard.copy({ id: 'a', type: 'input' })).toBe(true);
    expect(clipboard.clipboardNode.value?.id).toBe('a');
  });
});

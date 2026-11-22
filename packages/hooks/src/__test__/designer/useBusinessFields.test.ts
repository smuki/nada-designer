// 先加载 manager，建立正确的模块加载顺序（否则 utils ↔ manager ↔ hooks 的
// 循环依赖会导致 hooks 内部模块初始化不完整）
import '@nada-designer/manager';

import { useBusinessFields, validateFieldMeta } from '@nada-designer/hooks';

import { describe, expect, it, vi } from 'vitest';

function makePageSchema(): any {
  return {
    schemas: [
      {
        children: [{ field: 'placed', id: 'in_1', input: true, type: 'input' }],
        id: 'root',
        type: 'form',
      },
    ],
  };
}

function makeConfig(type: string): any {
  return {
    attribute: [{ field: 'props.precision' }],
    defaultSchema: {
      field: type,
      input: true,
      label: type,
      props: { placeholder: '请输入' },
      type,
    },
  };
}

const getComponentConfig = (type: string) => makeConfig(type);

describe('validateFieldMeta 函数测试', () => {
  it('非数组返回空并记录问题', () => {
    const result = validateFieldMeta({});

    expect(result.fields).toEqual([]);
    expect(result.issues.length).toBe(1);
  });

  it('单条失败只影响该字段', () => {
    const result = validateFieldMeta(
      [
        { field: 'ok', label: '正常', type: 'text' },
        { field: '1bad', label: '非法', type: 'text' },
        { field: 'ok', label: '重复', type: 'text' },
        { field: 'refNoEntity', label: '缺实体', type: 'ref' },
        { field: 'weird', label: '未知', type: 'uuid' },
        { field: 'listField', label: '列表', type: 'list' },
      ],
      getComponentConfig,
    );

    expect(result.fields.map((item) => item.field)).toEqual(['ok']);
    expect(result.issues.length).toBeGreaterThanOrEqual(4);
  });
});

describe('useBusinessFields 函数测试', () => {
  it('load：成功加载、active:false 不进面板、命中缓存不再调用 loader', async () => {
    const loader = vi.fn().mockResolvedValue([
      { field: 'ok', label: ' OK ', type: 'text' },
      { field: 'hidden', label: '隐藏', type: 'text', active: false },
    ]);
    const bf = useBusinessFields(makePageSchema(), {
      getComponentConfig,
      loader,
    });

    expect(await bf.load('单据A')).toBe(true);
    expect(bf.status.value).toBe('ready');
    expect(bf.fields.value.map((item) => item.field)).toEqual(['ok']);
    expect(bf.fields.value[0].label).toBe('OK');
    expect(bf.fieldMap.value.get('ok')?.label).toBe('OK');
    expect(loader).toHaveBeenCalledTimes(1);

    const cached = useBusinessFields(makePageSchema(), {
      getComponentConfig,
      loader,
    });
    expect(await cached.load('单据A')).toBe(true);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('校验：当前 UI 库无映射组件时跳过', async () => {
    const loader = vi
      .fn()
      .mockResolvedValue([{ field: 'a', label: 'A', type: 'text' }]);
    const bf = useBusinessFields(makePageSchema(), {
      getComponentConfig: () => undefined,
      loader,
    });

    await bf.load('单据B');
    expect(bf.fields.value).toEqual([]);
    expect(bf.issues.value[0]?.message).toContain('不存在组件');
  });

  it('加载失败进入 error，retry 可恢复', async () => {
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error('网络错误'))
      .mockResolvedValueOnce([{ field: 'a', label: 'A', type: 'text' }]);
    const bf = useBusinessFields(makePageSchema(), {
      getComponentConfig,
      loader,
    });

    expect(await bf.load('单据C')).toBe(false);
    expect(bf.status.value).toBe('error');
    expect(bf.error.value).toBe('网络错误');

    expect(await bf.retry()).toBe(true);
    expect(bf.status.value).toBe('ready');
  });

  it('切换业务对象时丢弃过期响应', async () => {
    let resolveA: (value: any) => void = () => {};
    const loader = vi.fn((businessObject: string) => {
      if (businessObject === 'A') {
        return new Promise((resolve) => {
          resolveA = resolve;
        });
      }
      return Promise.resolve([{ field: 'fromB', label: 'B', type: 'text' }]);
    });
    const bf = useBusinessFields(makePageSchema(), {
      getComponentConfig,
      loader: loader as any,
    });

    const first = bf.load('A');
    const second = bf.load('B');
    await second;

    resolveA([{ field: 'fromA', label: 'A', type: 'text' }]);
    expect(await first).toBe(false);
    expect(bf.fields.value.map((item) => item.field)).toEqual(['fromB']);
    expect(bf.businessObject.value).toBe('B');
  });

  it('switchTo：同一对象直接返回，不同对象重新加载', async () => {
    const loader = vi
      .fn()
      .mockResolvedValue([{ field: 'a', label: 'A', type: 'text' }]);
    const bf = useBusinessFields(makePageSchema(), {
      getComponentConfig,
      loader,
    });

    await bf.load('单据D');
    expect(await bf.switchTo('单据D')).toBe(true);
    expect(loader).toHaveBeenCalledTimes(1);

    expect(await bf.switchTo('单据E')).toBe(true);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('未提供 loader 时进入 empty 并提示', async () => {
    const bf = useBusinessFields(makePageSchema(), {});

    expect(await bf.load('单据F')).toBe(false);
    expect(bf.status.value).toBe('empty');
    expect(bf.error.value).toContain('businessFieldLoader');
  });

  it('buildNode：按映射类型构造节点并过滤预设 props', () => {
    const bf = useBusinessFields(makePageSchema(), { getComponentConfig });

    const node = bf.buildNode(
      { field: '金额', label: '金额', scale: 2, type: 'money' },
      'root',
    );
    expect(node?.id).toBe('root_金额');
    expect(node?.field).toBe('金额');
    expect(node?.props).toEqual({ placeholder: '请输入', precision: 2 });

    expect(bf.buildNode({ field: 'x', label: 'X', type: 'list' }, 'root')).toBe(
      null,
    );
  });

  it('作用域解析与字段已放置判断', () => {
    const bf = useBusinessFields(makePageSchema(), {});

    expect(bf.resolveScope('in_1')?.id).toBe('root');
    expect(bf.isFieldPlaced('placed', 'in_1')).toBe(true);
    expect(bf.isFieldPlaced('other', 'in_1')).toBe(false);
    expect(bf.getPlacedFields('in_1')).toEqual(['placed']);
  });

  it('checkField：重复字段与不支持的类型返回失败原因', () => {
    const bf = useBusinessFields(makePageSchema(), { getComponentConfig });

    const duplicated = bf.checkField(
      { field: 'placed', label: '已存在', type: 'text' },
      'root',
    );
    expect(duplicated.ok).toBe(false);
    expect(duplicated.message).toContain('已存在');

    const unsupported = bf.checkField(
      { field: 'listField', label: '列表', type: 'list' },
      'root',
    );
    expect(unsupported.ok).toBe(false);
  });

  it('checkField：通过时返回按作用域构造的节点', () => {
    const bf = useBusinessFields(makePageSchema(), { getComponentConfig });

    const result = bf.checkField(
      { field: '新字段', label: '新字段', type: 'text' },
      'root',
    );
    expect(result.ok).toBe(true);
    expect(result.node?.id).toBe('root_新字段');
    expect(result.node?.field).toBe('新字段');
  });
});

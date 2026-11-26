import { describe, expect, it } from 'vitest';

import {
  buildFieldSchema,
  collectComponentRefIds,
  getFieldPresets,
  hasFieldInScope,
  mapPropertyType,
  resolveScopeNode,
  rewriteComponentRefs,
  validateControlledPage,
} from '../../';

function makeNumberBase() {
  return {
    field: 'number',
    input: true,
    label: '数字输入框',
    props: { placeholder: '请输入' },
    type: 'number',
  };
}

describe('mapPropertyType 函数测试', () => {
  it('按映射表转成组件层 type', () => {
    expect(mapPropertyType('text')).toBe('input');
    expect(mapPropertyType('number')).toBe('number');
    expect(mapPropertyType('money')).toBe('number');
    expect(mapPropertyType('date')).toBe('date');
    expect(mapPropertyType('boolean')).toBe('switch');
    expect(mapPropertyType('ref')).toBe('select');
  });

  it('list 暂不支持，返回 null', () => {
    expect(mapPropertyType('list')).toBe(null);
  });
});

describe('getFieldPresets 函数测试', () => {
  it('money / number 在给了 scale 时写入 precision', () => {
    expect(
      getFieldPresets({ field: 'a', label: 'A', scale: 2, type: 'money' }),
    ).toEqual({ precision: 2 });
    expect(getFieldPresets({ field: 'a', label: 'A', type: 'money' })).toEqual(
      {},
    );
  });

  it('ref 写入 entity，unit 不写入 props', () => {
    expect(
      getFieldPresets({
        entity: 'organization.Staff',
        field: 'a',
        label: 'A',
        type: 'ref',
        unit: '元',
      }),
    ).toEqual({ entity: 'organization.Staff' });
  });
});

describe('resolveScopeNode 函数测试', () => {
  const schemas: any[] = [
    {
      children: [
        {
          children: [
            {
              children: [
                { field: 'a', id: 'in_1', input: true, type: 'input' },
              ],
              id: 'row_1',
              type: 'row',
            },
          ],
          id: 'form_1',
          type: 'form',
        },
        { field: 'c', id: 'in_3', input: true, type: 'input' },
      ],
      id: 'root',
      type: 'page',
    },
  ];

  it('返回最近的 form 祖先', () => {
    expect(resolveScopeNode(schemas, 'in_1')?.id).toBe('form_1');
  });

  it('没有 form 祖先时回退根节点', () => {
    expect(resolveScopeNode(schemas, 'in_3')?.id).toBe('root');
  });

  it('不传 nodeId 时返回根节点，空页面返回 null', () => {
    expect(resolveScopeNode(schemas)?.id).toBe('root');
    expect(resolveScopeNode([], 'x')).toBe(null);
  });
});

describe('hasFieldInScope 函数测试', () => {
  const scope: any = {
    children: [
      { field: 'a', id: 'in_1', input: true, type: 'input' },
      { field: 'legacy', id: 'in_2', input: true, type: 'input' },
      { children: [], field: 'layout', id: 'row_1', input: false, type: 'row' },
    ],
    id: 'form_1',
    type: 'form',
  };

  it('命中同 field 的输入节点（含旧自由字段）', () => {
    expect(hasFieldInScope(scope, 'a')).toBe(true);
    expect(hasFieldInScope(scope, 'legacy')).toBe(true);
  });

  it('非输入节点不计入，作用域为空返回 false', () => {
    expect(hasFieldInScope(scope, 'layout')).toBe(false);
    expect(hasFieldInScope(null, 'a')).toBe(false);
  });
});

describe('buildFieldSchema 函数测试', () => {
  it('生成 id / field / label / 预设属性，且不修改 base', () => {
    const base = makeNumberBase();
    const node = buildFieldSchema({
      base,
      meta: {
        field: '报销金额',
        label: '报销金额',
        scale: 2,
        type: 'money',
        unit: '元',
      },
      scopeId: 'root',
    });

    expect(node?.id).toBe('root_报销金额');
    expect(node?.field).toBe('报销金额');
    expect(node?.label).toBe('报销金额');
    expect(node?.props).toEqual({ placeholder: '请输入', precision: 2 });
    expect(base.props).toEqual({ placeholder: '请输入' });
  });

  it('预设按白名单过滤，entity 例外保留', () => {
    const node = buildFieldSchema({
      allowedProps: ['precision'],
      base: {
        field: 'select',
        input: true,
        label: '选择框',
        props: {},
        type: 'select',
      },
      meta: {
        entity: 'organization.Staff',
        field: 'submitter',
        label: '提交人',
        type: 'ref',
      },
      scopeId: 'form_1',
    });

    expect(node?.props).toEqual({ entity: 'organization.Staff' });
    expect(node?.id).toBe('form_1_submitter');
  });

  it('缺少 scopeId / field / label 时返回 null', () => {
    expect(
      buildFieldSchema({
        base: makeNumberBase(),
        meta: { field: 'a', label: 'A', type: 'text' },
        scopeId: '',
      }),
    ).toBe(null);
  });
});

describe('rewriteComponentRefs / collectComponentRefIds 函数测试', () => {
  function makeSchemas() {
    return [
      {
        children: [
          {
            id: 'child',
            on: {
              click: [
                { componentId: 'a', methodName: 'focus', type: 'component' },
              ],
            },
            type: 'input',
          },
        ],
        id: 'root',
        on: {
          change: [
            { componentId: 'a', methodName: 'blur', type: 'component' },
            { componentId: 'c', methodName: 'focus', type: 'component' },
          ],
        },
        type: 'page',
      },
    ] as any[];
  }

  it('改写所有指向旧 id 的引用并返回数量', () => {
    const schemas = makeSchemas();
    const count = rewriteComponentRefs(schemas, 'a', 'b');

    expect(count).toBe(2);
    expect(collectComponentRefIds(schemas).sort()).toEqual(['b', 'c']);
  });

  it('oldId 与 newId 相同时不处理', () => {
    const schemas = makeSchemas();
    expect(rewriteComponentRefs(schemas, 'a', 'a')).toBe(0);
    expect(collectComponentRefIds(schemas).sort()).toEqual(['a', 'c']);
  });
});

describe('validateControlledPage 函数测试', () => {
  function makePage(children: any[]): any[] {
    return [{ children, id: 'root', type: 'form' }];
  }

  it('合法页面没有问题', () => {
    expect(
      validateControlledPage(
        makePage([
          { field: 'a', id: 'root_a', input: true, type: 'input' },
          { field: 'b', id: 'root_b', input: true, type: 'input' },
        ]),
      ),
    ).toEqual([]);
  });

  it('同作用域字段重复与非法字符集会被报告', () => {
    const issues = validateControlledPage(
      makePage([
        { field: 'a', id: 'root_a', input: true, type: 'input' },
        { field: 'a', id: 'root_a2', input: true, type: 'input' },
        { field: 'bad-name', id: 'root_b', input: true, type: 'input' },
      ]),
    );

    expect(issues.some((item) => item.type === 'duplicateField')).toBe(true);
    expect(issues.some((item) => item.type === 'invalidName')).toBe(true);
  });

  it('重复 id 会被报告', () => {
    const issues = validateControlledPage(
      makePage([
        { field: 'a', id: 'root_a', input: true, type: 'input' },
        { field: 'b', id: 'root_a', input: true, type: 'input' },
      ]),
    );

    expect(issues.some((item) => item.type === 'duplicateId')).toBe(true);
  });
});

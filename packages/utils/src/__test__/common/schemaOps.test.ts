import { pluginManager } from '@nada-designer/manager';

import { describe, expect, it } from 'vitest';

import {
  generateNewSchema,
  getFormFields,
  migrateComponentProps,
  reorganizeSchemasForTableView,
} from '../../';

/**
 * schema 算法契约测试（data.ts）
 *
 * 这一层是 utils 里体量最大、也是最容易被后续解耦改动影响的部分：
 * - generateNewSchema / reorganizeSchemasForTableView 目前直接读取全局 pluginManager 的组件配置
 * - 未来若改成「配置由调用方注入」，这些断言必须保持不变
 */

function registerComponent(
  type: string,
  extra: Record<string, any> = {},
): void {
  pluginManager.component.register({
    component: { render: () => null },
    config: { action: [], attribute: [] },
    defaultSchema: { input: true, label: type, props: {}, type },
    ...extra,
  } as any);
}

describe('getFormFields', () => {
  it('返回指定表单下所有输入组件的 field', () => {
    const schemas: any = [
      {
        children: [
          {
            children: [
              { field: 'a', id: 'i1', input: true, type: 'input' },
              { field: 'b', id: 'i2', input: true, type: 'number' },
              { id: 'i3', type: 'divider' },
            ],
            id: 'f1',
            props: { name: 'default' },
            type: 'form',
          },
        ],
        id: 'root',
        type: 'page',
      },
    ];

    const fields = getFormFields(schemas, 'default').filter(Boolean).sort();
    expect(fields).toEqual(['a', 'b']);
  });
});

describe('generateNewSchema', () => {
  it('复制节点时生成新的 id，并把 field 同步为新 id', () => {
    const result = generateNewSchema({
      field: 'old_field',
      id: 'input_1234',
      input: true,
      type: 'plainInput',
    } as any);

    expect(result.id).toBeDefined();
    expect(result.id).not.toBe('input_1234');
    expect(result.field).toBe(result.id);
  });

  it('组件配置声明 fixedField 时保留原 field', () => {
    registerComponent('fixedInput', { editConstraints: { fixedField: true } });

    const result = generateNewSchema({
      field: 'keep_me',
      id: 'fixedInput_1234',
      input: true,
      type: 'fixedInput',
    } as any);

    expect(result.field).toBe('keep_me');
    expect(result.id).not.toBe('fixedInput_1234');
  });

  it('不会生成与已存在节点重复的 id', () => {
    const existing: any = [
      { children: [], id: 'input_9999', type: 'plainInput' },
    ];
    const result = generateNewSchema(
      { id: 'input_9999', input: true, type: 'plainInput' } as any,
      existing,
    );

    expect(result.id).not.toBe('input_9999');
  });
});

describe('migrateComponentProps', () => {
  it('把 componentProps 迁移为 props，并删除旧的画布 16px padding', () => {
    const pageSchema: any = {
      schemas: [
        {
          children: [
            {
              componentProps: { placeholder: '旧属性' },
              id: 'a',
              type: 'input',
            },
          ],
          id: 'root',
          props: { style: { padding: '16px' } },
          type: 'page',
        },
      ],
    };

    migrateComponentProps(pageSchema);

    expect(pageSchema.schemas[0].children[0].props).toEqual({
      placeholder: '旧属性',
    });
    expect(pageSchema.schemas[0].children[0].componentProps).toBeUndefined();
    expect(pageSchema.schemas[0].props.style.padding).toBeUndefined();
  });
});

describe('reorganizeSchemasForTableView', () => {
  it('把子表组件挪到末尾，并给全宽输入组件打上类名', () => {
    registerComponent('tvInput', { isSubTable: false });
    registerComponent('tvSubTable', { isSubTable: true });

    const pageSchema: any = {
      schemas: [
        {
          children: [
            {
              children: [
                { children: [], id: 's1', type: 'tvSubTable' },
                { field: 'a', id: 'i1', input: true, type: 'tvInput' },
                { field: 'b', id: 'i2', input: true, type: 'tvInput' },
              ],
              id: 'f1',
              type: 'form',
            },
          ],
          id: 'root',
          type: 'page',
        },
      ],
    };

    reorganizeSchemasForTableView(pageSchema, ['tvInput']);

    const form = pageSchema.schemas[0].children[0];
    expect(form.children.map((item: any) => item.id)).toEqual([
      'i1',
      'i2',
      's1',
    ]);
    expect(form.children[0].class).toBe('ep-full-width');
    expect(form.children[1].class).toBe('ep-full-width');
    expect(form.children[2].class).toContain('ep-sub-table');
  });
});

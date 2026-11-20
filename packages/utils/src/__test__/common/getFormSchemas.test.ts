import { describe, expect, it } from 'vitest';

import { getFormSchemas } from '../../';

describe('getFormSchemas 函数测试', () => {
  const schemas = [
    {
      props: {
        
      },
      id: 'root',
      label: '页面',
      type: 'page',
      children: [
        {
          label: '表单',
          type: 'form',
          props: {
            labelCol: {
              span: 5,
            },
            labelLayout: 'fixed',
            labelWidth: '100px',
            name: 'default',
            wrapperCol: {
              span: 19,
            },
          },
          children: [
            {
              label: '输入框',
              type: 'input',
              field: 'input_ttuyobv9',
              input: true,
              props: {
                placeholder: '请输入',
              },
              id: 'input_ttuyobv9',
            },
            {
              label: '数字输入框',
              type: 'number',
              field: 'number_m7ogpi26',
              input: true,
              props: {
                placeholder: '请输入',
                style: {
                  width: '100%',
                },
              },
              id: 'number_m7ogpi26',
            },
          ],
          id: 'form_oyvwbf00',
        },
      ],
    },
  ];

  it('应该返回指定表单名称中的输入字段', () => {
    const result = getFormSchemas(schemas, 'default');
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'input_ttuyobv9' }),
        expect.objectContaining({ id: 'number_m7ogpi26' }),
      ]),
    );
  });

  it('应该使用默认的表单名称', () => {
    const result = getFormSchemas(schemas);
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'input_ttuyobv9' }),
        expect.objectContaining({ id: 'number_m7ogpi26' }),
      ]),
    );
  });

  it('应该返回空数组当表单没有输入字段', () => {
    const emptySchemas = [
      {
        id: 'root',
        label: '页面',
        type: 'page',
        children: [
          {
            label: '表单',
            type: 'form',
            props: {
              labelCol: {
                span: 5,
              },
              labelLayout: 'fixed',
              labelWidth: '100px',
              name: 'emptyForm',
              wrapperCol: {
                span: 19,
              },
            },
            children: [
              {
                label: '非输入框',
                type: 'text',
                props: {
                  placeholder: '不是输入框',
                },
                id: 'text_field',
              },
            ],
            id: 'form_empty',
          },
        ],
      },
    ];

    const result = getFormSchemas(emptySchemas, 'emptyForm');
    expect(result).toHaveLength(0);
  });
});

describe('getFormSchemas 表单匹配（回归）', () => {
  const twoForms = [
    {
      children: [
        {
          children: [{ field: 'a', id: 'inputA', input: true, type: 'input' }],
          id: 'formA',
          props: { name: 'formA' },
          type: 'form',
        },
        {
          children: [{ field: 'b', id: 'inputB', input: true, type: 'input' }],
          id: 'formB',
          props: { name: 'formB' },
          type: 'form',
        },
      ],
      id: 'root',
      label: '页面',
      type: 'page',
    },
  ];

  it('应按 formName 匹配目标表单，而不是只要 props.name 存在就命中', () => {
    const result = getFormSchemas(twoForms as never, 'formB');
    expect(result.map((item) => item.id)).toEqual(['inputB']);
  });

  it('表单没有 props.name 时应回退到节点 name 字段', () => {
    const schemasWithoutPropsName = [
      {
        children: [
          {
            children: [{ field: 'x', id: 'inputX', input: true, type: 'input' }],
            id: 'formX',
            name: 'formX',
            type: 'form',
          },
        ],
        id: 'root',
        label: '页面',
        type: 'page',
      },
    ];

    const result = getFormSchemas(schemasWithoutPropsName as never, 'formX');
    expect(result.map((item) => item.id)).toEqual(['inputX']);
  });
});
import type { ComponentSchema, PageSchema } from '@nada-designer/types';

/** 快速创建一个单表单页面 schema */
export function createForm(
  children: ComponentSchema[],
  formProps: Record<string, any> = {},
): PageSchema {
  return {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        children,
        id: 'root',
        label: '表单',
        props: {
          labelLayout: 'fixed',
          labelWidth: 120,
          name: 'default',
          ...formProps,
        },
        type: 'form',
      },
    ],
    script: '',
  };
}

/** 快速创建输入框节点 */
export function input(
  field: string,
  label: string,
  extra: Record<string, any> = {},
): ComponentSchema {
  return {
    field,
    id: field,
    input: true,
    label,
    props: { placeholder: `请输入${label}` },
    type: 'input',
    ...extra,
  };
}

/** 快速创建数字输入节点 */
export function number(
  field: string,
  label: string,
  extra: Record<string, any> = {},
): ComponentSchema {
  return {
    field,
    id: field,
    input: true,
    label,
    props: {},
    type: 'number',
    ...extra,
  };
}

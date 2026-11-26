import type { Property } from '@nada-designer/types';

/**
 * 演示用业务字段元数据
 * @description 模拟后端 propertySet 返回；所有设计器示例统一使用该清单
 */
export const demoProperties: Property[] = [
  { field: 'u_姓名', label: '姓名', type: 'text' },
  { field: 'u_年龄', label: '年龄', scale: 0, type: 'number' },
  {
    entity: 'basedata.Dimension.性别',
    field: 'u_性别',
    label: '性别',
    type: 'ref',
  },
  { field: 'u_生日', label: '生日', type: 'date' },
  { field: 'u_是否含税', label: '是否含税', type: 'boolean' },
  { field: 'u_个人简介', label: '个人简介', type: 'text' },
  { field: 'u_金额', label: '金额', scale: 2, type: 'money' },
  { field: 'customCheck', label: '自定义校验组件', type: 'text' },
];

/**
 * 模拟后端加载业务字段元数据
 * @description 同步返回，避免示例中元数据与 setData 的时序竞争
 * @param modelId 业务对象模型 id
 */
export function businessFieldLoader(modelId: string): Property[] {
  return modelId === '1001' ? demoProperties : [];
}

/** 演示用业务对象模型 id */
export const DEMO_MODEL_ID = '1001';

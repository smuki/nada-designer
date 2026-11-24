import type { FieldMeta } from '@nada-designer/types';

/**
 * 受控模式演示用业务字段元数据
 * @description 模拟后端返回：一个业务对象「销售单据」，覆盖 text/number/money/date/boolean/ref
 */
export const salesOrderFields: FieldMeta[] = [
  { field: 'u_销售单号', label: '销售单号', type: 'text' },
  { field: 'u_销售日期', label: '销售日期', type: 'date' },
  { field: 'u_备注', label: '备注', type: 'text' },
  { field: 'u_客户名称', label: '客户名称', type: 'text' },
  { field: 'u_销售数量', label: '销售数量', type: 'number' },
  {
    field: 'u_销售金额',
    label: '销售金额',
    scale: 2,
    type: 'money',
    unit: '元',
  },
  { field: 'u_是否含税', label: '是否含税', type: 'boolean' },
  {
    entity: 'organization.Staff',
    field: 'u_业务员',
    label: '业务员',
    type: 'ref',
  },
  // active: false 的字段不进入面板（用于验证过滤）
  { active: false, field: 'u_已废弃字段', label: '已废弃字段', type: 'text' },
];

/**
 * 模拟后端加载业务字段元数据
 * @param modelId 业务对象模型 id
 */
export function businessFieldLoader(modelId: string): Promise<FieldMeta[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modelId === '1001' ? salesOrderFields : []);
    }, 300);
  });
}

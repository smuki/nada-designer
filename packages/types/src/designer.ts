import { PageSchema } from '@nada-designer/types';

export interface TableColumn {
  columnName: string;
  columnRemark: string;
}
export interface TableMeta {
  primaryKey: string;
  tableColumn: TableColumn[];
  tableName: string;
  tableRemark: string;
  tableType: string;
}

/**
 * 业务字段数据类型（受控模式元数据协议）
 */
export type FieldDataType =
  | 'boolean'
  | 'date'
  | 'list'
  | 'money'
  | 'number'
  | 'ref'
  | 'text';

/**
 * 业务对象字段元数据
 * @description 对应 specs/controlled-mode.md §6.3；v1 不使用 group 分组
 */
export interface FieldMeta {
  /** 是否启用，缺省视为 true */
  active?: boolean;
  /** ref 的数据源实体标识，如 organization.Staff */
  entity?: string;
  /** 业务字段唯一标识（业务对象内唯一），同时是 formData key */
  field: string;
  /** 面板分组；v1 不使用 */
  group?: string;
  /** 显示名称 */
  label: string;
  /** 数值精度（小数位），number / money 使用 */
  scale?: number;
  /** 数据类型 */
  type: FieldDataType;
  /** 单位（%、张、元…）；v1 不写入节点 props */
  unit?: string;
}

export interface DesignerProps {
  /** 业务字段元数据 loader（受控模式使用；可直接返回静态数组，便于测试/离线） */
  businessFieldLoader?: (modelId: string) => FieldMeta[] | Promise<FieldMeta[]>;
  canvasMode?: 'desktop' | 'mobile' | 'tablet';
  canvasPadding?: number | string;
  defaultSchema?: PageSchema;
  /** 设计模式：free 自由（默认）/ controlled 受控 */
  designMode?: 'controlled' | 'free';
  disabledZoom?: boolean;
  draggable?: boolean;
  formMode?: boolean;
  hiddenHeader?: boolean;
  hidePreviewConfirm?: boolean;
  lockDefaultSchemaEdit?: boolean;
  /** 业务对象模型 id（主键；字符串传递避免大整数精度丢失），受控模式必填 */
  modelId?: string;
  showHiddenItems?: boolean;
  sourceCodeReadOnly?: boolean;
  tableJson?: TableMeta[];
  title?: string;
}

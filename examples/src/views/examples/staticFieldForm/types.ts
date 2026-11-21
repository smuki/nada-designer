/**
 * 静态字段表单示例的类型定义
 * 数据由 specs/mocks/gen_static_form_fixture.py 生成
 */
import type { PageSchema } from '@nada-designer/types';

export interface StaticFormExample {
  /** 对应易快报模板的原始 id */
  templateId: string;
  /** 路由/菜单唯一 key */
  key: string;
  /** 模板名（菜单标题） */
  name: string;
  /** 模板所属分组 */
  groupName: string;
  /** 单据类型：expense / requisition / loan / payment / custom */
  type: string;
  /** 模板是否启用 */
  active: boolean;
  /** 模板控件总数 */
  componentCount: number;
  /** 可渲染为静态字段的控件数 */
  mappedCount: number;
  /** 说明 */
  description: string;
  /** 按模板显示（模板中隐藏的字段不显示） */
  visiblePageSchema: PageSchema;
  /** 显示全部静态字段 */
  allPageSchema: PageSchema;
}

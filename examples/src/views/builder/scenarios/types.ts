import type { FieldStates, PageSchema } from '@nada-designer/types';

/**
 * 场景夹具（Scenario Fixture）
 *
 * 新增一个生成器测试场景 = 在 fixtures/ 目录下新增一个文件并 default 导出本结构，
 * 路由、菜单、播放器页面都会自动识别，不需要改其它代码。
 */
export interface ScenarioFixture {
  /** 表单数据（可选，用于验证数据回显） */
  formData?: Record<string, any>;
  /** 字段状态（可选，用于验证权限/禁用/隐藏） */
  fieldStates?: FieldStates;
  /** 页面 schema */
  pageSchema: PageSchema;
  /** 期望的 getData() 结果（供后续自动化测试断言，播放器里也会对比展示） */
  expectData?: Record<string, any>;
  /** 唯一标识，一般等于文件名（由 registry 自动补全，可不写） */
  key?: string;
  /** 显示名称（菜单标题） */
  name: string;
  /** 是否以只读模式渲染 */
  readonly?: boolean;
  /** 场景说明 */
  description?: string;
}

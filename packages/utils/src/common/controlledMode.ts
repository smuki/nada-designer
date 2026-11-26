/**
 * 受控模式允许放置的无字段组件白名单
 * @description 业务单据设计器只允许两类放置物：业务字段（来自元数据）与无字段组件。
 * 无字段组件仅限布局 / 展示 / 动作，输入类组件只能由业务字段映射产生。
 */
export const CONTROLLED_COMPONENT_TYPES = [
  // 布局
  'card',
  'form',
  'row',
  'tabs',
  // 展示
  'divider',
  'text-block',
  // 动作
  'button',
] as const;

export type ControlledComponentType =
  (typeof CONTROLLED_COMPONENT_TYPES)[number];

const CONTROLLED_COMPONENT_TYPE_SET: ReadonlySet<string> = new Set(
  CONTROLLED_COMPONENT_TYPES,
);

/**
 * 是否为受控模式允许的无字段组件
 * @param type 组件类型
 */
export function isControlledComponentType(type?: string): boolean {
  return typeof type === 'string' && CONTROLLED_COMPONENT_TYPE_SET.has(type);
}

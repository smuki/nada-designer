import type { ComponentConfigModel } from '@nada-designer/types';

import { defineComponent, h } from 'vue';

import { pluginManager } from '@nada-designer/manager';

/**
 * 场景演示组件
 *
 * 有些场景（子表、tableView）需要一个带特殊配置（isSubTable）的组件，
 * 这里在播放器渲染前临时注册，避免污染正式示例。
 */

const ScenarioSubTable = defineComponent({
  name: 'ScenarioSubTable',
  props: {
    componentSchema: { default: () => ({}), type: Object },
  },
  setup(props) {
    return () => {
      const schema: any = props.componentSchema;
      const rowCount = schema?.props?.rowCount ?? 3;
      const title = schema?.label ?? '演示子表';
      return h(
        'div',
        {
          class: 'scenario-demo-subtable',
          style:
            'padding:8px 12px;border:1px dashed var(--ep-border,#d1d5db);border-radius:6px;color:var(--ep-text-helper,#6b7280);font-size:12px',
        },
        `${title}：模拟 ${rowCount} 行子表数据（仅用于演示 isSubTable / tableView 场景）`,
      );
    };
  },
});

export const SCENARIO_SUBTABLE_TYPE = 'scenario-subtable';

/** 注册场景专用组件（幂等） */
export function registerScenarioDemoComponents(): void {
  if (pluginManager.component.get(SCENARIO_SUBTABLE_TYPE)) return;

  const config: ComponentConfigModel = {
    component: ScenarioSubTable,
    config: {
      attribute: [],
    },
    defaultSchema: {
      children: [],
      label: '演示子表',
      props: { rowCount: 3 },
      type: SCENARIO_SUBTABLE_TYPE,
    },
    groupName: '场景演示',
    isSubTable: true,
  } as any;

  pluginManager.component.register(config);
}

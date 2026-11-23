import type { PluginManager } from '@nada-designer/manager';

/**
 * 初始化活动栏，向插件管理器注册活动栏项。
 *
 * @param {PluginManager} pluginManager - 插件管理器实例，用于注册活动栏项。
 * @returns {void}
 */
export function setupActivitybar(pluginManager: PluginManager): void {
  pluginManager.panel.registerActivitybar({
    component: async () => await import('./componentView/index.vue'),
    icon: 'icon--nada--extension-outline',
    id: 'component_view',
    sort: 100,
    title: '组件',
  });

  // 属性面板：不显示图标，选中组件后由活动栏自动切换展示（合并样式/事件底部页签）
  pluginManager.panel.registerActivitybar({
    component: async () => await import('../rightSidebars/inspector.vue'),
    icon: 'icon--nada--list-alt-outline-rounded',
    id: 'attribute_view',
    sort: 150,
    title: '属性',
    visible: false,
  });

  pluginManager.panel.registerActivitybar({
    component: async () => await import('./sourceCode/index.vue'),
    icon: 'icon--nada--sdk-outline-rounded',
    id: 'sound_code_view',
    sort: 200,
    title: '源码',
  });

  pluginManager.panel.registerActivitybar({
    component: async () => await import('./outline/outline.vue'),
    icon: 'icon--nada--account-tree-outline-rounded',
    id: 'outline_view',
    sort: 300,
    title: '大纲',
  });
}

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

  // 属性 / 样式 / 事件：从右侧栏移到左侧活动栏（所有模式统一）
  pluginManager.panel.registerActivitybar({
    component: async () =>
      await import('../rightSidebars/attribute/attribute.vue'),
    icon: 'icon--nada--list-alt-outline-rounded',
    id: 'attribute_view',
    sort: 150,
    title: '属性',
  });

  pluginManager.panel.registerActivitybar({
    component: async () => await import('../rightSidebars/style/style.vue'),
    icon: 'icon--nada--palette-outline',
    id: 'style_view',
    sort: 160,
    title: '样式',
  });

  pluginManager.panel.registerActivitybar({
    component: async () => await import('../rightSidebars/event/event.vue'),
    icon: 'icon--nada--dialogs-outline-rounded',
    id: 'event_view',
    sort: 170,
    title: '事件',
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

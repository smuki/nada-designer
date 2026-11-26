<script lang="ts" setup>
import type { ActivitybarModel } from '@nada-designer/types';

import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

import { EpTooltip, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';

import ComponentPicker from '../editContainer/componentPicker.vue';

defineOptions({
  name: 'EActivityBar',
});
const designer = useDesignerContext();

/** 布局组件入口（受控 / 自由模式通用，合成图标项） */
const LAYOUT_ENTRY = {
  component: null,
  icon: 'icon--nada--layout-tabs',
  id: 'layout_view',
  sort: 90,
  title: '布局',
  visible: true,
} as unknown as ActivitybarModel;

/** 侧栏图标项：布局 + 输入/字段 + 源码 + 大纲 */
const activityBars = computed(() => {
  const items = pluginManager.panel.activityBars.value
    .filter((item) => item.visible)
    .filter((item) => item.id !== 'component_view')
    .sort((a, b) => {
      return a.sort! - b.sort!;
    });

  items.push(LAYOUT_ENTRY, {
    component: null,
    icon: 'icon--nada--extension-outline',
    id: 'business_field_view',
    sort: 100,
    title: '添加字段',
    visible: true,
  } as unknown as ActivitybarModel);

  return items.sort((a, b) => {
    return a.sort! - b.sort!;
  });
});

/** 属性面板（无图标，常驻展示） */
const inspectorPanel = computed(() => {
  return pluginManager.panel.activityBars.value.find(
    (item) => item.id === 'attribute_view',
  );
});

const activityBarCheckedIndex = ref<null | number>(0);
const sidebarComponent = shallowRef<any>(
  activityBars.value[0]?.component ?? null,
);

/** 是否展示属性面板（常驻：默认显示页面属性；选中组件后显示该组件属性） */
const showInspector = ref(true);

/** 组件选择弹出框：field 业务字段 / input 输入类 / layout 布局类 */
const pickerMode = ref<'field' | 'layout' | null>(null);

// 选中动作后展示属性面板；同时关闭组件弹出框
watch(
  () => designer.selectionVersion.value,
  () => {
    showInspector.value = true;
    pickerMode.value = null;
  },
  { immediate: true },
);

/** 实际渲染的面板 */
const renderedComponent = computed(() => {
  if (showInspector.value && inspectorPanel.value) {
    return inspectorPanel.value.component;
  }
  return sidebarComponent.value;
});

/**
 * 图标是否处于激活态
 * @param item 图标项
 * @param index 索引
 */
function isItemActive(item: ActivitybarModel, index: number): boolean {
  if (item.id === 'layout_view') return pickerMode.value === 'layout';
  if (item.id === 'business_field_view') return pickerMode.value === 'field';
  return (
    !showInspector.value &&
    pickerMode.value === null &&
    activityBarCheckedIndex.value === index
  );
}

function handleClick(item: ActivitybarModel, index: number) {
  // 布局组件入口
  if (item.id === 'layout_view') {
    pickerMode.value = pickerMode.value === 'layout' ? null : 'layout';
    return;
  }

  // 受控模式：添加字段入口（复用同一弹出框，仅内容不同）
  if (item.id === 'business_field_view') {
    pickerMode.value = pickerMode.value === 'field' ? null : 'field';
    return;
  }

  pickerMode.value = null;

  // 从属性面板切回图标面板（不触发收起逻辑）
  if (showInspector.value) {
    showInspector.value = false;
    sidebarComponent.value = item.component;
    activityBarCheckedIndex.value = index;
    return;
  }

  if (activityBarCheckedIndex.value === index) {
    activityBarCheckedIndex.value = null;
    return false;
  }
  sidebarComponent.value = item.component;
  activityBarCheckedIndex.value = index;
}

/** UI 库下拉浮层的选择器（浮层多 teleport 到 body，需要排除，否则选类型会误关弹层） */
const SELECT_POPUP_SELECTOR = [
  '.ant-select-dropdown',
  '.el-popper',
  '.el-select__popper',
  '.n-base-select-menu',
  '.n-select-menu',
  '.n-popover',
].join(',');

/**
 * 点击弹出框外部时收起
 * @param event 鼠标事件
 */
function handleDocumentMousedown(event: MouseEvent) {
  if (!pickerMode.value) return;
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (
    target.closest('.ep-component-picker') ||
    target.closest(SELECT_POPUP_SELECTOR) ||
    target.closest('[data-activity-id="layout_view"]') ||
    target.closest('[data-activity-id="business_field_view"]')
  ) {
    return;
  }
  pickerMode.value = null;
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMousedown);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleDocumentMousedown);
});
</script>
<template>
  <div class="relative flex">
    <div class="ep-action-bar">
      <ul class="ep-actions-container flex-center flex-col gap-1">
        <EpTooltip
          placement="right"
          :content="item.title"
          v-for="(item, index) in activityBars"
          :key="item.id"
        >
          <li
            class="ep-action-item flex-center h-10 w-10 text-[20px]"
            :class="{ checked: isItemActive(item, index) }"
            :data-activity-id="item.id"
            @click="handleClick(item, index)"
          >
            <NadaIcon :name="item.icon" />
          </li>
        </EpTooltip>
      </ul>
    </div>
    <div
      class="ep-left-sidebar"
      :class="{ hide: !showInspector && activityBarCheckedIndex === null }"
    >
      <div class="ep-sidebar-container">
        <component :is="renderedComponent" />
      </div>
    </div>
    <ComponentPicker
      v-if="pickerMode"
      :mode="pickerMode"
      @close="pickerMode = null"
    />
  </div>
</template>

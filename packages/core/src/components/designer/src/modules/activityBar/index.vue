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
const isControlled = designer.designMode === 'controlled';

/** 侧栏图标项（隐藏 visible=false 的属性面板） */
const activityBars = computed(() => {
  return pluginManager.panel.activityBars.value
    .filter(
      (item) => item.visible && !(isControlled && item.id === 'component_view'),
    )
    .sort((a, b) => {
      return a.sort! - b.sort!;
    });
});

/** 属性面板（无图标，选中组件后自动切换展示） */
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

/** 自由模式：组件选择弹出框 */
const pickerOpen = ref(false);

// 选中动作后展示属性面板；同时关闭组件弹出框
watch(
  () => designer.selectionVersion.value,
  () => {
    showInspector.value = true;
    pickerOpen.value = false;
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

function handleClick(item: ActivitybarModel, index: number) {
  // 自由模式：组件面板改为弹出框，不占用左侧栏
  if (item.id === 'component_view') {
    pickerOpen.value = !pickerOpen.value;
    return;
  }

  pickerOpen.value = false;

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

/**
 * 点击组件弹出框外部时收起
 * @param event 鼠标事件
 */
function handleDocumentMousedown(event: MouseEvent) {
  if (!pickerOpen.value) return;
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (
    target.closest('.ep-component-picker') ||
    target.closest('[data-activity-id="component_view"]')
  ) {
    return;
  }
  pickerOpen.value = false;
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
          :key="index"
        >
          <li
            class="ep-action-item flex-center h-8 w-8 text-[16px]"
            :class="{
              checked:
                !showInspector &&
                !pickerOpen &&
                activityBarCheckedIndex === index,
            }"
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
    <ComponentPicker v-if="pickerOpen" @close="pickerOpen = false" />
  </div>
</template>

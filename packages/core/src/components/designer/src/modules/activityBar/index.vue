<script lang="ts" setup>
import type { ActivitybarModel } from '@nada-designer/types';

import { computed, ref, shallowRef, watch } from 'vue';

import { EpTooltip, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';

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

// 任意选中动作（含点击画布空白回到页面）都展示属性面板；初始化即展示页面属性
watch(
  () => designer.selectionVersion.value,
  () => {
    showInspector.value = true;
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
              checked: !showInspector && activityBarCheckedIndex === index,
            }"
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
  </div>
</template>

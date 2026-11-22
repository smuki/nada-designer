<script lang="ts" setup>
import type { ActivitybarModel } from '@nada-designer/types';

import { computed, ref, shallowRef } from 'vue';

import { EpTooltip, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';

defineOptions({
  name: 'EActivityBar',
});
const designer = useDesignerContext();
const isControlled = designer.designMode === 'controlled';

const activityBars = computed(() => {
  return pluginManager.panel.activityBars.value
    .filter(
      (item) => item.visible && !(isControlled && item.id === 'component_view'),
    )
    .sort((a, b) => {
      return a.sort! - b.sort!;
    });
});

// 受控模式默认收起侧栏，把空间留给画布（字段从工具栏选择器插入）
const activityBarCheckedIndex = ref<null | number>(isControlled ? null : 0);

const sidebarComponent = shallowRef<any>(
  activityBars.value[0]?.component ?? null,
);

function handleClick(item: ActivitybarModel, index: number) {
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
            :class="{ checked: activityBarCheckedIndex === index }"
            @click="handleClick(item, index)"
          >
            <NadaIcon :name="item.icon" />
            <!-- <div class="text-14px">
            {{ item.title }}
          </div> -->
          </li>
        </EpTooltip>
      </ul>
    </div>
    <div
      class="ep-left-sidebar"
      :class="{ hide: activityBarCheckedIndex === null }"
    >
      <div class="ep-sidebar-container">
        <component :is="sidebarComponent" />
      </div>
    </div>
  </div>
</template>

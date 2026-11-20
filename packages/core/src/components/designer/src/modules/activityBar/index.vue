<script lang="ts" setup>
import type { ActivitybarModel } from '@nada-designer/types';

import { computed, ref, shallowRef } from 'vue';

import { EpTooltip, NadaIcon } from '@nada-designer/base-ui';
import { pluginManager } from '@nada-designer/manager';

defineOptions({
  name: 'EActivityBar',
});
const activityBars = computed(() => {
  return pluginManager.panel.activityBars.value
    .filter((item) => item.visible)
    .sort((a, b) => {
      return a.sort! - b.sort!;
    });
});

const activityBarCheckedIndex = ref<null | number>(0);

const sidebarComponent = shallowRef<any>(null);
sidebarComponent.value = activityBars.value[0].component;

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

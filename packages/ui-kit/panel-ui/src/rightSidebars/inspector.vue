<script lang="ts" setup>
import { computed, ref } from 'vue';

import AttributeView from './attribute/attribute.vue';
import EventView from './event/event.vue';
import StyleView from './style/style.vue';

/** 属性面板底部页签（属性 / 样式 / 事件） */
const tabs = [
  { component: AttributeView, key: 'attribute', title: '属性' },
  { component: StyleView, key: 'style', title: '样式' },
  { component: EventView, key: 'event', title: '事件' },
];

const activeKey = ref('attribute');

const activeTab = computed(() => {
  return tabs.find((tab) => tab.key === activeKey.value) ?? tabs[0];
});
</script>
<template>
  <div class="ep-inspector">
    <div class="ep-inspector-content">
      <component :is="activeTab.component" />
    </div>
    <ul class="ep-inspector-tabs">
      <li
        v-for="tab in tabs"
        :key="tab.key"
        class="ep-inspector-tab"
        :class="{ active: tab.key === activeKey }"
        @click="activeKey = tab.key"
      >
        {{ tab.title }}
      </li>
    </ul>
  </div>
</template>
<style scoped lang="less">
.ep-inspector {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ep-inspector-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.ep-inspector-tabs {
  display: flex;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ep-border);
}

.ep-inspector-tab {
  position: relative;
  flex: 1;
  padding: 9px 0;
  color: var(--ep-text-secondary);
  font-size: var(--ep-text-md);
  text-align: center;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--ep-text-main);
  }

  &.active {
    color: var(--ep-primary);

    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--ep-primary);
    }
  }
}
</style>

<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed, PropType } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { NadaIcon } from '@nada-designer/base-ui';
import { pluginManager } from '@nada-designer/manager';
import { getUUID } from '@nada-designer/utils';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array as PropType<ComponentSchema[]>,
  },
});
const emit = defineEmits(['update:modelValue']);
const Input = pluginManager.component.get('input');
const tabList = computed({
  get() {
    return props.modelValue;
  },
  set(e) {
    emit('update:modelValue', e);
  },
});

/**
 * 新增栅格Col
 */
function handleAdd() {
  const index = tabList.value.length + 1;
  const tabItem = {
    id: getUUID(),
    label: `标签${index}`,
    type: 'tab-pane',
    children: [],
  };
  tabList.value.push(tabItem);
}

/**
 * 删除栅格Col
 * @param index
 */
function handleDelete(index: number) {
  tabList.value.splice(index, 1);
}
</script>
<template>
  <div class="ep-tabs-editor">
    <VueDraggable
      v-model="tabList"
      item-key="id"
      :component-data="{
        type: 'transition-group',
      }"
      group="option-list"
      handle=".handle"
      :animation="200"
    >
      <div
        v-for="(item, index) in tabList"
        :key="index"
        class="ep-tab-pane-editor-item my-2 grid grid-cols-[auto_auto_16px] items-center gap-2"
      >
        <NadaIcon class="handle cursor-move text-lg" name="icon--nada--drag" />
        <Input v-model:value="item.label" v-model="item.label" />
        <div
          v-if="tabList.length > 1"
          class="ep-option-del-btn flex items-center"
        >
          <NadaIcon
            class="hover:text-red cursor-pointer text-lg"
            name="icon--nada--delete-outline-rounded"
            @click="handleDelete(index)"
          />
        </div>
      </div>
    </VueDraggable>

    <div class="ep-button ghost primary" @click="handleAdd">添加</div>
  </div>
</template>
<style scoped lang="less">
@import './index.less';
</style>

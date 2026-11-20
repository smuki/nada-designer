<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed, provide, useAttrs } from 'vue';

import { NadaNode } from '@nada-designer/base-ui';
import { NODE_ATTRS_KEY, useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';

import NadaNodes from './nodes.vue';

defineOptions({
  name: 'NadaNodeItem',
});
const props = withDefaults(
  defineProps<{
    draggable?: boolean;
    schema: ComponentSchema;
  }>(),
  {
    draggable: true,
  },
);
const attrs = useAttrs();
const { pageSchema, props: designerProps } = useDesignerContext();
provide(NODE_ATTRS_KEY, attrs);
// 判断是否为叶子节点
const isLeafNode = computed(() => !props.schema.children);

function isDraggable() {
  const schema = props.schema;
  // 判断当前节点类型是否允许拖拽
  if (
    !props.draggable ||
    schema.id === pageSchema.schemas[0]?.id ||
    pluginManager.component.getConfigByType(schema.type)?.editConstraints
      ?.immovable
  ) {
    // 禁止拖拽
    return 'node-drag-disabled';
  }

  return 'node-drag-enabled';
}
</script>
<template>
  <NadaNode
    :component-schema="props.schema"
    class="edit-draggable-widget"
    :show-hidden-items="designerProps?.showHiddenItems"
    :class="[isDraggable(), isLeafNode ? 'ep-node-leaf' : '']"
  >
    <!-- childImmovable不可拖拽设计 start -->
    <template
      v-if="
        pluginManager.component.getConfigByType(props.schema.type)
          ?.editConstraints?.childImmovable
      "
      #edit-node
    >
      <NadaNodeItem
        v-for="node in props.schema.children"
        :key="node.id"
        :schema="node"
        :draggable="false"
      />
    </template>
    <!-- childImmovable不可拖拽设计 end -->
    <template v-else #edit-node>
      <NadaNodes
        v-if="props.schema.children"
        v-model:schemas="props.schema.children"
      />
    </template>
  </NadaNode>
</template>

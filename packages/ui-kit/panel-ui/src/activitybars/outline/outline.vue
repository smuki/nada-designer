<script lang="ts" setup>
import { computed } from 'vue';

import { NadaIcon, NadaTree } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import { findSchemaInfoById } from '@nada-designer/utils';

const designer = useDesignerContext();
const pageSchema = designer.pageSchema;

// 计算选中节点值
const selectedKeys = computed(() => {
  const id = designer.state.selectedNode?.id;
  return id ? [id] : [];
});

// 判断组件是否有绑定事件
function hasBoundEvents(schema: any): boolean {
  if (!schema.on) return false;
  const eventKeys = Object.keys(schema.on);
  return eventKeys.some((key) => {
    const events = schema.on[key];
    return Array.isArray(events) && events.length > 0;
  });
}

// 设置选中节点
function handleNodeClick(e: any) {
  designer.setSelectedNode(e.componentSchema);
}

function handleShow(schema) {
  schema.props || (schema.props = {});
  schema.props.hidden = !schema.props.hidden;
}

function handleLock(schema) {
  schema.status || (schema.status = { lock: false });
  schema.status.lock = !schema.status.lock;
}

/**
 * 删除元素
 */
function handleDelete(schema) {
  if (!schema) return;
  const data = findSchemaInfoById(pageSchema.schemas, schema.id);
  if (!data) {
    return false;
  }
  let { index, list } = data;
  list.splice(index, 1);
  if (index === list.length) {
    index--;
  }
  designer.setSelectedNode(list[index]);
  designer.revoke.push('删除组件');
}
</script>
<template>
  <div class="ep-outline">
    <NadaTree
      :options="pageSchema.schemas"
      :draggable="false"
      :selected-keys="selectedKeys"
      :hover-key="designer.state.hoverNode?.id ?? ''"
      @node-click="handleNodeClick"
    >
      <template #tree-node="{ schema }">
        <div
          class="ep-outline-item ep-text-padding flex"
          :class="{ hidden: schema.props?.hidden }"
          @mouseenter.stop="designer.setHoverNode(schema)"
          @mouseleave.stop="designer.setHoverNode(null)"
        >
          <span class="max-w-full truncate">
            <NadaIcon
              class="ep-component-icon translate-y-2px"
              :name="pluginManager.component.getIcon(schema.type)"
            />
            <span
              v-if="hasBoundEvents(schema)"
              class="ep-event-badge ml-0.5"
              title="已绑定事件"
            >
              事件
            </span>
            {{ schema.label ?? pluginManager.component.getLabel(schema.type) }}
          </span>
          <span class="ep-node-type-text w-0 flex-1 truncate">
            {{ schema.id }}
          </span>

          <!-- 组件操作 start -->
          <div
            v-if="
              !pluginManager.component.getLocked(schema.type) &&
              schema.id !== designer.pageSchema.schemas[0].id
            "
            class="ep-tree-action"
            :class="{
              active: schema.props?.hidden || schema.status?.lock,
            }"
          >
            <NadaIcon
              v-if="!schema.props?.hidden"
              class="mr-2"
              :class="{ active: schema.status?.lock }"
              :name="
                schema.status?.lock
                  ? 'icon--nada--lock-outline'
                  : 'icon--nada--lock-open-outline'
              "
              @click="handleLock(schema)"
            />
            <NadaIcon
              v-if="!schema.status?.lock"
              class="mr-2"
              :class="{ active: schema.props?.hidden }"
              :name="
                schema.props?.hidden
                  ? 'icon--nada--visibility-off-outline-rounded'
                  : 'icon--nada--visibility-outline-rounded'
              "
              @click="handleShow(schema)"
            />
            <NadaIcon
              v-if="!schema.status?.lock && !schema.props?.hidden"
              class="mr-2"
              name="icon--nada--delete-outline-rounded"
              @click="handleDelete(schema)"
            />
          </div>
          <!-- 组件操作 end -->
        </div>
      </template>
    </NadaTree>
  </div>
</template>

<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed, ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { EpCollapse, EpCollapsePanel, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import { findSchemaInfoById, generateNewSchema } from '@nada-designer/utils';
import { useStorage } from '@vueuse/core';

const emit = defineEmits(['close']);

const Input = pluginManager.component.get('input');
const designer = useDesignerContext();
const revoke = designer.revoke;
const pageSchema = designer.pageSchema;
const groups = pluginManager.component.getComponentSchemaGroups();

const keyword = ref('');
const activeKeys = useStorage('ep-component-view-keys', []);
const selectedTypes = ref<string[]>([]);

const getSchemaTypeList = computed(() => {
  return groups.value
    .map((item) => ({
      ...item,
      list: item.list.filter((item) => item.label?.includes(keyword.value)),
    }))
    .filter((item) => item.list.length > 0);
});

/** 按面板顺序排列的已选组件类型 */
const orderedSelectedTypes = computed(() => {
  const allTypes: string[] = [];
  groups.value.forEach((group) => {
    group.list.forEach((item) => allTypes.push(item.type));
  });
  return allTypes.filter((type) => selectedTypes.value.includes(type));
});

function isSelected(type: string): boolean {
  return selectedTypes.value.includes(type);
}

/**
 * 切换组件选中状态
 * @param schema 组件 defaultSchema
 */
function toggleSelect(schema: ComponentSchema) {
  selectedTypes.value = selectedTypes.value.includes(schema.type)
    ? selectedTypes.value.filter((type) => type !== schema.type)
    : [...selectedTypes.value, schema.type];
}

/**
 * 获取当前选中节点之后的插入位置
 */
function getInsertTarget() {
  const targetId = designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id;
  if (!targetId) return null;

  const data = findSchemaInfoById(pageSchema.schemas, targetId);
  if (!data) return null;

  let { index, schema: checkedSchema, list } = data;
  if (
    checkedSchema.children &&
    !pluginManager.component.getConfigByType(checkedSchema.type)
      ?.editConstraints?.childImmovable
  ) {
    list = checkedSchema.children;
    index = list.length - 1;
  }
  return { index, list };
}

/** 批量插入已选组件 */
function handleConfirm() {
  if (orderedSelectedTypes.value.length === 0) return;

  const target = getInsertTarget();
  if (!target) return;

  let lastNode: ComponentSchema | null = null;
  orderedSelectedTypes.value.forEach((type) => {
    const defaultSchema =
      pluginManager.component.getComponentConfigByType(type)?.defaultSchema;
    if (!defaultSchema) return;

    const node = generateNewSchema(defaultSchema);
    target.list.splice(target.index + 1, 0, node);
    target.index += 1;
    lastNode = node;
  });

  if (lastNode) {
    designer.setSelectedNode(lastNode);
    revoke.push('插入组件', true);
  }
  emit('close');
}

// 画布发生任何插入/选中（例如拖拽落点）后自动收起
watch(
  () => designer.selectionVersion.value,
  () => {
    emit('close');
  },
);
</script>
<template>
  <div class="ep-component-picker" @mousedown.stop>
    <div class="ep-component-picker-header">
      <span class="ep-component-picker-title">添加组件</span>
      <span class="ep-component-picker-close" @click="emit('close')">×</span>
    </div>
    <div class="ep-component-picker-search">
      <Input
        v-model="keyword"
        v-model:value="keyword"
        placeholder="搜索组件"
        size="small"
        clearable
        allow-clear
      />
    </div>
    <div class="ep-component-picker-body">
      <EpCollapse :default-expand-all="!activeKeys.length" v-model="activeKeys">
        <EpCollapsePanel
          v-for="group in getSchemaTypeList"
          :name="group.title"
          :title="group.title"
          :key="group.title"
        >
          <VueDraggable
            v-model="group.list"
            :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
            :sort="false"
            :animation="180"
            ghost-class="moving"
            :clone="generateNewSchema"
            item-key="id"
            class="ep-component-picker-grid"
          >
            <div
              v-for="item in group.list"
              :key="item.type"
              class="ep-component-picker-item"
              :class="{ selected: isSelected(item.type) }"
              @click="toggleSelect(item)"
            >
              <span class="ep-component-picker-check">
                {{ isSelected(item.type) ? '✓' : '' }}
              </span>
              <NadaIcon
                :name="
                  pluginManager.component.getConfigByType(item.type).icon ?? ''
                "
              />
              <span class="ep-component-picker-label">{{ item.label }}</span>
            </div>
          </VueDraggable>
        </EpCollapsePanel>
      </EpCollapse>
      <div
        v-if="getSchemaTypeList.length === 0"
        class="ep-component-picker-empty"
      >
        没有查询到的组件
      </div>
    </div>
    <div class="ep-component-picker-footer">
      <span class="ep-component-picker-tip">
        可直接拖到画布，或勾选多个后插入
      </span>
      <span
        class="ep-component-picker-confirm"
        :class="{ disabled: orderedSelectedTypes.length === 0 }"
        @click="handleConfirm"
      >
        插入 {{ orderedSelectedTypes.length }} 个组件
      </span>
    </div>
  </div>
</template>
<style scoped lang="less">
.ep-component-picker {
  position: absolute;
  top: 8px;
  left: 56px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  width: 420px;
  max-height: 60vh;
  padding: 10px 12px;
  background: var(--ep-canvas-container-background, #fff);
  border: 1px solid var(--ep-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 14%);
}

.ep-component-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ep-border);
}

.ep-component-picker-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--ep-text-main);
}

.ep-component-picker-close {
  color: var(--ep-text-helper);
  cursor: pointer;

  &:hover {
    color: var(--ep-text-main);
  }
}

.ep-component-picker-search {
  padding: 8px 0;
}

.ep-component-picker-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.ep-component-picker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 2px;
}

.ep-component-picker-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  color: var(--ep-text-main);
  cursor: pointer;
  border-radius: var(--ep-radius);

  &:hover {
    background: var(--ep-primary-faded);
  }

  &.selected {
    color: var(--ep-primary);
    background: var(--ep-primary-faded);
  }
}

.ep-component-picker-check {
  width: 12px;
  flex-shrink: 0;
  text-align: center;
  color: var(--ep-primary);
}

.ep-component-picker-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ep-component-picker-empty {
  padding: 24px;
  color: var(--ep-text-helper);
  text-align: center;
}

.ep-component-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--ep-border);
}

.ep-component-picker-tip {
  color: var(--ep-text-helper);
  font-size: 12px;
}

.ep-component-picker-confirm {
  padding: 6px 14px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  background: var(--ep-primary);
  border-radius: var(--ep-radius);

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>

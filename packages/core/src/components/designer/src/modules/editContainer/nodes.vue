<script lang="ts" setup>
import type { ComponentSchema, FieldMeta } from '@nada-designer/types';

import { computed, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { useDesignerContext, usePageManager } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  findSchemaById,
  findSchemas,
  getMatchedById,
  rewriteComponentRefs,
} from '@nada-designer/utils';

import NadaNodeItem from './nodeItem.vue';

defineOptions({
  name: 'EditNodeItem',
});
const props = defineProps<{
  /** 落点所在列表的父节点；根列表为 undefined */
  parentSchema?: ComponentSchema;
  schemas: ComponentSchema[];
}>();
const emit = defineEmits(['update:schemas']);
const designer = useDesignerContext();
const revoke = designer.revoke;
const pageSchema = designer.pageSchema;
const pageManager = usePageManager();

const modelSchemas = computed({
  get: () => props.schemas,
  set: (val) => emit('update:schemas', val.filter(Boolean)),
});

const isDragChange = ref(false);

/**
 * 获取节点的schema
 * @param {Element} target 节点元素
 * @returns {ComponentSchema | null} 节点的schema
 */
function getNodeSchema(target) {
  if (!target?.closest) return null;

  // 优先检查当前元素
  if (target.dataset?.nadaId) {
    return getSchemaByNadaId(target.dataset.nadaId);
  }

  // 检查直接子元素（只向下查询一级）
  if (!target.classList.contains('ep-draggable-range')) {
    const directChild = target.querySelector(':scope > [data-nada-id]');
    if (directChild?.dataset?.nadaId) {
      return getSchemaByNadaId(directChild.dataset.nadaId);
    }
  }

  // 向父级查找
  const parentElement = target.closest('[data-nada-id]');
  if (parentElement?.dataset?.nadaId) {
    return getSchemaByNadaId(parentElement.dataset.nadaId);
  }

  return null;
}

/**
 * 根据nadaId获取schema的辅助函数
 * @param {string} nadaId
 */
function getSchemaByNadaId(nadaId) {
  const instance = pageManager.findInstance(nadaId);
  return instance?.exposed?.schema || null;
}

function setSelectedNode(event: any) {
  const schema = getNodeSchema(event.item ?? event.target);
  event.stopPropagation();
  designer.setSelectedNode(schema);
}

function setHoverNode(event: Event) {
  const schema = getNodeSchema(event.target);
  event.stopPropagation();
  designer.setHoverNode(schema);
}

/**
 * 落点所在的目标列表
 */
function getTargetList(): ComponentSchema[] {
  return props.parentSchema?.children ?? pageSchema.schemas;
}

/**
 * 落点作用域：父节点的最近 form 祖先，找不到回退页面根节点
 */
function getTargetScopeId(): string | undefined {
  const rootId = pageSchema.schemas[0]?.id;
  if (!props.parentSchema?.id) return rootId;

  const path = getMatchedById(pageSchema.schemas, props.parentSchema.id);
  for (let index = path.length - 1; index >= 0; index -= 1) {
    if (path[index]?.type === 'form') {
      return path[index]?.id;
    }
  }
  return rootId;
}

/**
 * 通过节点 id 解析作用域 id：最近 form 祖先，找不到回退页面根节点
 * @param ownerId 父节点 id
 */
function resolveScopeIdByOwnerId(ownerId?: string): string | undefined {
  const rootId = pageSchema.schemas[0]?.id;
  if (!ownerId) return rootId;

  const path = getMatchedById(pageSchema.schemas, ownerId);
  for (let index = path.length - 1; index >= 0; index -= 1) {
    if (path[index]?.type === 'form') {
      return path[index]?.id;
    }
  }
  return rootId;
}

/**
 * 从拖拽容器 DOM 反查作用域 id
 * @description 列表容器最近的 `.ep-node-item` 即其父节点；根列表回退页面根节点
 * @param container 列表容器 DOM
 */
function scopeIdFromContainer(container: any): string | undefined {
  const ownerEl = container?.closest?.('.ep-node-item');
  return resolveScopeIdByOwnerId(ownerEl?.dataset?.nadaId);
}

/**
 * 是否为「已有业务字段节点」的跨列表移动
 * @description 面板拖入时 data 是 FieldMeta（无 id），这里用 id + 元数据存在性区分
 */
function isBusinessFieldMove(event: any): boolean {
  const data = event?.data;
  return Boolean(
    data?.id &&
      data?.field &&
      designer.businessFields.fieldMap.value.has(data.field),
  );
}

/**
 * 跨 form 拖拽预判：目标作用域已存在同字段时拒绝（规格 §7.4）
 * @param event Sortable move 事件
 */
function handleDragMove(event: any): boolean {
  if (designer.designMode !== 'controlled') return true;
  if (!isBusinessFieldMove(event)) return true;

  const draggedId = event?.dragged?.dataset?.nadaId;
  const sourceScopeId = scopeIdFromContainer(event?.from);
  const targetScopeId = scopeIdFromContainer(event?.to);
  if (!draggedId || !targetScopeId || sourceScopeId === targetScopeId) {
    return true;
  }

  const draggedNode = findSchemaById(pageSchema.schemas, draggedId);
  if (!draggedNode?.field) return true;

  const targetScope = findSchemaById(pageSchema.schemas, targetScopeId);
  const duplicated = findSchemas(
    targetScope?.children ?? [],
    (node) =>
      node.input === true &&
      node.field === draggedNode.field &&
      node.id !== draggedId,
    true,
  );
  if (duplicated) {
    pluginManager.global.$message.warning(
      `字段「${draggedNode.label ?? draggedNode.field}」在目标表单中已存在`,
    );
    return false;
  }
  return true;
}

/**
 * 业务字段跨 form 移动：重算 id 并改写动作引用（规格 §7.4）
 * @param event Sortable add 事件
 */
function handleBusinessFieldMove(event: any) {
  const moved = event?.clonedData as ComponentSchema | undefined;
  const scopeId = getTargetScopeId();
  if (!moved?.id || !scopeId || !moved.field) return;

  isDragChange.value = false;
  const oldId = moved.id;
  const newId = `${scopeId}_${moved.field}`;
  if (oldId === newId) {
    // 同作用域内移动：只记录撤销
    designer.setSelectedNode(moved);
    revoke.push('移动业务字段', true);
    return;
  }

  moved.id = newId;
  rewriteComponentRefs(pageSchema.schemas, oldId, newId);
  designer.setSelectedNode(moved);
  revoke.push('移动业务字段', true);
}

/**
 * 业务字段拖入：占位节点已由库插入目标列表，这里就地重建或摘除（规格 D33）
 * @param event Sortable add 事件
 */
function handleBusinessFieldDrop(event: any) {
  const meta = event.clonedData?.__businessField as FieldMeta | undefined;
  const list = getTargetList();
  const index = list.findIndex(
    (item: any) =>
      item?.__businessField?.field === meta?.field &&
      Boolean(item?.__businessField),
  );
  if (!meta || index === -1) return;

  isDragChange.value = false;
  const scopeId = getTargetScopeId();
  const result: { message?: string; node?: ComponentSchema; ok: boolean } =
    scopeId
      ? designer.businessFields.checkField(meta, scopeId)
      : { message: '未找到业务对象作用域', ok: false };

  if (!result.ok || !result.node) {
    // 落点校验失败：摘除占位节点，不写撤销记录
    list.splice(index, 1);
    if (result.message) {
      pluginManager.global.$message.warning(result.message);
    }
    return;
  }

  list.splice(index, 1, result.node);
  designer.setSelectedNode(result.node);
  revoke.push('插入业务字段', true);
}

/**
 * 从侧边栏拖入编辑区域，直接记录
 * 拖入也会导致 change 被触发，Add 应该设置 isDrageChange 标识为 false
 */
function handleDragAdd(event: any) {
  if (
    designer.designMode === 'controlled' &&
    !event.clonedData?.__businessField &&
    isBusinessFieldMove(event)
  ) {
    handleBusinessFieldMove(event);
    return;
  }

  if (
    designer.designMode === 'controlled' &&
    event.clonedData?.__businessField
  ) {
    handleBusinessFieldDrop(event);
    return;
  }

  designer.setSelectedNode(event.clonedData);
  isDragChange.value = false;
  // 从组件面板拖入画布时 SortableJS 只在源列表触发 end，画布侧 @end 不会执行，
  // 因此必须在这里记录一次，否则拖入操作无法撤销
  revoke.push('拖入组件', true);
}

/**
 * 编辑区域内的拖拽change事件，记录顺序发生变化
 */
function handleDragChange() {
  isDragChange.value = true;
}

/**
 * 编辑区域内的拖拽结束事件，需判断是否 change，有可能拖拽并未修改顺序
 */
function handleDragEnd() {
  if (isDragChange.value) {
    revoke.push('拖拽组件', true);
  }
  isDragChange.value = false;
}

function isInline(schema: ComponentSchema) {
  const config = pluginManager.component.getComponentConfigByType(schema.type);
  return config?.editConstraints?.inline || false;
}
</script>

<template>
  <VueDraggable
    v-model="modelSchemas"
    class="ep-draggable-range"
    :animation="200"
    group="edit-draggable"
    ghost-class="ep-moveing"
    :on-move="handleDragMove"
    @mouseover.stop="setHoverNode"
    @change="handleDragChange"
    @add="handleDragAdd"
    @end="handleDragEnd"
    @click.stop="setSelectedNode"
    @choose="setSelectedNode"
  >
    <div
      class="ep-node-item"
      :class="{ 'ep-inline': isInline(element) }"
      v-for="element in modelSchemas"
      :key="element.id"
      :data-nada-id="element.id"
    >
      <NadaNodeItem :schema="element" />
    </div>
  </VueDraggable>
</template>

<script lang="ts" setup>
import type { ComponentSchema, Property } from '@nada-designer/types';

import { computed, ref, watchEffect } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { EpCollapse, EpCollapsePanel, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  findSchemaInfoById,
  generateNewSchema,
  isControlledComponentType,
  mapPropertyType,
} from '@nada-designer/utils';
import { useStorage } from '@vueuse/core';

const Input = pluginManager.component.get('input');
const designer = useDesignerContext();
const revoke = designer.revoke;
const pageSchema = designer.pageSchema;
const groups = pluginManager.component.getComponentSchemaGroups();
const keyword = ref('');
const activeKeys = useStorage('ep-component-view-keys', []);

const businessFields = designer.businessFields;

/** 业务字段平铺 + 搜索（受控模式唯一字段来源） */
const businessFieldList = computed(() => {
  const properties = businessFields.properties.value;
  if (!keyword.value) return properties;
  return properties.filter((item) => item.label.includes(keyword.value));
});

/** 业务字段拖拽列表（本地 ref 承接，clone 只产出占位节点） */
const fieldDragItems = ref<Property[]>([]);
watchEffect(() => {
  fieldDragItems.value = businessFieldList.value;
});

/** 当前作用域内已放置的字段（用于面板置灰，规格 §10.2） */
const placedFields = computed(() => {
  return new Set(
    businessFields.getPlacedFields(designer.state.selectedNode?.id),
  );
});

/**
 * 字段是否已在当前作用域放置
 * @param field 业务字段标识
 */
function isFieldPlaced(field: string): boolean {
  return placedFields.value.has(field);
}

/**
 * 业务字段拖拽占位节点：落点处再按作用域构造真实节点（规格 D33）
 * @param meta 业务字段元数据
 */
function createBusinessPlaceholder(meta: Property): ComponentSchema {
  return {
    __businessProperty: meta,
    id: `__pending_${meta.field}`,
    label: meta.label,
    type: '__pending',
  };
}

/** 版式组件（布局/展示/动作，本地 ref 承接，避免直接改注册表数据） */
const layoutItems = ref<ComponentSchema[]>([]);

/**
 * 收集受控模式允许放置的版式组件（注册表 ∩ 白名单）
 */
function collectLayoutItems(): ComponentSchema[] {
  const seen = new Set<string>();
  const list: ComponentSchema[] = [];

  groups.value.forEach((group) => {
    group.list.forEach((item) => {
      if (!isControlledComponentType(item.type) || seen.has(item.type)) return;
      seen.add(item.type);
      list.push(item);
    });
  });

  // form 可能被其他实例的 formMode 全局隐藏，兜底从注册表补上
  if (!seen.has('form')) {
    const formSchema =
      pluginManager.component.getComponentConfigByType('form')?.defaultSchema;
    if (formSchema) {
      list.unshift(formSchema);
    }
  }
  return list;
}

watchEffect(() => {
  layoutItems.value = collectLayoutItems();
});

/**
 * 业务字段图标：按映射后的组件类型取图标
 * @param type 元数据类型
 */
function getFieldIcon(type: Property['type']): string {
  const componentType = mapPropertyType(type);
  return componentType
    ? pluginManager.component.getIcon(componentType)
    : 'icon--nada--component';
}

/**
 * 点击插入业务字段
 * @param meta 业务字段元数据
 */
function handleFieldClick(meta: Property) {
  if (isFieldPlaced(meta.field)) {
    pluginManager.global.$message.info(`字段「${meta.label}」已放置`);
    return false;
  }

  const result = businessFields.insertProperty(meta, {
    onInserted: (node) => {
      designer.setSelectedNode(node);
      revoke.push('插入业务字段', true);
    },
    targetId: designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id,
  });
  if (!result.ok && result.message) {
    pluginManager.global.$message.warning(result.message);
  }
  return result.ok;
}

/**
 * 点击添加版式组件（走注册表 defaultSchema）
 */
function handleClick(schema: ComponentSchema) {
  const data = findSchemaInfoById(
    pageSchema.schemas,
    designer.state.selectedNode?.id ?? 'root',
  );
  if (!data) {
    return false;
  }
  let { index, schema: checkedSchema, list } = data;

  // 如果选中元素存在children字段，则添加到children中
  if (
    checkedSchema.children &&
    !pluginManager.component.getConfigByType(checkedSchema.type)
      ?.editConstraints?.childImmovable
  ) {
    list = checkedSchema.children;
    index = checkedSchema.children.length - 1;
  }

  const newSchema = generateNewSchema(schema);

  list.splice(index + 1, 0, newSchema);
  designer.setSelectedNode(newSchema);
  revoke.push('插入版式组件', true);
}
</script>
<template>
  <div class="ep-component-view flex flex-col">
    <!-- 搜素框 start -->
    <div class="ep-search-box px-10px py-2">
      <Input
        v-model="keyword"
        v-model:value="keyword"
        placeholder="搜索字段/版式"
        clearable
        allow-clear
      >
        <template #prefix>
          <NadaIcon
            class="text-$ep-text-helper"
            name="icon--nada--search-rounded"
          />
        </template>
      </Input>
    </div>
    <!-- 搜素框 end -->
    <div class="flex flex-1 overflow-auto">
      <div class="box-border h-full flex-1 overflow-auto">
        <EpCollapse
          :default-expand-all="!activeKeys.length"
          v-model="activeKeys"
        >
          <EpCollapsePanel name="业务字段" title="业务字段">
            <VueDraggable
              v-model="fieldDragItems"
              :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
              :sort="false"
              :animation="180"
              ghost-class="moving"
              :clone="createBusinessPlaceholder"
              filter=".is-placed"
              item-key="field"
              class="grid grid-cols-[auto_auto] gap-2 px-2 pb-2 pt-1"
            >
              <div
                v-for="item in fieldDragItems"
                :key="item.field"
                class="ep-component-item flex items-center truncate"
                :class="{ 'is-placed': isFieldPlaced(item.field) }"
                :title="isFieldPlaced(item.field) ? '已放置' : item.field"
                @click="handleFieldClick(item)"
              >
                <NadaIcon :name="getFieldIcon(item.type)" />
                <div class="ep-component-label w-0 flex-1 truncate">
                  {{ item.label }}
                </div>
              </div>
            </VueDraggable>
            <div
              v-if="businessFieldList.length === 0"
              class="pt-4 text-center text-gray-400"
            >
              没有匹配的字段
            </div>
          </EpCollapsePanel>
          <EpCollapsePanel name="版式" title="版式">
            <VueDraggable
              v-model="layoutItems"
              :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
              :sort="false"
              :animation="180"
              ghost-class="moving"
              :clone="generateNewSchema"
              item-key="id"
              class="grid grid-cols-[auto_auto] gap-2 px-2 pb-2 pt-1"
            >
              <div
                v-for="item in layoutItems"
                :key="item.type"
                class="ep-component-item flex items-center truncate"
                @click="handleClick(item)"
              >
                <NadaIcon
                  :name="
                    pluginManager.component.getConfigByType(item.type).icon ??
                    ''
                  "
                />
                <div class="ep-component-label w-0 flex-1 truncate">
                  {{ item.label }}
                </div>
              </div>
            </VueDraggable>
            <div
              v-if="layoutItems.length === 0"
              class="pt-4 text-center text-gray-400"
            >
              没有可用的版式组件
            </div>
          </EpCollapsePanel>
        </EpCollapse>
      </div>
    </div>
  </div>
</template>

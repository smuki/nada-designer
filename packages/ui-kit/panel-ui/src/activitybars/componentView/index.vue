<script lang="ts" setup>
import type { ComponentSchema, FieldMeta } from '@nada-designer/types';

import { computed, ref, watchEffect } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { EpCollapse, EpCollapsePanel, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  findSchemaInfoById,
  generateNewSchema,
  mapFieldDataType,
} from '@nada-designer/utils';
import { useStorage } from '@vueuse/core';

const Input = pluginManager.component.get('input');
const designer = useDesignerContext();
const revoke = designer.revoke;
const pageSchema = designer.pageSchema;
const groups = pluginManager.component.getComponentSchemaGroups();
const keyword = ref('');
const activeKeys = useStorage('ep-component-view-keys', []);

/** 受控模式允许拖入的布局组件白名单（规格 D24） */
const LAYOUT_WHITELIST = new Set(['card', 'form', 'row', 'tabs']);

const isControlled = designer.designMode === 'controlled';
const businessFields = designer.businessFields;

/** 自由模式：按注册表分组渲染（现状） */
const getSchemaTypeList = computed(() => {
  return groups.value
    .map((item) => ({
      ...item,
      list: item.list.filter((item) => item.label?.includes(keyword.value)),
    }))
    .filter((item) => item.list.length > 0);
});

/** 受控模式：业务字段平铺 + 搜索（v1 不做分组，规格 D43） */
const businessFieldList = computed(() => {
  const fields = businessFields.fields.value;
  if (!keyword.value) return fields;
  return fields.filter((item) => item.label.includes(keyword.value));
});

/** 受控模式：布局白名单（用本地 ref 承接拖拽组件，避免直接改注册表数据） */
const layoutItems = ref<ComponentSchema[]>([]);

/**
 * 收集受控模式下允许出现的布局组件
 */
function collectLayoutItems(): ComponentSchema[] {
  const seen = new Set<string>();
  const list: ComponentSchema[] = [];

  groups.value.forEach((group) => {
    group.list.forEach((item) => {
      if (!LAYOUT_WHITELIST.has(item.type) || seen.has(item.type)) return;
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
function getFieldIcon(type: FieldMeta['type']): string {
  const componentType = mapFieldDataType(type);
  return componentType
    ? pluginManager.component.getIcon(componentType)
    : 'icon--nada--component';
}

/**
 * 点击添加节点（布局组件走注册表 defaultSchema）
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
  revoke.push('插入组件', true);
}
</script>
<template>
  <div class="ep-component-view flex flex-col">
    <!-- 搜素框 start -->
    <div class="ep-search-box px-10px py-2">
      <Input
        v-model="keyword"
        v-model:value="keyword"
        placeholder="搜索组件"
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
      <!-- 分类选项 start  -->
      <div class="box-border h-full flex-1 overflow-auto">
        <!-- 受控模式 start -->
        <EpCollapse
          v-if="isControlled"
          :default-expand-all="!activeKeys.length"
          v-model="activeKeys"
        >
          <EpCollapsePanel name="业务字段" title="业务字段">
            <div class="grid grid-cols-[auto_auto] gap-2 px-2 pb-2 pt-1">
              <div
                v-for="item in businessFieldList"
                :key="item.field"
                class="ep-component-item flex items-center truncate"
                :title="item.field"
              >
                <NadaIcon :name="getFieldIcon(item.type)" />
                <div class="ep-component-label w-0 flex-1 truncate">
                  {{ item.label }}
                </div>
              </div>
            </div>
            <div
              v-if="businessFieldList.length === 0"
              class="pt-4 text-center text-gray-400"
            >
              没有匹配的字段
            </div>
          </EpCollapsePanel>
          <EpCollapsePanel name="布局" title="布局">
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
          </EpCollapsePanel>
        </EpCollapse>
        <!-- 受控模式 end -->

        <!-- 自由模式（现状） start -->
        <EpCollapse
          v-else
          :default-expand-all="!activeKeys.length"
          v-model="activeKeys"
        >
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
              class="grid grid-cols-[auto_auto] gap-2 px-2 pb-2 pt-1"
            >
              <div
                v-for="item in group.list"
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
          </EpCollapsePanel>
        </EpCollapse>
        <!-- 自由模式 end -->

        <div
          v-show="!isControlled && getSchemaTypeList.length === 0"
          class="pt-42px text-center text-gray-400"
        >
          没有查询到的组件
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from 'vue';

import { NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext, useTableMeta } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import { useClipboard } from '@vueuse/core';

import EAttributeItem from './modules/attributeItem.vue';

const designer = useDesignerContext();
const pageSchema = designer.pageSchema;

const { copied, copy } = useClipboard();
watchEffect(() => {
  if (copied.value) {
    pluginManager.global.$message.success('节点ID复制成功');
  }
});

const componentConfigs = pluginManager.component.getComponentConfigs();
const selectedNode = computed(() => {
  return designer.state.selectedNode;
});

const businessFields = designer.businessFields;

/** 受控模式下只读展示的业务字段信息（含元数据是否存在） */
const businessProperty = computed(() => {
  const field = selectedNode.value?.field;
  return field ? businessFields.propertyMap.value.get(field) : undefined;
});

const tableMeta = useTableMeta(pluginManager);

// 获取组件属性配置
const componentAttributes = computed(() => {
  if (!selectedNode.value || !selectedNode.value.type) {
    return [];
  }

  const baseAttributes =
    componentConfigs[selectedNode.value.type]?.config?.attribute ?? [];
  const allAttributes = [...baseAttributes];

  if (selectedNode.value.id === pageSchema.schemas[0]?.id) {
    allAttributes.push(
      {
        editData: pageSchema,
        field: 'canvas.width',
        label: '画布宽度',
        type: 'EInputSize',
      },
      {
        editData: pageSchema,
        field: 'canvas.height',
        label: '画布高度',
        type: 'EInputSize',
      },
    );
  }

  // field 只读：统一过滤各组件配置里的「数据字段」项（不改 40+ 处配置）
  const isRoot = selectedNode.value.id === pageSchema.schemas[0]?.id;
  return allAttributes.filter((item) => {
    if (item.field === 'field') return false;
    // 根表单名称固定 default，不允许修改
    if (isRoot && item.field === 'props.name') return false;
    return true;
  });
});
</script>
<template>
  <div :key="selectedNode?.id" class="ep-attribute-view">
    <!-- 组件id展示 start -->
    <div
      class="ep-attr-item mb-2 mt-2 flex h-8 cursor-pointer items-center px-4"
    >
      <div
        class="bg-$ep-secondary rounded-1 h-full flex-1 px-2 leading-8"
        @click="copy(designer.state.selectedNode?.id ?? '')"
      >
        <NadaIcon
          class="ep-component-icon translate-y-2px mr-1"
          :name="
            pluginManager.component.getIcon(designer.state.selectedNode!.type)
          "
        />
        {{ designer.state.selectedNode?.id }}
      </div>
    </div>
    <!-- 组件id展示 end -->
    <!-- 业务字段只读信息 start -->
    <div
      v-if="selectedNode?.field"
      class="ep-attr-item mb-2 flex h-8 items-center px-4"
    >
      <div class="ep-attr-label">业务字段</div>
      <div class="bg-$ep-secondary rounded-1 h-full flex-1 px-2 leading-8">
        {{ selectedNode.field }}
        <span v-if="businessProperty" class="text-$ep-text-helper ml-2">
          （{{ businessProperty.type }}）
        </span>
        <span v-else class="text-$ep-text-helper ml-2">（元数据中不存在）</span>
      </div>
    </div>
    <!-- 业务字段只读信息 end -->
    <!-- 数据表 start -->
    <div
      v-if="tableMeta?.tableRemark && designer.state.selectedNode?.input"
      class="ep-attr-item mb-2 flex h-8 cursor-pointer items-center px-4"
    >
      <div class="ep-attr-label">数据表</div>
      <div class="bg-$ep-secondary rounded-1 h-full flex-1 px-2 leading-8">
        {{ tableMeta.tableRemark }}
      </div>
    </div>
    <!-- 数据表 end -->
    <div v-for="item in componentAttributes" :key="item.field">
      <EAttributeItem :schema="item" />
    </div>
  </div>
</template>

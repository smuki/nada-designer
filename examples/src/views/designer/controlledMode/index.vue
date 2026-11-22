<script lang="ts" setup>
import type { PageSchema } from '@nada-designer/types';

import { ref } from 'vue';

import { EDesigner } from '@nada-designer/core';

import { businessFieldLoader } from './fieldMeta';

const designerRef = ref<InstanceType<typeof EDesigner>>();

/**
 * 保存时打印页面 JSON（含 businessObject）
 * @param data 页面数据
 */
function handleSave(data: PageSchema) {
  console.log('[受控模式] 保存的页面 JSON：', data);
}
</script>
<template>
  <EDesigner
    ref="designerRef"
    business-object="销售单据"
    :business-field-loader="businessFieldLoader"
    design-mode="controlled"
    title="受控字段模式示例（销售单据）"
    @save="handleSave"
  >
    <template #header-prefix>
      <div>字段来自业务对象「销售单据」，从左侧面板拖入即可</div>
    </template>
  </EDesigner>
</template>

<script lang="ts" setup>
import type { PageSchema } from '@nada-designer/types';

import { ref } from 'vue';

import { EDesigner } from '@nada-designer/core';

import { businessFieldLoader, DEMO_MODEL_ID } from '../shared/propertyCatalog';

const designerRef = ref<InstanceType<typeof EDesigner>>();
/**
 * 点击保存按钮操作
 * @param e
 */
function handleSubmit(e: PageSchema) {
  console.log(e);
}
</script>
<template>
  <EDesigner
    ref="designerRef"
    :business-field-loader="businessFieldLoader"
    :model-id="DEMO_MODEL_ID"
    title="nadaDesigner基础用法示例（受控模式）"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>字段来自业务对象元数据，从左侧「业务字段」拖入即可</div>
    </template>
  </EDesigner>
</template>

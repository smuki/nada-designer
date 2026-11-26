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
    title="表单模式示例（受控模式：根节点即表单）"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>受控模式的根节点固定为 form，不再需要额外开启表单模式</div>
    </template>
  </EDesigner>
</template>

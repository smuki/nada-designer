<script lang="ts" setup>
import type { PageSchema } from '@nada-designer/types';

import { ref } from 'vue';

import { EDesigner } from '@nada-designer/core';
import { pluginManager } from '@nada-designer/manager';

import { businessFieldLoader, DEMO_MODEL_ID } from '../shared/propertyCatalog';

pluginManager.panel.hideActivitybar('源码');
pluginManager.panel.hideRightSidebar('样式');

setTimeout(() => {
  pluginManager.panel.showActivitybar('源码');
  pluginManager.panel.showRightSidebar('样式');
}, 8000);

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
    title="nadaDesigner面板控制示例（受控模式）"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>8 秒后自动显示「源码」面板</div>
    </template>
  </EDesigner>
</template>

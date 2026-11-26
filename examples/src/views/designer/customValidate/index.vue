<script lang="ts" setup>
import type { PageSchema } from '@nada-designer/types';

import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
} from 'vue';

import { EDesigner } from '@nada-designer/core';

import { businessFieldLoader, DEMO_MODEL_ID } from '../shared/propertyCatalog';
import {
  hideCustomValidateComponent,
  showCustomValidateComponent,
} from './registerCustomValidateComponent';

const designerRef = ref<InstanceType<typeof EDesigner>>();

/** 受控页面数据：字段来自业务对象元数据，根节点为 form */
const pageSchema: PageSchema = {
  canvas: {
    mode: 'desktop',
  },
  modelId: DEMO_MODEL_ID,
  schemas: [
    {
      id: 'root',
      label: '表单',
      props: {
        labelLayout: 'fixed',
        labelWidth: 120,
        name: 'default',
      },
      type: 'form',
      children: [
        {
          field: 'customCheck',
          id: 'custom_validate_1',
          input: true,
          label: '自定义校验组件',
          props: {
            placeholder: '输入 ok 则校验通过',
          },
          rules: [
            {
              isValidator: true,
              message: '请输入 ok，其他内容 check 不通过',
              trigger: ['change', 'blur'],
              validator: 'validateCustomCheck',
            },
          ],
          type: 'custom-validate-input',
        },
      ],
    },
  ],
  script: `const { defineExpose } = nada;

function validateCustomCheck(_rule, value, callback) {
  if (value === 'ok') {
    callback?.();
    return Promise.resolve();
  }

  const error = new Error('请输入 ok，其他内容 check 不通过');
  callback?.(error);
  return Promise.reject(error);
}

defineExpose({
  validateCustomCheck,
});`,
};

function syncMaterialVisible(visible: boolean) {
  if (visible) {
    showCustomValidateComponent();
    return;
  }

  hideCustomValidateComponent();
}

onMounted(() => {
  syncMaterialVisible(true);
  designerRef.value?.setData(pageSchema);
});

onActivated(() => {
  syncMaterialVisible(true);
});

onDeactivated(() => {
  syncMaterialVisible(false);
});

onBeforeUnmount(() => {
  syncMaterialVisible(false);
});

function handleSubmit(e: PageSchema) {
  console.log(e);
}
</script>
<template>
  <EDesigner
    ref="designerRef"
    :business-field-loader="businessFieldLoader"
    :model-id="DEMO_MODEL_ID"
    title="自定义校验组件示例（受控模式）"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>自定义校验组件通过脚本 validator 生效</div>
    </template>
  </EDesigner>
</template>

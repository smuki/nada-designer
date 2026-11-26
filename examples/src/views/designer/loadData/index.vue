<script lang="ts" setup>
import type { PageSchema } from '@nada-designer/types';

import { onMounted, ref } from 'vue';

import { EDesigner } from '@nada-designer/core';

import { businessFieldLoader, DEMO_MODEL_ID } from '../shared/propertyCatalog';

const designerRef = ref<InstanceType<typeof EDesigner>>();

/** 受控页面数据：字段必须来自业务对象元数据，根节点为 form */
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
        colon: true,
        labelAlign: 'right',
        labelLayout: 'fixed',
        labelWidth: 100,
        layout: 'horizontal',
        name: 'default',
      },
      type: 'form',
      children: [
        {
          children: [
            {
              children: [
                {
                  field: 'u_姓名',
                  id: 'input_name',
                  input: true,
                  label: '姓名',
                  props: {
                    placeholder: '请输入',
                  },
                  rules: [
                    {
                      message: '必填项',
                      required: true,
                      trigger: ['change'],
                      type: 'string',
                    },
                  ],
                  type: 'input',
                },
              ],
              id: 'col_name',
              props: {
                span: 12,
              },
              type: 'col',
            },
            {
              children: [
                {
                  field: 'u_年龄',
                  id: 'number_age',
                  input: true,
                  label: '年龄',
                  props: {
                    placeholder: '请输入',
                    style: {
                      width: '100%',
                    },
                  },
                  rules: [
                    {
                      message: '必填项',
                      required: true,
                      trigger: ['change'],
                      type: 'number',
                    },
                  ],
                  type: 'number',
                },
              ],
              id: 'col_age',
              props: {
                span: 12,
              },
              type: 'col',
            },
          ],
          id: 'row_main',
          label: '栅格布局',
          type: 'row',
        },
        {
          field: 'u_个人简介',
          id: 'input_about',
          input: true,
          label: '个人简介',
          props: {
            placeholder: '请输入',
          },
          type: 'input',
        },
      ],
    },
  ],
  script:
    "const { defineExpose, find } = nada;\n\nfunction test (){\n    console.log('test')\n}\n\n// 通过defineExpose暴露的函数或者属性\ndefineExpose({\n test\n})",
};

onMounted(() => {
  designerRef.value?.setData(pageSchema);
});

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
    title="nadaDesigner数据回显示例（受控模式）"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>通过 setData 回显一份受控页面（字段来自业务对象元数据）</div>
    </template>
  </EDesigner>
</template>

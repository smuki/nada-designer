<script lang="ts" setup>
import type { PageSchema } from '@nada-designer/types';

import { onMounted, ref } from 'vue';

import { EDesigner } from '@nada-designer/core';
import { pluginManager } from '@nada-designer/manager';

import { businessFieldLoader, DEMO_MODEL_ID } from '../shared/propertyCatalog';

// 模拟器api返回数据
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        about:
          '性格沉稳内敛，做事踏实细致，平日里偏爱在安静的时光里读书、钻研小事，待人谦和真诚，不张扬却始终带着一份认真，在生活里守着自己的节奏，简单而坚定地走好每一步。',
        age: 18,
        name: '张三',
      });
    }, 300);
  });
};

pluginManager.publicMethods.add({
  handler: fetchData,
  name: 'fetchData',
});

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
        labelWidth: 100,
        name: 'default',
      },
      type: 'form',
      children: [
        {
          field: 'u_姓名',
          id: 'input_name',
          input: true,
          label: '姓名',
          props: {
            placeholder: '请输入',
          },
          type: 'input',
        },
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
          type: 'number',
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
        {
          id: 'button_4338',
          label: '调用API回显数据',
          on: {
            click: [
              {
                componentId: null,
                methodName: 'test',
                type: 'custom',
              },
            ],
          },
          props: {
            type: 'primary',
          },
          type: 'button',
        },
      ],
    },
  ],
  script: `const { defineExpose, find } = nada;

async function test (){
    const data = await nada.publicMethods.fetchData()
    find('u_姓名','field').setValue(data.name)
    find('u_年龄','field').setValue(data.age)
    find('u_个人简介','field').setValue(data.about)
}

// 通过defineExpose暴露的函数或者属性
defineExpose({
 test
})`,
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
    title="nadaDesigner公共方法示例（受控模式）"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>点击画布中的按钮，通过公共方法拉取数据并回填字段</div>
    </template>
  </EDesigner>
</template>

<script lang="ts" setup>
import type { ComponentSchema, FormDataModel } from '@nada-designer/types';

import type { VNode } from 'vue';

import { computed, ref } from 'vue';

import { provideBuilderDisabled, useForm } from '@nada-designer/hooks';
import { Form as TForm } from 'tdesign-vue-next';

interface TDesignFormInstance {
  clearValidate: (fields?: string[]) => void;
  getData?: () => FormDataModel;
  reset: (params?: Record<string, unknown>) => void;
  resetData?: () => void;
  setData?: (data: FormDataModel) => void;
  validate: (params?: Record<string, unknown>) => Promise<unknown>;
  validateOnly: (params?: Record<string, unknown>) => Promise<unknown>;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    componentSchema: ComponentSchema;
    disabled?: boolean;
    scrollToFirstError?: boolean;
  }>(),
  {
    componentSchema: () => ({ type: '' }),
    disabled: false,
    scrollToFirstError: false,
  },
);

provideBuilderDisabled(computed(() => props.disabled));

const form = ref<null | TDesignFormInstance>(null);
const { formData, formInstances } = useForm(
  props.componentSchema?.props?.name ?? 'default',
);

/**
 * 获取表单数据
 */
function getData(): FormDataModel {
  return formData;
}

/**
 * 设置表单数据
 */
function setData(data: FormDataModel): void {
  Object.assign(formData, data);
}

/**
 * 重置表单数据
 */
function resetData(): void {
  form.value?.reset();
}

/**
 * 校验表单数据
 * @description TDesign 的 validate 在校验失败时 resolve 结果对象，设计器契约要求 reject，这里做一次语义转换
 */
async function validate(): Promise<unknown> {
  const result = await form.value?.validate();
  if (result !== true) {
    throw result;
  }
  return result;
}

// form组件需要特殊处理：把 TDesign 的实例方法替换为设计器契约方法并注册到表单实例表
const mountedForm = (vNode: VNode) => {
  form.value = vNode.component?.exposed as TDesignFormInstance;

  if (
    props.componentSchema?.type === 'form' &&
    formInstances.value &&
    form.value
  ) {
    const name =
      props.componentSchema?.props?.name ??
      props.componentSchema?.name ??
      ('default' as string);

    form.value.validate = validate;
    formInstances.value[name] = form.value;
    form.value.getData = getData;
    form.value.setData = setData;
    form.value.resetData = resetData;
    return false;
  }
};

const formProps = computed<Record<string, any>>(() => {
  const recordProps = (props.componentSchema?.props ?? {}) as Record<
    string,
    unknown
  >;
  return {
    ...recordProps,
    scrollToFirstError: props.scrollToFirstError ? 'smooth' : undefined,
  };
});

const children = computed(() => {
  return props.componentSchema?.children ?? [];
});

// 阻止 TDesign 原生 submit 链路（Enter 键）触发业务动作
function onSubmit(): void {}

defineExpose({
  form,
  getData,
  resetData,
  setData,
  validate,
});
</script>
<template>
  <TForm
    ref="form"
    v-bind="formProps"
    :data="formData"
    prevent-submit-default
    @submit="onSubmit"
    @vue:mounted="mountedForm"
  >
    <slot name="edit-node">
      <template v-if="children.length > 0">
        <slot
          v-for="node in children"
          :key="node.id"
          name="node"
          :component-schema="node"
        ></slot>
      </template>
    </slot>
  </TForm>
</template>

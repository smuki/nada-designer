<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed } from 'vue';

import { Button as TButton, Dialog as TDialog } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

// 定义 props
const props = withDefaults(
  defineProps<{
    cancelText?: string;
    componentSchema?: ComponentSchema;
    hideConfirm?: boolean;
    modelValue?: boolean;
    okText?: string;
    width?: string;
  }>(),
  {
    cancelText: '关闭',
    componentSchema: () => ({
      type: 'modal',
    }),
    hideConfirm: false,
    modelValue: false,
    okText: '确定',
    width: '600px',
  },
);
// 定义 emits
const emit = defineEmits(['ok', 'close', 'update:modelValue']);

const children = computed(() => props.componentSchema?.children ?? []);

function handleOk() {
  emit('ok');
}

function handleClose() {
  emit('close');
}

function updateVisible(value: boolean) {
  emit('update:modelValue', value);
}
</script>

<template>
  <TDialog
    v-bind="$attrs"
    :visible="props.modelValue"
    :header="props.componentSchema?.label ?? ''"
    :width="props.width"
    attach="body"
    :destroy-on-close="true"
    @update:visible="updateVisible"
  >
    <slot name="edit-node">
      <template v-if="children.length > 0">
        <slot
          v-for="node in children"
          name="node"
          :component-schema="node"
        ></slot>
      </template>
    </slot>
    <template #footer>
      <div class="ep-tdesign-modal-footer">
        <TButton theme="default" variant="outline" @click="handleClose">
          {{ props.cancelText }}
        </TButton>
        <TButton v-if="!props.hideConfirm" theme="primary" @click="handleOk">
          {{ props.okText }}
        </TButton>
      </div>
    </template>
  </TDialog>
</template>

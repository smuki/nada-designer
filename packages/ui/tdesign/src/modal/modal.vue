<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { Button as TButton, Dialog as TDialog } from 'tdesign-vue-next';

import { sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

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
    // 缺省视为「直接使用」（设计器外壳的预览/动作弹窗），走懒渲染与 title 回退
    componentSchema: undefined,
    hideConfirm: false,
    modelValue: false,
    okText: '确定',
    width: '600px',
  },
);
// 定义 emits
const emit = defineEmits(['ok', 'close', 'update:modelValue']);
// 定义 props
const attrs = useAttrs();
const dialogProps = computed(() => {
  const raw = sanitizeAttrs(TDialog, attrs as Record<string, unknown>);
  // TDesign Dialog 用 header 而不是 title；title 仅用于直接使用时的标题回退
  delete raw.title;
  return raw;
});

// 组件面板场景取 schema label；设计器预览/动作弹窗等直接使用场景取 title
const dialogHeader = computed(() => {
  return props.componentSchema?.label ?? (attrs.title as string) ?? '';
});

const children = computed(() => props.componentSchema?.children ?? []);

// 设计器外壳直接使用弹窗（预览、动作配置等）时懒渲染，避免隐藏弹窗提前挂载重内容
const isDirectUse = computed(() => !props.componentSchema);

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
    v-bind="dialogProps"
    :visible="props.modelValue"
    :header="dialogHeader"
    :width="props.width"
    attach="body"
    :destroy-on-close="true"
    :lazy="isDirectUse"
    @update:visible="updateVisible"
  >
    <!-- 直接使用场景（预览弹窗、动作配置弹窗）依赖默认插槽，需优先渲染 -->
    <slot>
      <slot name="edit-node">
        <template v-if="children.length > 0">
          <slot
            v-for="node in children"
            name="node"
            :component-schema="node"
          ></slot>
        </template>
      </slot>
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

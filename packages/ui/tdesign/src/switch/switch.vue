<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { Switch as TSwitch } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() => {
  const raw = { ...(attrs as Record<string, unknown>) };
  // 属性面板 / 旧 schema 可能给布尔开关传入对象（如 element 的 autosize: { maxRows, minRows }）
  if (raw.modelValue !== null && typeof raw.modelValue === 'object') {
    raw.modelValue = true;
  }
  return sanitizeAttrs(TSwitch, normalizeSize(raw));
});
</script>

<template>
  <TSwitch v-bind="bindProps" />
</template>

<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { Button as TButton } from 'tdesign-vue-next';

import { normalizeButtonAttrs, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() =>
  sanitizeAttrs(
    TButton,
    normalizeButtonAttrs(attrs as Record<string, unknown>),
  ),
);
</script>

<template>
  <TButton v-bind="bindProps">
    <!-- 设计器头部等场景会直接使用该组件并传默认插槽（图标 + 文案），需优先渲染插槽 -->
    <slot>{{ props.componentSchema?.label }}</slot>
  </TButton>
</template>

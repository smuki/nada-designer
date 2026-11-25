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
  <TButton v-bind="bindProps">{{ props.componentSchema?.label }}</TButton>
</template>

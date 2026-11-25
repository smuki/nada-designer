<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { CheckboxGroup as TCheckboxGroup } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() =>
  sanitizeAttrs(
    TCheckboxGroup,
    normalizeSize(attrs as Record<string, unknown>),
  ),
);
</script>

<template>
  <TCheckboxGroup v-bind="bindProps" />
</template>

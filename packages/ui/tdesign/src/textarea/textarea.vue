<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { Textarea as TTextarea } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() =>
  sanitizeAttrs(TTextarea, normalizeSize(attrs as Record<string, unknown>)),
);
</script>

<template>
  <TTextarea v-bind="bindProps" />
</template>

<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { Select as TSelect } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() =>
  sanitizeAttrs(TSelect, normalizeSize(attrs as Record<string, unknown>)),
);
</script>

<template>
  <TSelect v-bind="bindProps" />
</template>

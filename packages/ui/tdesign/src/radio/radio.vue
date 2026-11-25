<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { RadioGroup as TRadioGroup } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() =>
  sanitizeAttrs(TRadioGroup, normalizeSize(attrs as Record<string, unknown>)),
);
</script>

<template>
  <TRadioGroup v-bind="bindProps" />
</template>

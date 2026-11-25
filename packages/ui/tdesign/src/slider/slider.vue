<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { Slider as TSlider } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();

const attrs = useAttrs();
const bindProps = computed(() =>
  sanitizeAttrs(TSlider, normalizeSize(attrs as Record<string, unknown>)),
);
</script>

<template>
  <TSlider v-bind="bindProps" />
</template>

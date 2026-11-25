<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Slider as TSlider } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TSlider v-bind="$attrs" />
</template>

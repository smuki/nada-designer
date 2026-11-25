<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { ColorPicker as TColorPicker } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TColorPicker v-bind="$attrs" />
</template>

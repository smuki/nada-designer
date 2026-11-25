<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { TimePicker as TTimePicker } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TTimePicker v-bind="$attrs" />
</template>

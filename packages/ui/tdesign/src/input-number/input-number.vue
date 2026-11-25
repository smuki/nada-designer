<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { InputNumber as TInputNumber } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TInputNumber v-bind="$attrs" />
</template>

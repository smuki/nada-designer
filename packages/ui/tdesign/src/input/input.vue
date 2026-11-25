<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Input as TInput } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TInput v-bind="$attrs" />
</template>

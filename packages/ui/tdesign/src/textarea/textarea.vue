<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Textarea as TTextarea } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TTextarea v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Select as TSelect } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TSelect v-bind="$attrs" />
</template>

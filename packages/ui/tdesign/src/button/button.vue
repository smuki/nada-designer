<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Button as TButton } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TButton v-bind="$attrs">{{ props.componentSchema?.label }}</TButton>
</template>

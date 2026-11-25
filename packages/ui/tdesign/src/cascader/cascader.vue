<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Cascader as TCascader } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TCascader v-bind="$attrs" />
</template>

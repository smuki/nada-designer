<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { Switch as TSwitch } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TSwitch v-bind="$attrs" />
</template>

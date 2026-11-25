<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { CheckboxGroup as TCheckboxGroup } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TCheckboxGroup v-bind="$attrs" />
</template>

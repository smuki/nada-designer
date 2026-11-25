<script setup lang="ts">
import type { ComponentSchema } from '@nada-designer/types';

import { RadioGroup as TRadioGroup } from 'tdesign-vue-next';

defineOptions({ inheritAttrs: false });

defineProps<{ componentSchema?: ComponentSchema }>();
</script>

<template>
  <TRadioGroup v-bind="$attrs" />
</template>

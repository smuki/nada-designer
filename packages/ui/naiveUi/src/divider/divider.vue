<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import type { PropType } from 'vue';

import { computed } from 'vue';

const props = defineProps({
  componentSchema: {
    default: () => ({}),
    type: Object as PropType<ComponentSchema>,
  },
});

/** 分隔线样式：线型 / 颜色 / 粗细 / 上下间距 */
const style = computed(() => {
  const p = props.componentSchema?.props ?? {};
  return {
    borderTop: `${p.thickness ?? 1}px ${p.type ?? 'solid'} ${p.color ?? '#dcdfe6'}`,
    margin: `${p.margin ?? 8}px 0`,
  };
});
</script>
<template>
  <div class="ep-divider" :style="style"></div>
</template>

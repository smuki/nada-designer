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

/** 展示内容：优先 props.content，其次节点 label */
const content = computed<string>(
  () =>
    props.componentSchema?.props?.content ?? props.componentSchema?.label ?? '',
);

/** 展示样式：对齐 / 字号 / 颜色 */
const style = computed(() => ({
  color: props.componentSchema?.props?.color,
  fontSize: `${props.componentSchema?.props?.fontSize ?? 14}px`,
  textAlign: props.componentSchema?.props?.align ?? 'left',
}));
</script>
<template>
  <div class="ep-text-block" :style="style">{{ content }}</div>
</template>

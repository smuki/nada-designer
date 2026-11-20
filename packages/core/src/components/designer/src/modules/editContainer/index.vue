<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { useDesignerContext } from '@nada-designer/hooks';

import NadaEditScreenContainer from './editScreenContainer.vue';
import NadaNodeItem from './nodeItem.vue';
import NadaPreviewWidgets from './previewWidgets.vue';

const nadaEditRangeRef = ref<HTMLDivElement | null>(null);
const nadaPreviewWidgetsRef = ref<null | typeof NadaPreviewWidgets>(null);

const { pageSchema, props } = useDesignerContext();
const rootSchema = computed(() => {
  return pageSchema.schemas[0];
});

const getEditRangestyle = computed(() => {
  const padding =
    typeof props.canvasPadding === 'number'
      ? `${props.canvasPadding}px`
      : props.canvasPadding;
  return {
    height: '100%',
    padding,
    width: '100%',
  };
});

onMounted(() => {
  nadaPreviewWidgetsRef.value?.handleInit(nadaEditRangeRef.value);
});
</script>
<template>
  <section class="ep-edit-canvas">
    <NadaEditScreenContainer>
      <div
        ref="nadaEditRangeRef"
        class="ep-edit-range relative overflow-auto rounded-md"
        :style="getEditRangestyle"
      >
        <NadaNodeItem :schema="rootSchema" />
        <NadaPreviewWidgets ref="nadaPreviewWidgetsRef" />
      </div>
    </NadaEditScreenContainer>
  </section>
</template>

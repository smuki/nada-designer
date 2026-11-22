<script lang="ts" setup>
import type { DesignerProps, PageSchema } from '@nada-designer/types';

import {
  computed,
  nextTick,
  onUnmounted,
  provide,
  ref,
  watch,
  watchEffect,
} from 'vue';

import { EpDesignerLoader } from '@nada-designer/base-ui';
import {
  createEventBus,
  DESIGNER_CONTEXT_KEY,
  providePageManager,
  useBusinessFields,
  useStore,
} from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import { setupPanel } from '@nada-designer/panel-ui';
import {
  deepClone,
  loadAsyncComponent,
  migrateComponentProps,
} from '@nada-designer/utils';

import { useDesigner } from '../hooks/useDesigner';
import { useHotkeys } from '../hooks/useHotkeys';
import NadaPreview from './modules/preview/index.vue';

const props = withDefaults(defineProps<DesignerProps>(), {
  canvasMode: 'desktop',
  canvasPadding: 16,
  designMode: 'free',
  disabledZoom: false,
  draggable: true,
  formMode: false,
  hiddenHeader: false,
  lockDefaultSchemaEdit: false,
  showHiddenItems: true,
  title: 'nadaDesigner默认项目',
});
const emit = defineEmits([
  'ready',
  'save',
  'reset',
  'imported',
  'toggleDeviceMode',
]);

setupPanel(pluginManager);
const EHeader = loadAsyncComponent(() => import('./modules/header/index.vue'));
const EActivityBar = loadAsyncComponent(
  () => import('./modules/activityBar/index.vue'),
);
const EEditContainer = loadAsyncComponent(
  () => import('./modules/editContainer/index.vue'),
);
const ERightSidebar = loadAsyncComponent(
  () => import('./modules/rightSidebar/index.vue'),
);
const epBuilderSlot = pluginManager.component.get('epBuilderSlot');

const previewRef = ref<InstanceType<typeof NadaPreview> | null>(null);

/**
 * 冻结的设计模式：初始化读一次，之后 prop 变化仅告警（规格 §5.2）
 */
const designMode: 'controlled' | 'free' =
  props.designMode === 'controlled' ? 'controlled' : 'free';

watch(
  () => props.designMode,
  (next) => {
    const nextMode = next === 'controlled' ? 'controlled' : 'free';
    if (nextMode !== designMode) {
      console.warn(
        `[受控字段] designMode 初始化后不可切换，已忽略 ${String(next)}`,
      );
    }
  },
);

const {
  applyBusinessObject,
  handleDelete,
  handleDuplicate,
  pageManager,
  pageSchema,
  ready,
  reset,
  revoke,
  setHoverNode,
  setSelectedNode,
  state,
} = useDesigner(props, emit, designMode);

/**
 * 业务字段元数据（受控模式）
 */
const businessFields = useBusinessFields(pageSchema, {
  getComponentConfig: (type) =>
    pluginManager.component.getComponentConfigByType(type),
  loader: (businessObject) => {
    const loader = props.businessFieldLoader;
    if (!loader) {
      return Promise.reject(new Error('未提供 businessFieldLoader'));
    }
    return loader(businessObject);
  },
});
const {
  error: metaError,
  isLoading: metaLoading,
  retry: retryBusinessFields,
  status: metaStatus,
  switchTo: switchBusinessObject,
} = businessFields;

if (designMode === 'controlled') {
  const initialBusinessObject =
    props.defaultSchema?.businessObject ?? props.businessObject;
  void businessFields.load(initialBusinessObject ?? '');
}

/** 首屏门控：UI 初始化中，或受控元数据首次加载中 */
const initLoading = computed(
  () =>
    !pluginManager.designer.initialized.value ||
    (!ready.value && metaLoading.value),
);

/** 首屏被元数据阻塞（error / empty），显示提示 + 重试 */
const metaBlocked = computed(
  () =>
    designMode === 'controlled' &&
    !ready.value &&
    metaStatus.value !== 'loading' &&
    metaStatus.value !== 'ready',
);

/** 阻塞态提示文案 */
const metaBlockedMessage = computed(
  () => metaError.value || '业务字段元数据未就绪',
);

const { setTarget } = useHotkeys({
  emit,
  handleDelete,
  pageSchema,
  revoke,
  setSelectedNode,
  state,
});

// 记录缩放状态 start
const { disabledZoom } = useStore();
watchEffect(() => {
  disabledZoom.value = props.disabledZoom;
});
// 记录缩放状态 end

createEventBus();

provide(DESIGNER_CONTEXT_KEY, {
  businessFields,
  designMode,
  handleDelete,
  handleDuplicate,
  handleImported,
  handleToggleDeviceMode,
  pageSchema,
  preview: handlePreview,
  props,
  reset,
  revoke,
  save: handleSave,
  setDisabledHover,
  setHoverNode,
  setSelectedNode,
  state,
});
providePageManager(pageManager);
const designerRef = ref<HTMLElement | null>(null);

/**
 * 组件（包含异步组件）加载完成后
 */
function handleReady() {
  nextTick(() => {
    ready.value = true;
    designerRef.value && setTarget(designerRef.value);

    designerRef.value?.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    emit('ready', pageManager);
  });
}

/**
 * 设置hover状态
 * @param disabledHover
 */
async function setDisabledHover(disabledHover = false) {
  state.disabledHover = disabledHover;
}

/**
 * 接受一个PageSchema对象作为参数。根据传入的schemas和script属性，更新页面对应的数据
 */
function setData(schema: PageSchema) {
  // 迁移 componentProps 到 props
  migrateComponentProps(schema);
  pageManager.setPageSchema(schema);
  // deepCompareAndModify 会删除缺失键，必须回填业务对象归属（规格 §11.1）
  applyBusinessObject(schema.businessObject);
  if (designMode === 'controlled') {
    void switchBusinessObject(pageSchema.businessObject);
  }
  setSelectedNode();
  revoke.push('加载数据');
}

/**
 * 返回当前页面数据的 PageSchema 对象，包含页面当前的 schemas 和 script 数据。
 */
function getData(): PageSchema {
  // 返回一个对象，包含当前 schemas 对象的普通对象表示和当前 script 的值
  return deepClone(pageSchema);
}

/**
 * 保存数据
 */
function handleSave() {
  emit('save', getData());
}

function handleToggleDeviceMode(mode: string) {
  emit('toggleDeviceMode', mode);
}

/**
 * 导入数据事件
 * @param data
 */
function handleImported(data: PageSchema) {
  emit('imported', data);
}

/**
 * 预览
 */
function handlePreview() {
  previewRef.value!.handleOpen();
}

function handleWheel(event: WheelEvent) {
  if (event.ctrlKey) {
    // 按下ctrl键时，禁止浏览器默认操作
    event.preventDefault();
  }
}

onUnmounted(() => {
  designerRef.value?.removeEventListener('wheel', handleWheel);
});

defineExpose({
  exportHistory: revoke.exportHistory,
  getData,
  importHistory: revoke.importHistory,
  preview: handlePreview,
  reset,
  revoke,
  save: handleSave,
  setData,
});
</script>
<template>
  <div v-if="initLoading" class="ep-loading-box">
    <EpDesignerLoader />
  </div>
  <div v-else-if="metaBlocked" class="ep-loading-box ep-meta-blocked">
    <div class="text-center">
      <div class="mb-3">{{ metaBlockedMessage }}</div>
      <div
        class="ep-meta-retry inline-flex cursor-pointer items-center rounded border px-3 py-1"
        @click="retryBusinessFields()"
      >
        重试
      </div>
    </div>
  </div>
  <Suspense v-else @resolve="handleReady">
    <template #default>
      <div
        class="ep-designer-main ep-scoped"
        @mouseover="setHoverNode()"
        ref="designerRef"
        tabindex="0"
      >
        <div class="ep-header-container" v-if="!props.hiddenHeader">
          <slot name="header">
            <EHeader @preview="handlePreview" @save="handleSave">
              <template #header>
                <slot name="header-prefix"></slot>
              </template>
              <template #prefix>
                <slot name="header-prefix"></slot>
              </template>
              <template #title>
                <slot name="header-title"></slot>
              </template>
              <template #right-prefix>
                <slot name="header-right-prefix"></slot>
              </template>
              <template #right-action>
                <slot name="header-right-action"></slot>
              </template>
              <template #right-suffix>
                <slot name="header-right-suffix"></slot>
              </template>
            </EHeader>
          </slot>
        </div>
        <div
          class="ep-split-view-container"
          :class="{ 'hidden-header': hiddenHeader }"
        >
          <EActivityBar />
          <EEditContainer />
          <ERightSidebar />
        </div>
        <NadaPreview
          ref="previewRef"
          :hide-confirm="props.hidePreviewConfirm"
        />
        <component v-if="epBuilderSlot" :is="epBuilderSlot" />
      </div>
    </template>
    <template #fallback>
      <div class="ep-loading-box">
        <EpDesignerLoader />
      </div>
    </template>
  </Suspense>
</template>

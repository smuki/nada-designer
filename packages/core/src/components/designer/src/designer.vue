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
  findSchemas,
  loadAsyncComponent,
  migrateComponentProps,
  validateControlledPage,
} from '@nada-designer/utils';

import { useDesigner } from '../hooks/useDesigner';
import { useHotkeys } from '../hooks/useHotkeys';
import NadaPreview from './modules/preview/index.vue';

const props = withDefaults(defineProps<DesignerProps>(), {
  canvasMode: 'desktop',
  canvasPadding: 16,
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
const epBuilderSlot = pluginManager.component.get('epBuilderSlot');

const previewRef = ref<InstanceType<typeof NadaPreview> | null>(null);

const {
  applyModelId,
  handleDelete,
  handleDuplicate,
  pageManager,
  pageSchema,
  ready,
  reset,
  revoke,
  selectionVersion,
  setHoverNode,
  setSelectedNode,
  state,
} = useDesigner(props, emit);

/**
 * 业务字段元数据（受控模式）
 */
const businessFields = useBusinessFields(pageSchema, {
  getComponentConfig: (type) => {
    const config = pluginManager.component.getComponentConfigByType(type);
    if (!config) return undefined;
    // 适配成 hook 需要的精简结构（attribute 在 config 下，editConstraints 在顶层）
    return {
      attribute: config.config?.attribute,
      defaultSchema: config.defaultSchema,
      editConstraints: config.editConstraints,
    };
  },
  loader: (modelId) => {
    const loader = props.businessFieldLoader;
    if (!loader) {
      return Promise.reject(new Error('未提供 businessFieldLoader'));
    }
    return loader(modelId);
  },
});
const {
  error: metaError,
  isLoading: metaLoading,
  retry: retryBusinessFields,
  status: metaStatus,
  switchTo: switchModelId,
} = businessFields;

/** modelId 变化（撤销/历史恢复等）时同步元数据 */
watch(
  () => pageSchema.modelId,
  (next) => {
    if (!next) return;
    if (next === businessFields.modelId.value) return;
    void switchModelId(next);
  },
);

const initialModelId = props.defaultSchema?.modelId ?? props.modelId;
void businessFields.load(initialModelId ?? '');

/** 首屏门控：UI 初始化中，或受控元数据首次加载中 */
const initLoading = computed(
  () =>
    !pluginManager.designer.initialized.value ||
    (!ready.value && metaLoading.value),
);

/** 首屏被元数据阻塞（error / empty），显示提示 + 重试 */
const metaBlocked = computed(
  () =>
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
  handleDelete,
  handleDuplicate,
  handleImported,
  handleToggleDeviceMode,
  importSchema,
  pageSchema,
  preview: handlePreview,
  props,
  reset,
  revoke,
  save: handleSave,
  selectionVersion,
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
 * 应用 PageSchema 数据（迁移 + 写回 + 选中 + 撤销）
 * @param schema 页面数据
 */
function applyPageSchemaData(schema: PageSchema) {
  // 迁移 componentProps 到 props
  migrateComponentProps(schema);
  pageManager.setPageSchema(schema);
  // deepCompareAndModify 会删除缺失键，必须回填业务对象归属（规格 §11.1）
  applyModelId(schema.modelId);
  setSelectedNode();
  revoke.push('加载数据');
}

/**
 * 导入页面数据
 * @description 受控模式先做页面校验并加载目标业务对象元数据，失败不应用（规格 §11.3）
 * @param data 页面数据
 */
async function importSchema(data: PageSchema): Promise<boolean> {
  const nextModelId = data.modelId ?? props.modelId;

  const issues = validateControlledPage(data.schemas);
  if (issues.length > 0) {
    pluginManager.global.$message.error(
      `导入校验未通过：${issues[0]?.message ?? ''}`,
    );
    return false;
  }

  if (nextModelId && nextModelId !== businessFields.modelId.value) {
    const ok = await switchModelId(nextModelId);
    if (!ok) {
      pluginManager.global.$message.error(
        '业务字段元数据加载失败，未应用本次导入',
      );
      return false;
    }
  }

  applyPageSchemaData(data);
  handleImported(getData());
  return true;
}

/**
 * 接受一个PageSchema对象作为参数。根据传入的schemas和script属性，更新页面对应的数据
 * @description 受控模式下若业务对象与当前不同：乐观应用，元数据加载失败则回滚（规格 D39）
 * @param schema 页面数据
 */
function setData(schema: PageSchema) {
  const issues = validateControlledPage(schema.schemas);
  if (issues.length > 0) {
    pluginManager.global.$message.error(
      `页面不符合受控模式规范：${issues[0]?.message ?? ''}，已拒绝加载`,
    );
    return;
  }

  const nextModelId = schema.modelId ?? props.modelId;
  if (!nextModelId || nextModelId === businessFields.modelId.value) {
    applyPageSchemaData(schema);
    return;
  }

  // 受控 + 切换对象：先应用（乐观），失败再回滚
  const previous = getData();
  applyPageSchemaData(schema);
  void switchModelId(nextModelId).then((ok) => {
    if (ok) return;

    pageManager.setPageSchema(previous);
    applyModelId(previous.modelId);
    setSelectedNode();
    pluginManager.global.$message.error(
      '业务字段元数据加载失败，已回滚本次数据',
    );
  });
}

/**
 * 异步应用 PageSchema 数据
 * @description 受控模式先加载目标业务对象元数据，失败不应用本次数据（规格 D39）
 * @param schema 页面数据
 */
async function setDataAsync(schema: PageSchema): Promise<boolean> {
  const nextModelId = schema.modelId ?? props.modelId;

  if (nextModelId && nextModelId !== businessFields.modelId.value) {
    const ok = await switchModelId(nextModelId);
    if (!ok) {
      pluginManager.global.$message.error(
        '业务字段元数据加载失败，未应用本次数据',
      );
      return false;
    }
  }

  applyPageSchemaData(schema);
  return true;
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
  // 节点字段不在元数据中仅警告，不阻止保存（规格 §11.3 / D27）
  const knownProperties = businessFields.propertyMap.value;
  const unknownProperties = new Set<string>();
  findSchemas(getData().schemas, (node) => {
    if (node.input === true && node.field && !knownProperties.has(node.field)) {
      unknownProperties.add(node.field);
    }
    return false;
  });
  if (unknownProperties.size > 0) {
    console.warn(
      `[受控字段] 以下字段不在当前业务对象元数据中：${[...unknownProperties].join('、')}`,
    );
  }

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
  setDataAsync,
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
          <!-- 属性 / 样式 / 事件 已移到左侧活动栏，右侧栏不再渲染 -->
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

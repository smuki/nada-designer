<script lang="ts" setup>
import type { ComponentSchema, FieldMeta } from '@nada-designer/types';

import { computed, onMounted, onUnmounted, ref } from 'vue';

import { EpTooltip, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext, useStore } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  convertKFormData,
  findSchemaById,
  findSchemaInfoById,
  generateNewSchema,
  migrateComponentProps,
} from '@nada-designer/utils';

import NadaPreviewJson from './previewJson.vue';

const Select = pluginManager.component.get('select');
const Input = pluginManager.component.get('input');

const { canvasScale, disabledZoom } = useStore();
const designer = useDesignerContext();
const pageSchema = designer.pageSchema;
const revoke = designer.revoke;
const previewJson = ref<InstanceType<typeof NadaPreviewJson> | null>(null);

/** 受控模式：字段/布局选择器（左面板不再常驻，改工具栏弹层） */
const isControlled = designer.designMode === 'controlled';
const businessFields = designer.businessFields;

const pickerOpen = ref(false);
const pickerTab = ref<'fields' | 'layouts'>('fields');
const pickerKeyword = ref('');
const pickerRef = ref<HTMLElement | null>(null);
const pickerTriggerRef = ref<HTMLElement | null>(null);
/** 多选中的业务字段（按 field 记录，支持批量插入） */
const selectedFields = ref<string[]>([]);

/** 受控模式允许插入的布局组件白名单 */
const LAYOUT_WHITELIST = new Set(['card', 'form', 'row', 'tabs']);

/** 可插入的业务字段（按 label 搜索） */
const pickerFields = computed(() => {
  const fields = businessFields.fields.value;
  const keyword = pickerKeyword.value.trim();
  return keyword
    ? fields.filter((item) => item.label.includes(keyword))
    : fields;
});

/** 当前作用域内已放置字段（置灰不可选） */
const placedFields = computed(
  () =>
    new Set(businessFields.getPlacedFields(designer.state.selectedNode?.id)),
);

/** 可插入的布局组件 */
const pickerLayouts = computed(() => {
  const seen = new Set<string>();
  const list: ComponentSchema[] = [];

  pluginManager.component.getComponentSchemaGroups().value.forEach((group) => {
    group.list.forEach((item) => {
      if (!LAYOUT_WHITELIST.has(item.type) || seen.has(item.type)) return;
      seen.add(item.type);
      list.push(item);
    });
  });

  if (!seen.has('form')) {
    const formSchema =
      pluginManager.component.getComponentConfigByType('form')?.defaultSchema;
    if (formSchema) {
      list.unshift(formSchema);
    }
  }

  const keyword = pickerKeyword.value.trim();
  return keyword
    ? list.filter((item) => (item.label ?? '').includes(keyword))
    : list;
});

function togglePicker() {
  pickerOpen.value = !pickerOpen.value;
  if (pickerOpen.value) {
    pickerTab.value = 'fields';
    pickerKeyword.value = '';
    selectedFields.value = [];
  }
}

function switchPickerTab(tab: 'fields' | 'layouts') {
  pickerTab.value = tab;
  pickerKeyword.value = '';
  selectedFields.value = [];
}

function closePicker() {
  pickerOpen.value = false;
  selectedFields.value = [];
}

/**
 * 在选中节点之后（或容器末尾）插入节点
 * @param node 节点 schema
 */
function insertNode(node: ComponentSchema): boolean {
  const targetId = designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id;
  if (!targetId) return false;

  const data = findSchemaInfoById(pageSchema.schemas, targetId);
  if (!data) return false;

  let { index, schema: checkedSchema, list } = data;
  if (
    checkedSchema.children &&
    !pluginManager.component.getConfigByType(checkedSchema.type)
      ?.editConstraints?.childImmovable
  ) {
    list = checkedSchema.children;
    index = list.length - 1;
  }

  list.splice(index + 1, 0, node);
  designer.setSelectedNode(node);
  return true;
}

/**
 * 切换字段选中状态
 * @param meta 业务字段元数据
 */
function toggleField(meta: FieldMeta) {
  if (placedFields.value.has(meta.field)) {
    pluginManager.global.$message.info(`字段「${meta.label}」已放置`);
    return;
  }

  const index = selectedFields.value.indexOf(meta.field);
  selectedFields.value =
    index === -1
      ? [...selectedFields.value, meta.field]
      : selectedFields.value.filter((field) => field !== meta.field);
}

/**
 * 批量插入选中的业务字段（保持面板顺序，合并为一条撤销记录）
 */
function handleInsertSelectedFields() {
  if (selectedFields.value.length === 0) return;

  // 按元数据顺序插入，保证与面板顺序一致
  const metas = businessFields.fields.value.filter((meta) =>
    selectedFields.value.includes(meta.field),
  );

  const failures: string[] = [];
  let insertedCount = 0;
  let targetId = designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id;

  metas.forEach((meta) => {
    const result = businessFields.insertField(meta, {
      onInserted: (node) => {
        // 连续插入：下一个字段插到上一个之后，保持顺序
        targetId = node.id;
      },
      targetId,
    });

    if (result.ok) {
      insertedCount += 1;
    } else {
      failures.push(result.message ?? meta.label);
    }
  });

  if (insertedCount > 0) {
    const lastNode = targetId
      ? findSchemaById(pageSchema.schemas, targetId)
      : undefined;
    if (lastNode) {
      designer.setSelectedNode(lastNode);
    }
    revoke.push('插入业务字段', true);
  }

  if (failures.length > 0) {
    pluginManager.global.$message.warning(
      `部分字段未插入：${failures[0]}${failures.length > 1 ? ` 等 ${failures.length} 项` : ''}`,
    );
  }

  closePicker();
}

/**
 * 插入布局组件
 * @param item 组件 defaultSchema
 */
function handleInsertLayout(item: ComponentSchema) {
  if (insertNode(generateNewSchema(item))) {
    revoke.push('插入组件', true);
    closePicker();
  }
}

function handleDocumentMousedown(event: MouseEvent) {
  if (!pickerOpen.value) return;
  const target = event.target as Node;
  if (
    pickerRef.value?.contains(target) ||
    pickerTriggerRef.value?.contains(target)
  ) {
    return;
  }
  closePicker();
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMousedown);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleDocumentMousedown);
});

const deviceOptions = [
  {
    icon: 'icon--nada--computer-outline-rounded',
    key: 'desktop',
    title: 'pc',
  },
  {
    icon: 'icon--nada--tablet-android-outline-rounded',
    key: 'tablet',
    title: '平板',
  },
  {
    icon: 'icon--nada--phone-iphone-outline-sharp',
    key: 'mobile',
    title: '手机',
  },
];

const actionOptions = computed(() => {
  return [
    {
      icon: 'icon--nada--code',
      on: handlePreviewJSON,
      title: '查看数据',
    },
    {
      icon: 'icon--nada--exit-to-app-rounded',
      on: handleOpenFileSelector,
      title: '导入数据',
    },
    {
      icon: 'icon--nada--trash',
      on: designer.reset,
      title: '清空',
    },
    {
      disabled: revoke.recordList.value.length === 0,
      divider: true,
      icon: 'icon--nada--undo',
      on: handleUndo,
      title: '撤销',
    },
    {
      disabled: revoke.undoList.value.length === 0,
      icon: 'icon--nada--redo',
      on: handleRedo,
      title: '重做',
    },
    {
      divider: true,
      icon: 'icon--nada--eye',
      on: designer.preview,
      show: () => designer.props.hiddenHeader,
      title: '预览',
    },
    {
      icon: 'icon--nada--save-outline-rounded',
      on: designer.save,
      show: () => designer.props.hiddenHeader,
      title: '保存',
    },
  ];
});

// 兼容旧数据的映射关系
const legacyModeMap = {
  mobile: 'mobile',
  pad: 'tablet',
  pc: 'desktop',
} as const;

const canvasConfigs = {
  desktop: {},
  mobile: {
    mode: 'mobile',
    width: '390px',
  },
  // 保留旧配置以兼容旧数据
  pad: {
    mode: 'tablet',
    width: '780px',
  },
  pc: {
    mode: 'desktop',
  },
  tablet: {
    mode: 'tablet',
    width: '780px',
  },
};

// 规范化模式值，将旧模式枚举转换为新模式枚举
function normalizeMode(
  mode: string | undefined,
): 'desktop' | 'mobile' | 'tablet' {
  if (!mode) return 'desktop';

  // 如果是旧模式枚举，转换为新模式枚举
  if (mode in legacyModeMap) {
    return legacyModeMap[mode as keyof typeof legacyModeMap];
  }

  // 如果已经是新模式枚举，直接返回
  if (['desktop', 'mobile', 'tablet'].includes(mode)) {
    return mode as 'desktop' | 'mobile' | 'tablet';
  }

  // 默认返回 desktop
  return 'desktop';
}

const selectedKey = computed({
  get() {
    const currentMode = pageSchema.canvas?.mode;
    return normalizeMode(currentMode);
  },
  set(type: string) {
    designer.handleToggleDeviceMode(type);
    pageSchema.canvas = canvasConfigs[type];
  },
});

const fileRef = ref<HTMLInputElement | null>(null);
const canvasScaleComuted = computed({
  get() {
    return `${(canvasScale.value * 100).toFixed(0)}%`;
  },
  set(value) {
    const percentage = Number.parseFloat(value);
    canvasScale.value = percentage / 100;
  },
});

const canvasScaleOptions = [
  {
    label: '60%',
    value: '60%',
  },
  {
    label: '80%',
    value: '80%',
  },
  {
    label: '100%',
    value: '100%',
  },
  {
    label: '120%',
    value: '120%',
  },
  {
    label: '140%',
    value: '140%',
  },
];

function isShow(show: any) {
  // show属性为function类型则执行
  if (typeof show === 'function') {
    return show();
  }

  return true;
}

/**
 * 撤销操作
 */
function handleUndo() {
  revoke.undo();
}

/**
 * 重做操作
 */
function handleRedo() {
  revoke.redo();
}

// 预览数据
function handlePreviewJSON() {
  previewJson.value!.handleOpen();
}

/**
 * 打开文件选择器
 */
function handleOpenFileSelector() {
  fileRef.value?.click();
}

// 选择文件
function handleFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  e.target.value = null;

  // 通过json文件导入
  const reader = new FileReader();
  reader.readAsText(file);
  reader.addEventListener('load', (res) => {
    handleImportData(res.target?.result as string);
  });
}

/**
 * 导入数据
 */
async function handleImportData(content?: string) {
  // 导入JSON
  try {
    let schema = JSON.parse(content ?? '');

    // k-form 旧数据转换会丢 businessObject，先取出再透传
    const businessObject =
      typeof schema?.businessObject === 'string'
        ? schema.businessObject
        : undefined;

    if (!schema.schemas) {
      // 兼容 处理kform表单数据
      schema = convertKFormData(schema);
    }
    if (businessObject && !schema.businessObject) {
      schema.businessObject = businessObject;
    }

    // 迁移旧的 canvas mode 数据
    if (schema.canvas?.mode) {
      const currentMode = schema.canvas.mode;
      if (currentMode in legacyModeMap) {
        schema.canvas.mode =
          legacyModeMap[currentMode as keyof typeof legacyModeMap];
      }
    }

    // 迁移旧的 componentProps 数据
    migrateComponentProps(schema);

    // 受控模式会先校验并加载元数据，失败不应用（规格 §11.3）
    await designer.importSchema(schema);
  } catch (error) {
    console.error(error);
    pluginManager.global.$message.error('导入失败：数据格式异常');
  }
}

/**
 * 设置画布宽高
 * @param type
 */
function handleSetCanvas(type: string) {
  designer.handleToggleDeviceMode(type);
  selectedKey.value = type;
}
</script>
<template>
  <!-- 工具条 start  -->
  <div class="ep-edit-toolbar flex items-center justify-between px-2">
    <!-- 操作按钮 start  -->
    <div class="flex h-full flex-1 items-center">
      <!-- 受控模式：字段/布局选择器 start -->
      <div v-if="isControlled" class="relative flex h-full items-center">
        <EpTooltip content="添加字段/组件">
          <div
            ref="pickerTriggerRef"
            class="ep-action-item h-90% px-10px flex cursor-pointer items-center text-base"
            @click="togglePicker"
          >
            <NadaIcon name="icon--nada--extension-outline" />
          </div>
        </EpTooltip>
        <div v-if="pickerOpen" ref="pickerRef" class="ep-field-picker">
          <div class="ep-field-picker-tabs">
            <div
              :class="{ active: pickerTab === 'fields' }"
              @click="switchPickerTab('fields')"
            >
              业务字段
            </div>
            <div
              :class="{ active: pickerTab === 'layouts' }"
              @click="switchPickerTab('layouts')"
            >
              布局
            </div>
          </div>
          <div class="ep-field-picker-search">
            <Input
              v-model="pickerKeyword"
              v-model:value="pickerKeyword"
              placeholder="搜索"
              clearable
              allow-clear
            />
          </div>
          <div class="ep-field-picker-list">
            <template v-if="pickerTab === 'fields'">
              <div
                v-for="meta in pickerFields"
                :key="meta.field"
                class="ep-field-picker-item"
                :class="{
                  disabled: placedFields.has(meta.field),
                  selected: selectedFields.includes(meta.field),
                }"
                :title="meta.field"
                @click="toggleField(meta)"
              >
                <span class="ep-field-picker-check">
                  {{ selectedFields.includes(meta.field) ? '✓' : '' }}
                </span>
                <span class="flex-1 truncate">{{ meta.label }}</span>
                <span class="ep-field-picker-type">{{ meta.type }}</span>
              </div>
              <div
                v-if="pickerFields.length === 0"
                class="ep-field-picker-empty"
              >
                没有匹配的字段
              </div>
            </template>
            <template v-else>
              <div
                v-for="item in pickerLayouts"
                :key="item.type"
                class="ep-field-picker-item"
                @click="handleInsertLayout(item)"
              >
                <span class="truncate">{{ item.label }}</span>
              </div>
              <div
                v-if="pickerLayouts.length === 0"
                class="ep-field-picker-empty"
              >
                没有匹配的组件
              </div>
            </template>
          </div>
          <div
            v-if="pickerTab === 'fields' && selectedFields.length > 0"
            class="ep-field-picker-footer"
          >
            <div
              class="ep-field-picker-apply"
              @click="handleInsertSelectedFields"
            >
              插入 {{ selectedFields.length }} 个字段
            </div>
          </div>
        </div>
      </div>
      <!-- 受控模式：字段/布局选择器 end -->
      <template v-for="(action, index) in actionOptions" :key="index">
        <div
          v-if="action.divider && isShow(action.show)"
          class="ep-divider"
        ></div>
        <EpTooltip :content="action.title">
          <div
            v-if="isShow(action.show)"
            class="ep-action-item h-90% px-10px flex cursor-pointer items-center text-base"
            :class="{ disabled: action.disabled }"
            @click="action.on"
          >
            <NadaIcon :name="action.icon" />
          </div>
        </EpTooltip>
      </template>
    </div>
    <!-- 操作按钮 end  -->

    <input
      v-show="false"
      ref="fileRef"
      type="file"
      accept=".json,.txt"
      @change="handleFileSelected"
    />

    <div class="flex h-full flex-1 items-center justify-end">
      <!-- 缩放操作 start  -->
      <div v-if="!disabledZoom" class="ml-12px flex items-center">
        <div class="pr-8px w-82px cursor-pointer">
          <Select
            v-model:value="canvasScaleComuted"
            v-model="canvasScaleComuted"
            :options="canvasScaleOptions"
            size="small"
          />
        </div>
      </div>
      <!-- 缩放操作 end  -->
      <!-- 画布类型切换 start -->
      <div
        class="ep-device h-28px p-2px flex items-center gap-1 rounded-md border"
      >
        <template v-for="item in deviceOptions" :key="item.key">
          <div
            :title="item.title"
            class="ep-device-item rounded-$ep-radius flex h-full cursor-pointer items-center px-1 text-base transition-colors"
            :class="{ checked: item.key === selectedKey }"
            @click="handleSetCanvas(item.key)"
          >
            <NadaIcon :name="item.icon" />
          </div>
        </template>
      </div>
      <!-- 画布类型切换 end -->
    </div>
  </div>
  <NadaPreviewJson ref="previewJson" />
  <!-- 工具条 end  -->
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { EpTooltip, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext, useStore } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import { convertKFormData, migrateComponentProps } from '@nada-designer/utils';

import NadaPreviewJson from './previewJson.vue';

const Select = pluginManager.component.get('select');

const { canvasScale, disabledZoom } = useStore();
const designer = useDesignerContext();
const pageSchema = designer.pageSchema;
const revoke = designer.revoke;
const previewJson = ref<InstanceType<typeof NadaPreviewJson> | null>(null);

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
      <template v-for="(action, index) in actionOptions" :key="index">
        <div
          v-if="action.divider && isShow(action.show)"
          class="ep-divider"
        ></div>
        <EpTooltip :content="action.title">
          <div
            v-if="isShow(action.show)"
            class="ep-action-item h-90% px-10px flex cursor-pointer items-center text-[20px]"
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
            class="ep-device-item rounded-$ep-radius flex h-full cursor-pointer items-center px-1 text-[20px] transition-colors"
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

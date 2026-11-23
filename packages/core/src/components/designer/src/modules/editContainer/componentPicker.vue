<script lang="ts" setup>
import type { ComponentSchema, FieldMeta } from '@nada-designer/types';

import { computed, ref, watch, watchEffect } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { EpCollapse, EpCollapsePanel, NadaIcon } from '@nada-designer/base-ui';
import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  findSchemaInfoById,
  generateNewSchema,
  mapFieldDataType,
} from '@nada-designer/utils';
import { useStorage } from '@vueuse/core';

/** 选择器条目：输入/布局组件用 schema，业务字段用 field */
interface PickerItem {
  field?: FieldMeta;
  icon: string;
  key: string;
  label: string;
  schema?: ComponentSchema;
}

interface PickerGroup {
  items: PickerItem[];
  title: string;
}

const props = withDefaults(
  defineProps<{
    /** input 输入类组件 / layout 布局类组件 / field 业务字段 */
    mode?: 'field' | 'input' | 'layout';
  }>(),
  { mode: 'input' },
);

const emit = defineEmits(['close']);

const Input = pluginManager.component.get('input');
const Select = pluginManager.component.get('select');
const designer = useDesignerContext();
const revoke = designer.revoke;
const pageSchema = designer.pageSchema;
const businessFields = designer.businessFields;
const groups = pluginManager.component.getComponentSchemaGroups();

/** 布局类组件（其余归为输入类） */
const LAYOUT_TYPES = new Set(['card', 'form', 'row', 'tabs']);

const FIELD_TYPE_LABELS: Record<FieldMeta['type'], string> = {
  boolean: '开关',
  date: '日期',
  money: '金额',
  number: '数值',
  ref: '引用',
  text: '文本',
  list: '列表',
};

const keyword = ref('');
const activeKeys = useStorage('ep-component-view-keys', []);
const selectedKeys = ref<string[]>([]);

/** 字段类型下拉：全部 + 各分组 */
const ALL_CATEGORY = '全部';
const category = ref(ALL_CATEGORY);
const categoryOptions = computed(() => {
  const titles: string[] = [];
  businessFields.fields.value.forEach((meta) => {
    const title = meta.group?.trim() || FIELD_TYPE_LABELS[meta.type] || '其他';
    if (!titles.includes(title)) titles.push(title);
  });
  return [
    {
      label: `全部（${businessFields.fields.value.length}）`,
      value: ALL_CATEGORY,
    },
    ...titles.map((title) => ({ label: title, value: title })),
  ];
});

const isFieldMode = computed(() => props.mode === 'field');
const isLayoutMode = computed(() => props.mode === 'layout');

const pickerTitle = computed(() => {
  if (isFieldMode.value) return '添加字段';
  return isLayoutMode.value ? '添加布局组件' : '添加输入组件';
});

const placedFields = computed(
  () =>
    new Set(businessFields.getPlacedFields(designer.state.selectedNode?.id)),
);

/**
 * 组件 defaultSchema → 选择器条目
 * @param schema 组件 defaultSchema
 */
function toComponentItem(schema: ComponentSchema): PickerItem {
  return {
    icon: pluginManager.component.getConfigByType(schema.type).icon ?? '',
    key: schema.type,
    label: schema.label ?? schema.type,
    schema,
  };
}

/**
 * 业务字段 → 选择器条目
 * @param meta 业务字段元数据
 */
function toFieldItem(meta: FieldMeta): PickerItem {
  const componentType = mapFieldDataType(meta.type);
  return {
    field: meta,
    icon: componentType ? pluginManager.component.getIcon(componentType) : '',
    key: meta.field,
    label: meta.label,
  };
}

/** 业务字段分组（按元数据 group，缺省按数据类型） */
const fieldGroups = computed<PickerGroup[]>(() => {
  const groupMap = new Map<string, PickerItem[]>();

  businessFields.fields.value.forEach((meta) => {
    if (!meta.label.includes(keyword.value)) return;
    const title = meta.group?.trim() || FIELD_TYPE_LABELS[meta.type] || '其他';
    if (category.value !== ALL_CATEGORY && title !== category.value) return;
    const items = groupMap.get(title) ?? [];
    items.push(toFieldItem(meta));
    groupMap.set(title, items);
  });

  return [...groupMap.entries()].map(([title, items]) => ({ title, items }));
});

/** 组件分组（按注册表分组；布局模式只保留布局类） */
const componentGroups = computed<PickerGroup[]>(() => {
  return groups.value
    .map((group) => ({
      title: group.title,
      items: group.list
        .filter((item) => {
          if (!item.label?.includes(keyword.value)) return false;
          const isLayout = LAYOUT_TYPES.has(item.type);
          return isLayoutMode.value ? isLayout : !isLayout;
        })
        .map(toComponentItem),
    }))
    .filter((group) => group.items.length > 0);
});

/** 实际展示的分组；布局模式平铺（数量少，不分组） */
const pickerGroups = computed<PickerGroup[]>(() => {
  if (isFieldMode.value) return fieldGroups.value;
  if (isLayoutMode.value) {
    const items = componentGroups.value.flatMap((group) => group.items);
    return items.length > 0 ? [{ title: '布局', items }] : [];
  }
  return componentGroups.value;
});

/** 布局模式平铺列表 */
const layoutFlatItems = ref<PickerItem[]>([]);
watchEffect(() => {
  layoutFlatItems.value = isLayoutMode.value
    ? (pickerGroups.value[0]?.items ?? [])
    : [];
});

/** 字段模式平铺列表（不折叠，按类型下拉筛选） */
const fieldFlatItems = ref<PickerItem[]>([]);
watchEffect(() => {
  fieldFlatItems.value = isFieldMode.value
    ? fieldGroups.value.flatMap((group) => group.items)
    : [];
});

/** 当前是否有可展示条目 */
const hasItems = computed(() => {
  if (isLayoutMode.value) return layoutFlatItems.value.length > 0;
  if (isFieldMode.value) return fieldFlatItems.value.length > 0;
  return pickerGroups.value.length > 0;
});

/** 按面板顺序排列的已选 key */
const orderedSelectedKeys = computed(() => {
  const allKeys: string[] = [];

  if (isFieldMode.value) {
    businessFields.fields.value.forEach((meta) => allKeys.push(meta.field));
  } else {
    groups.value.forEach((group) => {
      group.list.forEach((item) => allKeys.push(item.type));
    });
  }

  return allKeys.filter((key) => selectedKeys.value.includes(key));
});

function isSelected(key: string): boolean {
  return selectedKeys.value.includes(key);
}

/**
 * 条目是否已放置（业务字段）
 * @param item 选择器条目
 */
function isPlaced(item: PickerItem): boolean {
  return Boolean(item.field && placedFields.value.has(item.field.field));
}

/**
 * 切换条目选中状态
 * @param item 选择器条目
 */
function toggleItem(item: PickerItem) {
  if (isPlaced(item)) {
    pluginManager.global.$message.info(`字段「${item.label}」已放置`);
    return;
  }
  selectedKeys.value = selectedKeys.value.includes(item.key)
    ? selectedKeys.value.filter((key) => key !== item.key)
    : [...selectedKeys.value, item.key];
}

/**
 * 拖拽克隆：业务字段产出落点占位节点，组件产出新节点
 * @param item 选择器条目
 */
function cloneItem(item: PickerItem): ComponentSchema {
  if (item.field) {
    return {
      __businessField: item.field,
      id: `__pending_${item.field.field}`,
      label: item.label,
      type: '__pending',
    } as ComponentSchema;
  }
  return generateNewSchema(item.schema as ComponentSchema);
}

/**
 * 获取当前选中节点之后的插入位置
 */
function getInsertTarget() {
  const targetId = designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id;
  if (!targetId) return null;

  const data = findSchemaInfoById(pageSchema.schemas, targetId);
  if (!data) return null;

  let { index, schema: checkedSchema, list } = data;
  if (
    checkedSchema.children &&
    !pluginManager.component.getConfigByType(checkedSchema.type)
      ?.editConstraints?.childImmovable
  ) {
    list = checkedSchema.children;
    index = list.length - 1;
  }
  return { index, list };
}

/** 批量插入已选条目 */
function handleConfirm() {
  if (orderedSelectedKeys.value.length === 0) return;

  let targetId = designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id;
  let lastNode: ComponentSchema | null = null;
  const failures: string[] = [];

  if (isFieldMode.value) {
    orderedSelectedKeys.value.forEach((key) => {
      const meta = businessFields.fieldMap.value.get(key);
      if (!meta) return;
      const result = businessFields.insertField(meta, {
        onInserted: (node) => {
          targetId = node.id;
          lastNode = node;
        },
        targetId,
      });
      if (!result.ok) {
        failures.push(result.message ?? meta.label);
      }
    });
  } else {
    const target = getInsertTarget();
    if (target) {
      orderedSelectedKeys.value.forEach((key) => {
        const defaultSchema =
          pluginManager.component.getComponentConfigByType(key)?.defaultSchema;
        if (!defaultSchema) return;

        const node = generateNewSchema(defaultSchema);
        target.list.splice(target.index + 1, 0, node);
        target.index += 1;
        lastNode = node;
      });
    }
  }

  if (lastNode) {
    designer.setSelectedNode(lastNode);
    revoke.push(isFieldMode.value ? '插入业务字段' : '插入组件', true);
  }

  if (failures.length > 0) {
    pluginManager.global.$message.warning(
      `部分字段未插入：${failures[0]}${failures.length > 1 ? ` 等 ${failures.length} 项` : ''}`,
    );
  }

  emit('close');
}

// 画布发生任何插入/选中（例如拖拽落点）后自动收起
watch(
  () => designer.selectionVersion.value,
  () => emit('close'),
);
</script>
<template>
  <div class="ep-component-picker" @mousedown.stop>
    <div class="ep-component-picker-header">
      <span class="ep-component-picker-title">{{ pickerTitle }}</span>
      <span class="ep-component-picker-close" @click="emit('close')">×</span>
    </div>
    <div class="ep-component-picker-search">
      <div v-if="isFieldMode" class="ep-component-picker-category">
        <Select
          v-model="category"
          v-model:value="category"
          :options="categoryOptions"
          size="small"
        />
      </div>
      <div class="ep-component-picker-search-input">
        <Input
          v-model="keyword"
          v-model:value="keyword"
          placeholder="搜索"
          size="small"
          clearable
          allow-clear
        />
      </div>
    </div>
    <div class="ep-component-picker-body">
      <!-- 布局组件：数量少，平铺不分组 -->
      <VueDraggable
        v-if="isLayoutMode"
        v-model="layoutFlatItems"
        :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
        :sort="false"
        :animation="180"
        ghost-class="moving"
        :clone="cloneItem"
        item-key="key"
        class="ep-component-picker-grid"
      >
        <div
          v-for="item in layoutFlatItems"
          :key="item.key"
          class="ep-component-picker-item"
          :class="{ selected: isSelected(item.key) }"
          @click="toggleItem(item)"
        >
          <span class="ep-component-picker-check">
            {{ isSelected(item.key) ? '✓' : '' }}
          </span>
          <NadaIcon :name="item.icon" />
          <span class="ep-component-picker-label">{{ item.label }}</span>
        </div>
      </VueDraggable>
      <!-- 业务字段：平铺展示（不折叠），按类型下拉筛选 -->
      <VueDraggable
        v-else-if="isFieldMode"
        v-model="fieldFlatItems"
        :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
        :sort="false"
        :animation="180"
        ghost-class="moving"
        :clone="cloneItem"
        item-key="key"
        class="ep-component-picker-grid"
      >
        <div
          v-for="item in fieldFlatItems"
          :key="item.key"
          class="ep-component-picker-item"
          :class="{
            disabled: isPlaced(item),
            selected: isSelected(item.key),
          }"
          :title="item.field?.field"
          @click="toggleItem(item)"
        >
          <span class="ep-component-picker-check">
            {{ isSelected(item.key) ? '✓' : '' }}
          </span>
          <NadaIcon :name="item.icon" />
          <span class="ep-component-picker-label">{{ item.label }}</span>
          <span v-if="item.field" class="ep-component-picker-type">
            {{ item.field.type }}
          </span>
        </div>
      </VueDraggable>
      <!-- 输入组件：按分组展示 -->
      <EpCollapse
        v-else
        :default-expand-all="!activeKeys.length"
        v-model="activeKeys"
      >
        <EpCollapsePanel
          v-for="group in pickerGroups"
          :name="group.title"
          :title="group.title"
          :key="group.title"
        >
          <VueDraggable
            v-model="group.items"
            :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
            :sort="false"
            :animation="180"
            ghost-class="moving"
            :clone="cloneItem"
            item-key="key"
            class="ep-component-picker-grid"
          >
            <div
              v-for="item in group.items"
              :key="item.key"
              class="ep-component-picker-item"
              :class="{
                disabled: isPlaced(item),
                selected: isSelected(item.key),
              }"
              :title="item.field?.field"
              @click="toggleItem(item)"
            >
              <span class="ep-component-picker-check">
                {{ isSelected(item.key) ? '✓' : '' }}
              </span>
              <NadaIcon :name="item.icon" />
              <span class="ep-component-picker-label">{{ item.label }}</span>
              <span v-if="item.field" class="ep-component-picker-type">
                {{ item.field.type }}
              </span>
            </div>
          </VueDraggable>
        </EpCollapsePanel>
      </EpCollapse>
      <div v-if="!hasItems" class="ep-component-picker-empty">
        没有查询到的{{ isFieldMode ? '字段' : '组件' }}
      </div>
    </div>
    <div class="ep-component-picker-footer">
      <span class="ep-component-picker-tip">
        可直接拖到画布，或勾选多个后插入
      </span>
      <span
        class="ep-component-picker-confirm"
        :class="{ disabled: orderedSelectedKeys.length === 0 }"
        @click="handleConfirm"
      >
        插入 {{ orderedSelectedKeys.length }} 个{{
          isFieldMode ? '字段' : '组件'
        }}
      </span>
    </div>
  </div>
</template>
<style scoped lang="less">
.ep-component-picker {
  position: absolute;
  top: 8px;
  left: 46px;
  /* 低于各 UI 库下拉浮层（antd 1050 / element、naive 2000+），避免类型下拉被面板盖住 */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 340px;
  max-height: 70vh;
  padding: 10px 12px;
  background: var(--ep-canvas-container-background, #fff);
  border: 1px solid var(--ep-border);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 14%);
}

.ep-component-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ep-border);
}

.ep-component-picker-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--ep-text-main);
}

.ep-component-picker-close {
  color: var(--ep-text-helper);
  cursor: pointer;

  &:hover {
    color: var(--ep-text-main);
  }
}

.ep-component-picker-search {
  display: flex;
  gap: 8px;
  padding: 8px 0;
}

.ep-component-picker-category {
  flex-shrink: 0;
  width: 120px;

  :deep(.ant-select),
  :deep(.el-select),
  :deep(.n-select) {
    width: 100%;
  }
}

.ep-component-picker-search-input {
  flex: 1;
  min-width: 0;
}

.ep-component-picker-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.ep-component-picker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 2px;
}

.ep-component-picker-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  color: var(--ep-text-main);
  cursor: pointer;
  background-color: var(--ep-secondary);
  border: 1px solid transparent;
  border-radius: var(--ep-radius);
  content-visibility: auto;
  contain-intrinsic-size: 36px;

  .iconfont {
    margin-right: 2px;
    color: var(--ep-text-secondary);
    font-size: 16px;
  }

  &:hover {
    color: var(--ep-primary);
    background-color: var(--ep-primary-faded);
    border-color: var(--ep-primary);

    .iconfont {
      color: var(--ep-primary);
    }
  }

  &.selected {
    color: var(--ep-primary);
    background-color: var(--ep-primary-faded);
    border-color: var(--ep-primary);

    .iconfont {
      color: var(--ep-primary);
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.45;

    &:hover {
      color: var(--ep-text-main);
      background-color: var(--ep-secondary);
      border-color: transparent;

      .iconfont {
        color: var(--ep-text-secondary);
      }
    }
  }
}

.ep-component-picker-check {
  width: 12px;
  flex-shrink: 0;
  text-align: center;
  color: var(--ep-primary);
}

.ep-component-picker-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ep-component-picker-type {
  flex-shrink: 0;
  color: var(--ep-text-helper);
  font-size: 12px;
}

.ep-component-picker-empty {
  padding: 24px;
  color: var(--ep-text-helper);
  text-align: center;
}

.ep-component-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--ep-border);
}

.ep-component-picker-tip {
  color: var(--ep-text-helper);
  font-size: 12px;
}

.ep-component-picker-confirm {
  padding: 6px 14px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  background: var(--ep-primary);
  border-radius: var(--ep-radius);

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>

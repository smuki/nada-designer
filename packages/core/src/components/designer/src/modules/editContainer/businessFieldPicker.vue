<script lang="ts" setup>
import type { ComponentSchema, FieldMeta } from '@nada-designer/types';

import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useDesignerContext } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  findSchemaById,
  findSchemaInfoById,
  generateNewSchema,
} from '@nada-designer/utils';

const emit = defineEmits(['close']);

const designer = useDesignerContext();
const pageSchema = designer.pageSchema;
const revoke = designer.revoke;
const businessFields = designer.businessFields;

const Select = pluginManager.component.get('select');
const Input = pluginManager.component.get('input');

/** 允许插入的布局组件白名单 */
const LAYOUT_WHITELIST = new Set(['card', 'form', 'row', 'tabs']);

/** 字段类型 → 展示分类 */
const FIELD_TYPE_LABELS: Record<FieldMeta['type'], string> = {
  boolean: '开关',
  date: '日期',
  money: '金额',
  number: '数值',
  ref: '引用',
  text: '文本',
  list: '列表',
};

const ALL_CATEGORY = '全部';
const RECENT_CATEGORY = '最近使用';
const LAYOUT_CATEGORY = '布局组件';
const GRID_RENDER_LIMIT = 300;

const keyword = ref('');
const category = ref(ALL_CATEGORY);
const onlySelected = ref(false);
const selectedFields = ref<string[]>([]);
const selectedLayouts = ref<string[]>([]);
/** 当前打开「⋯」菜单的项（field 或 layout type） */
const menuKey = ref<null | string>(null);
const recentFields = ref<string[]>([]);

/** 当前作用域内已放置字段 */
const placedFields = computed(
  () =>
    new Set(businessFields.getPlacedFields(designer.state.selectedNode?.id)),
);

/** 可插入的布局组件 */
const layoutItems = computed(() => {
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
  return list;
});

/** 业务字段分类：优先元数据 group，否则按数据类型 */
const fieldGroups = computed(() => {
  const groups = new Map<string, FieldMeta[]>();
  businessFields.fields.value.forEach((meta) => {
    const key = meta.group?.trim() || FIELD_TYPE_LABELS[meta.type] || '其他';
    const list = groups.get(key) ?? [];
    list.push(meta);
    groups.set(key, list);
  });
  return [...groups.entries()].map(([key, fields]) => ({ fields, key }));
});

/** 最近使用字段 */
const recentFieldItems = computed(() => {
  const fieldMap = new Map(
    businessFields.fields.value.map((item) => [item.field, item]),
  );
  return recentFields.value
    .map((field) => fieldMap.get(field))
    .filter(Boolean) as FieldMeta[];
});

/** 分类下拉选项 */
const categoryOptions = computed(() => {
  const options = [{ label: ALL_CATEGORY, value: ALL_CATEGORY }];
  if (recentFieldItems.value.length > 0) {
    options.push({ label: RECENT_CATEGORY, value: RECENT_CATEGORY });
  }
  fieldGroups.value.forEach((group) => {
    options.push({
      label: `${group.key}（${group.fields.length}）`,
      value: group.key,
    });
  });
  options.push({ label: LAYOUT_CATEGORY, value: LAYOUT_CATEGORY });
  return options;
});

/** 当前分类下可展示的字段 */
const visibleFields = computed(() => {
  if (category.value === LAYOUT_CATEGORY) return [];

  let fields = businessFields.fields.value;
  if (category.value === RECENT_CATEGORY) {
    fields = recentFieldItems.value;
  } else if (category.value !== ALL_CATEGORY) {
    fields =
      fieldGroups.value.find((group) => group.key === category.value)?.fields ??
      [];
  }

  const search = keyword.value.trim();
  if (search) {
    fields = fields.filter((item) => item.label.includes(search));
  }
  if (onlySelected.value) {
    fields = fields.filter((item) => selectedFields.value.includes(item.field));
  }
  return fields.slice(0, GRID_RENDER_LIMIT);
});

/** 当前分类下可展示的布局组件 */
const visibleLayouts = computed(() => {
  if (category.value !== LAYOUT_CATEGORY) return [];
  let items = layoutItems.value;
  const search = keyword.value.trim();
  if (search) {
    items = items.filter((item) => (item.label ?? '').includes(search));
  }
  if (onlySelected.value) {
    items = items.filter((item) => selectedLayouts.value.includes(item.type));
  }
  return items.slice(0, GRID_RENDER_LIMIT);
});

/** 已选数量（字段 + 布局） */
const selectedCount = computed(
  () => selectedFields.value.length + selectedLayouts.value.length,
);

const hasMore = computed(() => {
  if (category.value === LAYOUT_CATEGORY) return false;
  return (
    !keyword.value.trim() &&
    !onlySelected.value &&
    (category.value === ALL_CATEGORY
      ? businessFields.fields.value.length
      : (fieldGroups.value.find((group) => group.key === category.value)?.fields
          .length ?? 0)) > GRID_RENDER_LIMIT
  );
});

/** 读取最近使用字段 */
function loadRecentFields() {
  const businessObject = businessFields.businessObject.value;
  if (!businessObject) return;
  try {
    const raw = localStorage.getItem(
      `ep-controlled-recent-fields:${businessObject}`,
    );
    recentFields.value = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    recentFields.value = [];
  }
}

/**
 * 记录最近使用的字段
 * @param fields 本次插入的字段
 */
function rememberRecent(fields: FieldMeta[]) {
  const businessObject = businessFields.businessObject.value;
  if (!businessObject || fields.length === 0) return;

  const merged = [...fields.map((item) => item.field), ...recentFields.value];
  const unique: string[] = [];
  merged.forEach((field) => {
    if (!unique.includes(field)) unique.push(field);
  });
  recentFields.value = unique.slice(0, 12);

  try {
    localStorage.setItem(
      `ep-controlled-recent-fields:${businessObject}`,
      JSON.stringify(recentFields.value),
    );
  } catch {
    // 忽略存储异常
  }
}

/**
 * 切换字段选中状态
 * @param meta 业务字段
 */
function toggleField(meta: FieldMeta) {
  if (placedFields.value.has(meta.field)) {
    pluginManager.global.$message.info(`字段「${meta.label}」已放置`);
    return;
  }
  selectedFields.value = selectedFields.value.includes(meta.field)
    ? selectedFields.value.filter((field) => field !== meta.field)
    : [...selectedFields.value, meta.field];
}

/**
 * 切换布局组件选中状态
 * @param item 组件 defaultSchema
 */
function toggleLayout(item: ComponentSchema) {
  selectedLayouts.value = selectedLayouts.value.includes(item.type)
    ? selectedLayouts.value.filter((type) => type !== item.type)
    : [...selectedLayouts.value, item.type];
}

function isFieldSelected(field: string): boolean {
  return selectedFields.value.includes(field);
}

function isLayoutSelected(type: string): boolean {
  return selectedLayouts.value.includes(type);
}

/**
 * 在目标节点之后插入节点
 * @param node 节点 schema
 * @param targetId 目标节点 id
 */
function insertNodeAt(
  node: ComponentSchema,
  targetId?: null | string,
): boolean {
  const resolvedTargetId = targetId ?? pageSchema.schemas[0]?.id;
  if (!resolvedTargetId) return false;

  const data = findSchemaInfoById(pageSchema.schemas, resolvedTargetId);
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
  return true;
}

/** 确定：批量插入已选字段与布局组件 */
function handleConfirm() {
  if (selectedCount.value === 0) return;

  const insertedMetas: FieldMeta[] = [];
  const failures: string[] = [];
  let insertedCount = 0;
  let targetId = designer.state.selectedNode?.id ?? pageSchema.schemas[0]?.id;

  // 字段按元数据顺序插入
  businessFields.fields.value
    .filter((meta) => selectedFields.value.includes(meta.field))
    .forEach((meta) => {
      const result = businessFields.insertField(meta, {
        onInserted: (node) => {
          targetId = node.id;
        },
        targetId,
      });
      if (result.ok) {
        insertedCount += 1;
        insertedMetas.push(meta);
      } else {
        failures.push(result.message ?? meta.label);
      }
    });

  // 布局组件按白名单顺序插入
  layoutItems.value
    .filter((item) => selectedLayouts.value.includes(item.type))
    .forEach((item) => {
      const node = generateNewSchema(item);
      if (insertNodeAt(node, targetId)) {
        insertedCount += 1;
        targetId = node.id ?? targetId;
      }
    });

  if (insertedCount > 0) {
    rememberRecent(insertedMetas);
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

  emit('close');
}

function handleCancel() {
  emit('close');
}

/**
 * 复制字段名 / 组件名到剪贴板（文本复制不受受控限制）
 * @param value 文本
 */
async function copyText(value: string) {
  try {
    await navigator.clipboard?.writeText(value);
    pluginManager.global.$message.success('已复制');
  } catch {
    pluginManager.global.$message.warning('复制失败');
  }
  menuKey.value = null;
}

/**
 * 「⋯」更多操作菜单
 * @param key 菜单标识
 */
function toggleMenu(key: string) {
  menuKey.value = menuKey.value === key ? null : key;
}

/**
 * 新建自定义字段（当前版本只支持选择已有字段）
 */
function handleNewCustomField() {
  pluginManager.global.$message.info(
    '新建自定义字段需在业务系统中维护，当前版本只支持选择已有字段',
  );
}

function handleDocumentMousedown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    !target?.closest?.('.ep-field-more') &&
    !target?.closest?.('.ep-field-menu')
  ) {
    menuKey.value = null;
  }
}

onMounted(() => {
  loadRecentFields();
  document.addEventListener('mousedown', handleDocumentMousedown);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleDocumentMousedown);
});
</script>
<template>
  <Teleport to="body">
    <div class="ep-field-modal-mask" @mousedown.self="handleCancel">
      <div class="ep-field-modal" @mousedown.stop>
        <!-- 标题栏 -->
        <div class="ep-field-modal-header">
          <span class="ep-field-modal-title">添加字段</span>
          <span class="ep-field-modal-close" @click="handleCancel">×</span>
        </div>

        <!-- 筛选栏 -->
        <div class="ep-field-modal-filter">
          <div class="ep-field-modal-category">
            <Select
              v-model="category"
              v-model:value="category"
              :options="categoryOptions"
              :teleported="false"
              size="small"
            />
          </div>
          <div class="ep-field-modal-search">
            <Input
              v-model="keyword"
              v-model:value="keyword"
              placeholder="搜索字段名称"
              size="small"
              clearable
              allow-clear
            />
          </div>
          <div class="ep-field-modal-selected">
            <span class="ep-field-modal-count">{{ selectedCount }}</span>
            <span class="ep-field-modal-selected-text">显示已选择字段</span>
            <span
              class="ep-field-modal-switch"
              :class="{ checked: onlySelected }"
              @click="onlySelected = !onlySelected"
            >
              <span class="ep-field-modal-switch-dot"></span>
            </span>
          </div>
        </div>

        <!-- 字段网格 -->
        <div class="ep-field-modal-grid-wrap">
          <div class="ep-field-modal-grid">
            <template v-if="category === '布局组件'">
              <div
                v-for="item in visibleLayouts"
                :key="item.type"
                class="ep-field-cell"
                :class="{ selected: isLayoutSelected(item.type) }"
                @click="toggleLayout(item)"
              >
                <span class="ep-field-cell-label">{{ item.label }}</span>
                <span
                  class="ep-field-more"
                  @click.stop="toggleMenu(`l:${item.type}`)"
                >
                  ⋯
                </span>
                <div v-if="menuKey === `l:${item.type}`" class="ep-field-menu">
                  <div
                    class="ep-field-menu-item"
                    @click.stop="copyText(item.label ?? item.type)"
                  >
                    复制组件名
                  </div>
                  <div
                    class="ep-field-menu-item"
                    @click.stop="copyText(item.type)"
                  >
                    复制组件类型
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                v-for="meta in visibleFields"
                :key="meta.field"
                class="ep-field-cell"
                :class="{
                  disabled: placedFields.has(meta.field),
                  selected: isFieldSelected(meta.field),
                }"
                :title="meta.field"
                @click="toggleField(meta)"
              >
                <span class="ep-field-cell-label">{{ meta.label }}</span>
                <span
                  class="ep-field-more"
                  @click.stop="toggleMenu(`f:${meta.field}`)"
                >
                  ⋯
                </span>
                <div v-if="menuKey === `f:${meta.field}`" class="ep-field-menu">
                  <div
                    class="ep-field-menu-item"
                    @click.stop="copyText(meta.label)"
                  >
                    复制字段名
                  </div>
                  <div
                    class="ep-field-menu-item"
                    @click.stop="copyText(meta.field)"
                  >
                    复制字段标识
                  </div>
                </div>
              </div>
            </template>
            <div
              v-if="visibleFields.length === 0 && visibleLayouts.length === 0"
              class="ep-field-modal-empty"
            >
              没有匹配的字段
            </div>
          </div>
          <div v-if="hasMore" class="ep-field-modal-hint">
            共 {{ businessFields.fields.value.length }} 个字段，当前仅渲染前
            {{ GRID_RENDER_LIMIT }} 个，请用搜索或分类缩小范围
          </div>
        </div>

        <!-- 新建入口 -->
        <div class="ep-field-modal-new" @click="handleNewCustomField">
          ＋ 新建自定义字段
        </div>

        <!-- 底部说明 -->
        <div class="ep-field-modal-note">
          您可在业务系统中维护业务对象字段，并将其作为全局字段展示在单据模板中。
        </div>

        <!-- 操作区 -->
        <div class="ep-field-modal-actions">
          <span class="ep-field-modal-cancel" @click="handleCancel">取消</span>
          <button
            class="ep-field-modal-confirm"
            :class="{ disabled: selectedCount === 0 }"
            :disabled="selectedCount === 0"
            @click="handleConfirm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped lang="less">
.ep-field-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 40%);
}

.ep-field-modal {
  display: flex;
  flex-direction: column;
  width: 796px;
  max-width: calc(100vw - 48px);
  height: 773px;
  max-height: calc(100vh - 48px);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 16%);
  color: #262626;
}

.ep-field-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
}

.ep-field-modal-title {
  font-size: 17px;
  font-weight: 500;
  color: #262626;
}

.ep-field-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #9aa0a5;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    color: #262626;
    background: #f5f5f5;
  }
}

.ep-field-modal-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 12px;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
}

.ep-field-modal-category {
  width: 180px;
  flex-shrink: 0;
}

.ep-field-modal-search {
  flex: 1;
  min-width: 0;
}

.ep-field-modal-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: #9aa0a5;
  font-size: 13px;
}

.ep-field-modal-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  font-size: 12px;
  color: #4856f8;
  background: #f0f1ff;
  border-radius: 9px;
}

.ep-field-modal-switch {
  position: relative;
  width: 40px;
  height: 22px;
  background: #e5e6eb;
  border-radius: 11px;
  cursor: pointer;
  transition: background 0.2s;

  &.checked {
    background: #4856f8;

    .ep-field-modal-switch-dot {
      transform: translateX(18px);
    }
  }
}

.ep-field-modal-switch-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.ep-field-modal-grid-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 20px 0;
}

.ep-field-modal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
}

.ep-field-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: 0 8px;
  font-size: 13px;
  color: #262626;
  cursor: pointer;
  border-radius: 4px;
  content-visibility: auto;
  contain-intrinsic-size: 38px;

  &:hover {
    background: #f5f5f5;
  }

  &.selected {
    color: #4856f8;
    background: #f0f1ff;
  }

  &.disabled {
    color: #c0c4cc;
    cursor: not-allowed;

    &:hover {
      background: transparent;
    }
  }
}

.ep-field-cell-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.ep-field-more {
  flex-shrink: 0;
  padding-left: 8px;
  color: #9aa0a5;
  opacity: 0;
}

.ep-field-cell:hover .ep-field-more,
.ep-field-cell.selected .ep-field-more {
  opacity: 1;
}

.ep-field-menu {
  position: absolute;
  top: 32px;
  right: 0;
  z-index: 10;
  min-width: 120px;
  padding: 4px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
}

.ep-field-menu-item {
  padding: 6px 10px;
  font-size: 13px;
  color: #262626;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    color: #4856f8;
    background: #f0f1ff;
  }
}

.ep-field-modal-empty {
  grid-column: 1 / -1;
  padding: 48px 0;
  color: #9aa0a5;
  text-align: center;
}

.ep-field-modal-hint {
  padding: 8px 0;
  color: #9aa0a5;
  font-size: 12px;
  text-align: center;
}

.ep-field-modal-new {
  padding: 12px 20px;
  flex-shrink: 0;
  color: #4856f8;
  font-size: 13px;
  cursor: pointer;
}

.ep-field-modal-note {
  padding: 0 20px 12px;
  flex-shrink: 0;
  color: #9aa0a5;
  font-size: 12px;
  line-height: 20px;
}

.ep-field-modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  height: 64px;
  padding: 0 20px;
  flex-shrink: 0;
  border-top: 1px solid #f0f0f0;
}

.ep-field-modal-cancel {
  color: #262626;
  font-size: 13px;
  cursor: pointer;
}

.ep-field-modal-confirm {
  width: 89px;
  height: 38px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  background: #4856f8;
  border: none;
  border-radius: 6px;

  &:hover {
    background: #3a48e0;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>

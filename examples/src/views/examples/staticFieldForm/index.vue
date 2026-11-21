<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { EBuilder } from '@nada-designer/core';
import { Alert, Button, message, Tag } from 'ant-design-vue';

import { getStaticFormExample } from './registry';

type SchemaMode = 'all' | 'visible';

const route = useRoute();
const example = computed(() =>
  getStaticFormExample(String(route.meta.exampleKey ?? '')),
);

const ebRef = ref<InstanceType<typeof EBuilder>>();
const schemaMode = ref<SchemaMode>('visible');
const data = ref<Record<string, any>>({});
const ready = ref(false);
const validateResult = ref<null | { message: string; ok: boolean }>(null);

const pageSchema = computed(() => {
  if (!example.value) return null;
  return schemaMode.value === 'all'
    ? example.value.allPageSchema
    : example.value.visiblePageSchema;
});

const totalCount = computed(() => {
  const children = (pageSchema.value as any)?.schemas?.[0]?.children ?? [];
  return children.length;
});

const fieldCount = computed(() => {
  const children = (pageSchema.value as any)?.schemas?.[0]?.children ?? [];
  return children.filter((item: any) => !item.props?.hidden).length;
});

/** 当前表单的 pageSchema JSON */
const formJson = computed(() => JSON.stringify(pageSchema.value ?? {}, null, 2));

/** 复制表单 JSON */
async function copyFormJson() {
  try {
    await navigator.clipboard.writeText(formJson.value);
    message.success('表单 JSON 已复制');
  } catch {
    message.error('复制失败，请手动选择复制');
  }
}

async function refresh() {
  try {
    const builder: any = ebRef.value;
    data.value = (await builder?.getData?.()) ?? {};
  } catch (error) {
    data.value = { error: String(error) };
  }
}

function resetState() {
  data.value = {};
  ready.value = false;
  validateResult.value = null;
}

watch(
  () => example.value?.key,
  () => resetState(),
);

function handleReady() {
  ready.value = true;
  refresh();
}

function handleChange() {
  refresh();
}

async function handleValidate() {
  try {
    await (ebRef.value as any)?.validate?.();
    validateResult.value = { message: '校验通过', ok: true };
  } catch {
    validateResult.value = { message: '校验未通过（存在必填项未填写）', ok: false };
  }
}

function handleReset() {
  (ebRef.value as any)?.resetData?.();
  validateResult.value = null;
  setTimeout(refresh, 0);
}
</script>

<template>
  <div class="ep-page-main flex h-full gap-3 p-3">
    <!-- 左：渲染区域 -->
    <div class="scenario-render flex-1 overflow-auto rounded p-4">
      <Alert
        v-if="example"
        class="mb-3"
        type="info"
        show-icon
        :message="example.name"
        :description="example.description"
      />
      <div v-else class="mb-3">
        <Alert type="error" show-icon message="未找到该模板示例" :description="String(route.fullPath)" />
      </div>

      <template v-if="example">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <Tag :color="example.active ? 'green' : 'default'">
            {{ example.active ? '启用' : '停用' }}
          </Tag>
          <Tag>{{ example.groupName }}</Tag>
          <Tag>{{ example.type }}</Tag>
          <Tag color="blue">静态字段 {{ example.mappedCount }} / 控件 {{ example.componentCount }}</Tag>
        </div>

        <div class="mb-3 flex flex-wrap items-center gap-3">
          <span class="text-12px">显示方式：</span>
          <Button
            size="small"
            :type="schemaMode === 'visible' ? 'primary' : 'default'"
            @click="schemaMode = 'visible'"
          >
            按模板显示
          </Button>
          <Button
            size="small"
            :type="schemaMode === 'all' ? 'primary' : 'default'"
            @click="schemaMode = 'all'"
          >
            显示全部静态字段
          </Button>
          <Tag color="blue">显示 {{ fieldCount }} / 共 {{ totalCount }} 个字段</Tag>
        </div>

        <EBuilder
          :key="`${example.key}-${schemaMode}`"
          ref="ebRef"
          :page-schema="pageSchema"
          @change="handleChange"
          @ready="handleReady"
        />
      </template>
    </div>

    <!-- 右：结果面板 -->
    <div class="scenario-panel w-420px flex shrink-0 flex-col gap-3 overflow-auto rounded p-3">
      <div class="flex items-center gap-2">
        <Tag :color="ready ? 'green' : 'default'">ready: {{ ready }}</Tag>
        <Tag v-if="example">{{ example.key }}</Tag>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button size="small" @click="handleReset">重置</Button>
        <Button size="small" @click="refresh">刷新数据</Button>
        <Button size="small" type="primary" @click="handleValidate">校验</Button>
      </div>

      <Alert
        v-if="validateResult"
        :type="validateResult.ok ? 'success' : 'error'"
        :message="validateResult.message"
        show-icon
      />

      <div>
        <div class="mb-1 font-bold">getData()</div>
        <pre class="scenario-pre max-h-320px overflow-auto rounded p-2 text-12px">{{
          JSON.stringify(data, null, 2)
        }}</pre>
      </div>

      <div>
        <div class="mb-1 flex items-center justify-between">
          <span class="font-bold">表单 JSON（pageSchema）</span>
          <Button size="small" @click="copyFormJson">复制</Button>
        </div>
        <pre class="scenario-pre max-h-420px overflow-auto rounded p-2 text-12px">{{
          formJson
        }}</pre>
      </div>

      <div v-if="example" class="text-12px leading-5" style="opacity: 0.72">
        模板来源：易快报 {{ example.groupName }} / {{ example.name }}（{{ example.templateId }}）。
        已剔除当前设计器不支持的控件（费用明细、收款信息、业务对象选择、日期区间、城市选择、版式元素），
        仅保留文本 / 多行文本 / 数字 / 金额 / 日期 / 下拉 / 开关 / 附件等静态字段。
        公式/predefine/sum 默认值未应用，下拉选项为演示数据。
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 跟随亮色/暗色主题：--ep-* 变量在 <html class="dark"> 下会被 base.less 覆盖 */
.scenario-render,
.scenario-panel {
  background: var(--ep-background, #fff);
  border: 1px solid var(--ep-border, #e5e7eb);
  color: var(--ep-text-main, #111827);
}

.scenario-panel {
  background: var(--ep-sidebar, var(--ep-background, #fff));
}

.scenario-pre {
  background: var(--ep-muted, #f3f4f6);
  color: var(--ep-text-main, #111827);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

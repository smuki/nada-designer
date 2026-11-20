<script lang="ts" setup>
import type { FieldStates, PageSchema } from '@nada-designer/types';

import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { EBuilder } from '@nada-designer/core';
import { Alert, Button, Tag } from 'ant-design-vue';

import { getScenarioByKey } from './registry';

const route = useRoute();

const fixture = computed(() => getScenarioByKey(String(route.meta.scenarioKey ?? '')));

const ebRef = ref<InstanceType<typeof EBuilder>>();
const data = ref<Record<string, any>>({});
const events = ref<string[]>([]);
const validateResult = ref<{ ok: boolean; message: string } | null>(null);
const ready = ref(false);

const pageSchema = computed<PageSchema>(() => fixture.value?.pageSchema as PageSchema);
const formData = computed(() => fixture.value?.formData);
const fieldStates = computed<FieldStates | undefined>(() => fixture.value?.fieldStates);

/** 读取当前表单数据 */
async function refresh() {
  try {
    data.value = (await ebRef.value?.getData()) ?? {};
  } catch (error) {
    data.value = { error: String(error) };
  }
}

function pushEvent(name: string, payload?: unknown) {
  const time = new Date().toLocaleTimeString();
  const text =
    payload === undefined
      ? name
      : `${name}: ${JSON.stringify(payload).slice(0, 160)}`;
  events.value.unshift(`${time}  ${text}`);
  if (events.value.length > 50) events.value.pop();
}

function handleReady() {
  ready.value = true;
  pushEvent('ready');
  refresh();
}

function handleChange(payload: unknown) {
  pushEvent('change', payload);
  refresh();
}

async function handleValidate() {
  try {
    const result = await ebRef.value?.validate();
    validateResult.value = { message: '校验通过', ok: true };
    return result;
  } catch (error: any) {
    const message =
      error?.msg ??
      error?.message ??
      (Array.isArray(error) ? JSON.stringify(error) : String(error));
    validateResult.value = { message: `校验失败: ${message}`, ok: false };
  }
}

async function handleSetData() {
  if (!fixture.value?.formData) return;
  await ebRef.value?.setData(fixture.value.formData as any);
  pushEvent('setData', fixture.value.formData);
  refresh();
}

function handleResetData() {
  ebRef.value?.resetData?.();
  validateResult.value = null;
  pushEvent('resetData');
  refresh();
}

const expectMatched = computed(() => {
  const expect = fixture.value?.expectData;
  if (!expect) return null;
  return JSON.stringify(expect) === JSON.stringify(data.value);
});

watch(
  () => fixture.value?.key,
  () => {
    ready.value = false;
    validateResult.value = null;
    events.value = [];
    data.value = {};
  },
  { immediate: true },
);
</script>

<template>
  <div class="ep-page-main flex h-full gap-3 p-3">
    <!-- 左：渲染区域 -->
    <div class="scenario-render flex-1 overflow-auto rounded p-4 ep-scoped">
      <template v-if="fixture">
        <Alert
          class="mb-3"
          type="info"
          show-icon
          :message="`${fixture.name}（${fixture.key}）`"
          :description="fixture.description"
        />
        <EBuilder
          :key="fixture.key"
          ref="ebRef"
          :field-states="fieldStates"
          :form-data="formData"
          :page-schema="pageSchema"
          :readonly="fixture.readonly"
          @change="handleChange"
          @ready="handleReady"
        />
      </template>
      <Alert v-else type="error" message="未找到对应场景，请检查 fixtures 目录" show-icon />
    </div>

    <!-- 右：结果面板 -->
    <div class="scenario-panel w-420px flex shrink-0 flex-col gap-3 overflow-auto rounded p-3">
      <div class="flex items-center gap-2">
        <Tag :color="ready ? 'green' : 'default'">ready: {{ ready }}</Tag>
        <Tag v-if="expectMatched !== null" :color="expectMatched ? 'green' : 'red'">
          expectData: {{ expectMatched ? '匹配' : '不匹配' }}
        </Tag>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button size="small" @click="refresh">刷新数据</Button>
        <Button size="small" type="primary" @click="handleValidate">校验</Button>
        <Button size="small" @click="handleSetData">填充示例数据</Button>
        <Button size="small" danger @click="handleResetData">重置表单</Button>
      </div>

      <Alert
        v-if="validateResult"
        :type="validateResult.ok ? 'success' : 'error'"
        :message="validateResult.message"
        show-icon
      />

      <div>
        <div class="mb-1 font-bold">getData()</div>
        <pre class="scenario-pre max-h-260px overflow-auto rounded p-2 text-12px">{{ data }}</pre>
      </div>

      <div>
        <div class="mb-1 font-bold">事件日志</div>
        <pre class="scenario-pre max-h-200px overflow-auto rounded p-2 text-12px">{{
          events.length ? events.join('\n') : '（暂无事件，试试修改表单）'
        }}</pre>
      </div>

      <details>
        <summary class="cursor-pointer font-bold">场景配置（pageSchema / formData）</summary>
        <pre class="scenario-pre mt-1 max-h-260px overflow-auto rounded p-2 text-12px">{{
          JSON.stringify(fixture, null, 2)
        }}</pre>
      </details>
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

<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed, useAttrs } from 'vue';

import { FormItem as TFormItem } from 'tdesign-vue-next';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    checkPayload?: FormItemCheckPayload | null;
    componentSchema?: ComponentSchema;
  }>(),
  {
    checkPayload: null,
    componentSchema: () => ({ type: '' }),
  },
);

type FormItemCheckPayload = {
  message?: string;
  result?: boolean;
};

const attrs = useAttrs();

/**
 * 归一化设计器规则为 TDesign FormRule
 * @description 设计器的 type 表示数据类型（string/number/date…），而 TDesign 的 type 表示消息级别（error/warning），
 * 数据类型在 TDesign 中通过 number/date/email/url 等布尔标记表达，因此需要剥离并转换
 */
function normalizeRules(input: unknown): Record<string, unknown>[] {
  const list = Array.isArray(input) ? input : [input];
  return list.filter(Boolean).map((item) => {
    const { trigger, type, ...rest } = (item ?? {}) as Record<string, unknown>;
    const rule: Record<string, unknown> = { ...rest };

    switch (type) {
      case 'date': {
        rule.date = true;

        break;
      }
      case 'email': {
        rule.email = true;

        break;
      }
      case 'error':
      case 'warning': {
        rule.type = type;

        break;
      }
      case 'number': {
        rule.number = true;

        break;
      }
      case 'url': {
        rule.url = true;

        break;
      }
      // No default
    }

    if (Array.isArray(trigger)) {
      rule.trigger =
        trigger.includes('blur') && trigger.includes('change')
          ? 'all'
          : trigger[0];
    } else if (trigger) {
      rule.trigger = trigger;
    }

    return rule;
  });
}

const formItemProps = computed<Record<string, any>>(() => {
  const raw = attrs as Record<string, any>;
  const result: Record<string, any> = {};

  // TDesign 使用 name 作为 form.data 的取值路径；设计器传入的是 field
  const name = raw.name ?? raw.field ?? raw.prop;
  if (name !== undefined) result.name = name;
  if (raw.label !== undefined) result.label = raw.label;
  if (raw.labelWidth !== undefined) result.labelWidth = raw.labelWidth;
  if (raw.labelAlign !== undefined) result.labelAlign = raw.labelAlign;
  if (raw.requiredMark !== undefined) result.requiredMark = raw.requiredMark;
  if (raw.showErrorMessage !== undefined) {
    result.showErrorMessage = raw.showErrorMessage;
  }
  if (raw.tips !== undefined) result.tips = raw.tips;
  if (raw.class) result.class = raw.class;
  if (raw.style) result.style = raw.style;

  const rulesSource = raw.rules ?? (raw.rule ? [raw.rule] : undefined);
  if (rulesSource) {
    result.rules = normalizeRules(rulesSource);
  }

  // 自定义校验结果反馈
  if (props.checkPayload) {
    if (props.checkPayload.result) {
      result.status = 'success';
    } else {
      result.status = 'error';
      result.help = props.checkPayload.message ?? '校验失败';
    }
  }

  return result;
});
</script>
<template>
  <TFormItem v-bind="formItemProps">
    <slot></slot>
  </TFormItem>
</template>

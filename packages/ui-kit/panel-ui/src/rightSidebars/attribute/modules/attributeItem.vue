<script lang="ts" setup>
import type { ComponentSchema } from '@nada-designer/types';

import { computed, nextTick, ref, watchEffect } from 'vue';

import { NadaNode } from '@nada-designer/base-ui';
import { useDesignerContext, useTableMeta } from '@nada-designer/hooks';
import { pluginManager } from '@nada-designer/manager';
import {
  findSchemas,
  getValueByPath,
  setValueByPath,
} from '@nada-designer/utils';

const props = defineProps<{
  schema: ComponentSchema;
}>();
const designer = useDesignerContext();
const pageSchema = designer.pageSchema;
const revoke = designer.revoke;
const isControlled = designer.designMode === 'controlled';

const selectedNode = computed(() => {
  return designer.state.selectedNode;
});
const tableMeta = useTableMeta(pluginManager);

function isShow(item: ComponentSchema) {
  // show属性为boolean类型则直接返回
  if (typeof item.show === 'boolean') {
    return item.show;
  }

  // show属性为function类型则执行
  if (typeof item.show === 'function') {
    return item.show?.({
      tableMeta: tableMeta.value,
      values: selectedNode.value!,
    });
  }

  return true;
}
const componentConfigs = pluginManager.component.getComponentConfigs();

// 获取组件属性配置
const componentAttributes = computed(() => {
  if (!selectedNode.value || !selectedNode.value.type) {
    return [];
  }

  const baseAttributes =
    componentConfigs[selectedNode.value.type]?.config?.attribute ?? [];
  const allAttributes = [...baseAttributes];

  if (selectedNode.value.id === pageSchema.schemas[0]?.id) {
    allAttributes.push(
      {
        editData: pageSchema,
        field: 'canvas.width',
        label: '画布宽度',
        type: 'EInputSize',
      },
      {
        editData: pageSchema,
        field: 'canvas.height',
        label: '画布高度',
        type: 'EInputSize',
      },
    );
  }

  return allAttributes;
});

const modelValue = ref();

/**
 * 设置属性值
 */
function handleSetValue(
  value: any,
  field: string,
  item: ComponentSchema,
  editData: null | object = selectedNode.value,
) {
  // 受控模式：表单名称唯一校验（根表单名称固定 default，已在属性面板隐藏该项）
  if (
    isControlled &&
    field === 'props.name' &&
    (editData as ComponentSchema)?.type === 'form'
  ) {
    const name = String(value ?? '').trim();
    const duplicated = name
      ? findSchemas(
          pageSchema.schemas,
          (node) =>
            node !== editData &&
            node.type === 'form' &&
            (node.props?.name ?? 'default') === name,
          true,
        )
      : true;

    if (duplicated) {
      pluginManager.global.$message.warning(
        name ? '表单名称已存在' : '表单名称不能为空',
      );
      modelValue.value = getValueByPath(editData!, field);
      return;
    }
  }

  if (typeof item.onChange === 'function') {
    item.onChange({
      componentAttributes,
      tableMeta: tableMeta?.value,
      value,
      values: editData!,
    });
  }
  // 判断是否同步修改属性值
  if (item.changeSync) {
    setValueByPath(editData!, field, value);
  } else {
    nextTick(() => {
      setValueByPath(editData!, field, value);
    });
  }
  // 将修改过的组件属性推入撤销操作的栈中
  revoke.push('属性编辑');
}

watchEffect(() => {
  modelValue.value = getValueByPath(
    props.schema.editData ?? selectedNode.value!,
    props.schema.field!,
  );
});
</script>
<template>
  <div
    v-if="isShow(props.schema)"
    class="ep-attr-item"
    :class="props.schema.layout"
  >
    <div
      v-if="props.schema.label"
      class="ep-attr-label"
      :title="props.schema.label"
    >
      {{ props.schema.label }}
    </div>
    <div
      class="ep-attr-input"
      :class="{ 'block!': props.schema.layout === 'vertical' }"
    >
      <NadaNode
        is-property
        :component-schema="{
          ...props.schema,
          props: {
            ...props.schema.props,
            ...(props.schema.field === 'props.defaultValue'
              ? selectedNode?.props
              : {}),
            input: false,
            field: undefined,
            hidden: false,
            placeholder: props.schema.props?.placeholder,
          },
          show: true,
          noFormItem: true,
        }"
        v-model="modelValue"
        @update:model-value="
          handleSetValue(
            $event,
            props.schema.field!,
            props.schema,
            props.schema.editData,
          )
        "
      />
    </div>
  </div>
</template>

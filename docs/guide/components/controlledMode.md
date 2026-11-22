# 受控字段模式<span style="font-size:16px">v1.1.18</span>

:::tip 受控字段模式受控字段模式用于「字段清单由业务对象决定」的业务表单场景：面板字段来自业务对象的元数据，拖入后生成普通组件节点，但字段名只读、同一表单内不可重复、不可复制。

自由模式（默认）行为完全不变。:::

## 快速开始

```vue
<script setup lang="ts">
import type { FieldMeta } from '@nada-designer/types';

import { EDesigner } from '@nada-designer/core';

// 由业务应用提供：按业务对象 code 返回字段元数据
async function businessFieldLoader(
  businessObject: string,
): Promise<FieldMeta[]> {
  const res = await fetch(
    `/api/univ/form-property?code=${encodeURIComponent(businessObject)}`,
  );
  const data = await res.json();
  return data.fields;
}

function handleSave(pageSchema: any) {
  // pageSchema.businessObject 为业务对象 code（随页面保存）
  console.log(pageSchema);
}
</script>

<template>
  <EDesigner
    business-object="销售单据"
    :business-field-loader="businessFieldLoader"
    design-mode="controlled"
    @save="handleSave"
  />
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| designMode | 设计模式：`free` 自由 / `controlled` 受控；**实例级，初始化后不可切换** | `'free' \| 'controlled'` | `'free'` |
| businessObject | 业务对象 code（租户内唯一）；受控模式新建页面必填，打开已有页面以页面 JSON 为准 | string | - |
| businessFieldLoader | 业务字段元数据加载器；未提供时受控模式显示错误态并可重试 | `(businessObject: string) => Promise<FieldMeta[]>` | - |

## 元数据协议

`FieldMeta` 共 8 项（`specs/controlled-mode.md` §6.3）：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| field | 是 | 业务字段唯一标识（业务对象内唯一），同时是 formData key |
| label | 是 | 显示名称 |
| type | 是 | `text` / `number` / `money` / `date` / `boolean` / `ref` / `list` |
| scale | 否 | 数值精度，`number` / `money` 使用（写入节点 `props.precision`） |
| unit | 否 | 单位；v1 不写入节点 props |
| entity | 否 | `ref` 的数据源实体标识，写入节点 `props.entity` 由业务应用解析选项 |
| group | 否 | 面板分组；**v1 不使用**（面板平铺 + 搜索） |
| active | 否 | 是否启用，缺省为 `true`；`false` 不进入面板 |

类型映射：`text→input`、`number/money→number`、`date→date`、`boolean→switch`、`ref→select`、`list` 暂不支持（跳过并告警）。

## 行为差异

| 行为 | 自由模式 | 受控模式 |
| --- | --- | --- |
| 组件面板 | 全部组件 + 布局 | 工具栏「添加」弹层（业务字段 + `card`/`row`/`tabs`/`form`），左侧活动栏默认收起 |
| 根节点 | `page` | `form`（`id: root`、`name: default`） |
| 字段名 field | 可编辑 | 只读 |
| 同表单内同字段 | 允许 | 面板置灰 + 落点校验拒绝（失败自动回滚） |
| 复制 / 粘贴 / Ctrl+D / Ctrl+X / 大纲复制 | 允许 | 静默禁止 |
| 跨表单拖拽 | 允许 | 视为移动：重算 id 并同步改写动作引用；目标已有同字段则拒绝 |
| 大纲拖拽 / 源码面板 | 允许 | 大纲不可拖；源码面板只读 |
| 页面 JSON | 无变化 | 增加 `businessObject` |

> 提示：受控模式下工具栏「添加」弹层支持**多选**——点击字段加入选择，底部「插入 N 个字段」批量插入；已放置字段置灰不可选，失败项会跳过并提示。字段较多时按元数据 `group`（缺失时按数据类型）自动分类，分类可折叠、支持「全选」；「最近使用」置顶；搜索时最多渲染 100 条。

## 后端接口约定

- 业务对象标识使用 **code**（租户内唯一），页面 JSON 只存 code，不存租户与内部 id；
- 建议接口：`GET /api/univ/form-property?code={businessObject}`（租户从登录态/网关注入），返回 `{ businessObject, fields: FieldMeta[] }`；
- 设计器要求 loader 返回 **数组**，接口若包了一层 `fields`，由适配层解包；
- `code` 一经创建不建议改名，否则已保存页面会找不到业务对象。

## 限制（v1）

- 不支持明细/子表（由另一个业务对象承载）、`list` 类型、字段分组；
- 元数据只决定字段身份、默认控件与数据类型相关预设（如金额精度），必填/默认值/校验等仍在节点属性面板配置；
- 元数据变化不影响已放置节点（节点自带完整 schema），只影响面板可选项。

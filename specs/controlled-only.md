# 受控模式单轨化设计与改造清单（1.1.19）

> 状态：P1 / P2 已完成，P3 进行中（版本号按决策延后）
> 决策日期：2026-11-26
> 影响：**breaking**，实际以修订号 `1.1.19` 发布（按产品要求不升大版本号）

## 1. 背景与决策

产品定位收敛为**业务单据设计器**：页面上的每个输入节点都必须来自业务对象字段元数据，不允许用户自由添加未绑定的输入组件。

已确认的决策：

| 议题 | 决策 |
| --- | --- |
| 是否保留自由模式 | **删除**。产品内不存在 `free` 模式 |
| 存量自由模式页面 | **拒绝导入**，不做自动迁移 |
| 示例处理 | 不删除，全部改写为受控模式示例 |
| 版本号 | 暂不动，发版前统一处理 |
| `designMode` prop | **立即删除**（不做兼容过渡）；版本按产品要求以修订号 `1.1.19` 发布 |
| 允许的无字段组件 | 布局 + 展示 + 动作组件（白名单，见 §3） |
| 字段元数据来源 | 仅 `businessFieldLoader(modelId)` → `Property[]` |

## 2. 目标态

- 设计器只有一种工作方式：`modelId` + `businessFieldLoader` 必填，元数据未就绪时进入加载/错误态；
- 可放置物只有两类：**业务字段**（源：元数据）和 **无字段组件**（源：组件注册表 ∩ 白名单）；
- 所有 `input: true` 节点必须有来自元数据的 `field`，且同 form 作用域内唯一；
- 保存、导入、`setData` / `setDataAsync` 全部经 `validateControlledPage` 校验，失败即拒绝；
- 不存在"自由清单""空上下文""用户手填 field 的输入组件"。

## 3. 无字段组件白名单（基于当前注册表实际可用项）

当前四个适配包注册且可在列表中显示的组件（`groupName` 非空）：

- **布局**：`form`、`card`、`row`、`tabs`
- **动作**：`button`
- 已注册但未显示（`groupName` 为空、不进列表）：`col`、`collapse`、`collapse-item`、`tab-pane`、`form-item`

输入类组件（`input`/`textarea`/`number`/`date`/`select`/`switch`/`radio`/`checkbox`/`cascader`/`color-picker`/`slider`/`upload-file`/`upload-image`/`time-picker`）**不再直接出现在清单中**，只能通过业务字段 → 控件映射间接放置。

> 缺口：**展示类组件目前不存在**（说明文字、分隔线、图片等均无注册项）。若要满足"布局 + 展示 + 动作"，需在四个适配包各新增 2 个组件（如 `text-block`、`divider`），或先用布局+动作上线、展示类作为后续迭代。

## 4. 代码改动清单

### 4.1 删除

| 位置 | 内容 |
| --- | --- |
| `packages/hooks/src/designer/useBusinessFields.ts` | 自由模式空上下文相关注释/分支（`status: 'empty'` 保留用于未加载） |
| `packages/core/.../designer.vue` | `designMode` prop、`designMode` 冻结 watch、`metaBlocked` 前置模式判断 |
| `packages/core/.../useDesigner.ts`、`useHotkeys.ts` | `canMutate: designMode === 'free'` 分支（受控规则成为唯一规则） |
| `packages/core/.../activityBar/index.vue` | `component_view`（自由输入）入口；只剩「版式」+「添加字段」 |
| `packages/core/.../componentPicker.vue` | `mode: 'input'` 及其视图；仅保留 `'field'` / `'layout'` |
| `packages/ui-kit/panel-ui/.../componentView/index.vue` | 自由模式 `v-else` 分支、`getSchemaTypeList`、`handleClick` 的自由插入路径 |
| `packages/core/.../nodes.vue`、`previewWidgets.vue`、`outline.vue`、`sourceCode.vue`、`attribute*.vue` | `designMode === 'controlled'` 判断改为唯一路径 |
| `examples/src/views/designer/*` | 7 个自由模式示例（`basic`/`customMode` 等），仅保留受控示例 |
| `docs/**` | 自由模式章节、`designMode` 文档；`docs/controlled-vs-free-mode.md` 重写/删除 |

### 4.2 保留

- 渲染、拖拽、撤销、面板、属性编辑等共享层；
- `generateNewSchema`（布局/动作组件插入仍使用）；
- `validateControlledPage`、`useBusinessFields`、`Property` 协议。

### 4.3 新增/修改

- 白名单集中一处（建议 `packages/core/src/components/designer/constants/controlled.ts` 或 `packages/utils`），供 `componentPicker` 与 `componentView` 共用，替代现有两处硬编码（`LAYOUT_TYPES` / `LAYOUT_WHITELIST`）；
- 字段→控件映射表（`mapPropertyType`）扩展为候选集（含 `list<attachment>` 等），作为后续 `field-widget-mapping` 的接入点；
- `setData` / `setDataAsync` / `importSchema` 增加 `validateControlledPage` 校验，失败不应用并提示；
- `Property` 元数据缺失/加载失败时保持现有错误态与重试。

## 5. 版本与发布

- 发布包（`nada-designer` + 四个 UI 适配包）统一升 `1.1.19`（修订号；按产品要求不升大版本号）；
- `docs/updateLog.md` 新增 `## 1.1.19` 段落，明确 breaking：删除 `designMode`、删除自由模式、拒绝自由模式页面导入；
- 发布前跑全量 `vue-tsc` + `vitest` + `eslint`。

## 6. 实施阶段

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| P1 入口收口 | 白名单集中；删自由入口；picker 仅 field/layout；`designMode` 恒为 controlled | 界面只剩「版式」「添加字段」；自由组件不可放置；现有测试通过 |
| P2 契约收敛 | 删 `designMode` prop；删免费分支；`validateControlledPage` 接入 `setData*`/导入；拒绝自由页面 | `grep designMode` 无残留；自由页面导入被拒 |
| P3 示例/文档/版本 | 示例只留受控；docs 重写；1.1.19 版本与 changelog | 文档无自由模式描述 |
| P4 回归 | 全量测试、适配包冒烟、受控流程手工走查 | 全绿 |

## 7. 待确认

1. 展示类组件（说明文字/分隔线）是否本次新增（四适配包 × 2）；还是先上布局+动作，展示类下个迭代；
2. 版本号范围：发布包（`nada-designer` + 四个 UI 适配包）统一 `1.1.19`；按产品要求不升大版本号；
3. 拒绝导入的提示文案与交互（toast 还是阻断弹窗）。

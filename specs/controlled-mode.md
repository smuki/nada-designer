# 受控字段模式（Controlled Field Mode）规格书

> **状态**：草案 v0.15　|　**日期**：2026-11-21　|　**范围**：nada-designer 设计器
> **说明**：本版按「运行时业务对象元数据 + 拖拽模板」方向重构。**评审确认前不做任何代码改动。**
> 评审时优先看「0. 确认结论」与「18. 决策记录」；非阻塞问题见 §17。

---

## 0. 确认结论

| # | 事项 | 结论 | 状态 |
|---|---|---|---|
| 1 | 设计模式 | `designMode: 'free' \| 'controlled'`，默认 `free`，EDesigner 实例级 prop | ✅ |
| 2 | 模式生命周期 | 不落盘、不进全局状态；初始化读一次，**禁止切换**（prop 变更仅告警） | ✅ |
| 3 | 业务对象 | 一个设计页面 = 一个业务对象；`businessObject` 为 EDesigner prop | ✅ |
| 4 | 业务对象持久化 | **随页面保存**进 `PageSchema`；打开已有页面以 schema 为准，无值回退 prop，保存写回 | ✅ |
| 5 | 业务对象切换 | 导入/打开页面时与当前不一致 → 按 schema 值重新拉元数据并提示「已切换到 xxx」 | ✅ |
| 6 | 元数据获取 | 设计器挂载时通过应用注入的 loader 获取；内置 Loading / 失败重试 | ✅ |
| 7 | 元数据版本号 | 页面不记录版本号 | ✅ |
| 8 | 子表/明细 | 元数据为**单业务对象扁平字段清单**；无子表结构，需要时关联另一个业务对象 | ✅ |
| 9 | 业务字段身份 | 元数据中的 `field` 即唯一标识（业务对象内唯一），同时是 formData key | ✅ |
| 10 | 字段实现方式 | 业务字段**不注册成组件**；它是面板上的拖拽模板，拖入后节点 `type` = 组件层统一 type | ✅ |
| 11 | 数据类型 | 元数据给 `dataType`（text/number/money/date/boolean/ref/list），按映射表转成组件层 type | ✅ |
| 12 | 类型缺失处理 | 映射后当前 UI 库不存在对应组件 → 跳过该字段并告警 | ✅ |
| 13 | 字符集 | id 与 field 只允许 中文 / 字母 / 数字 / 下划线；**禁止中划线**及其他特殊字符 | ✅ |
| 14 | 唯一性 | 受控模式启用；唯一键 =（form 作用域 + `field`） | ✅ |
| 15 | 复制限制 | 由 `designMode` 决定：自由允许（重发 id）；受控整体禁止、静默无反应 | ✅ |
| 16 | 字段名 | 受控模式下所有节点 `field` 只读（含旧页面自由字段）；`label` 可改 | ✅ |
| 17 | 跨 form 拖拽 | 视为**移动**（源删除、目标新增）；目标 form 已有同 field 则禁止；id 重算 | ✅ |
| 18 | 运行时 | 节点 type 即基础组件，**运行时不需要元数据**；页面 JSON 携带 `businessObject` | ✅ |
| 19 | 自由模式 | 保持现状，不加载元数据、不做任何新约束（产品侧可选择不暴露） | ✅ |
| 20 | 元数据模型 | 精简为 7 字段：`field` / `label` / `type` / `scale` / `unit` / `entity` / `group` / `active`（见 6.3） | ✅ |
| 21 | 布局组件 | 不受控，自由拖入嵌套（范围见 §17） | ✅ |
| 22 | 数据类型 → 控件 | 7 种数据类型映射到组件层 type（见 6.3.1） | ✅ |
| 23 | 表单级配置 | `required` / `defaultValue`（常量）/ `placeholder` / `hide` / `editable` / `maxLength`/`minLength` / `min`/`max`（见 10.3） | ✅ |
| 24 | `ref` 数据源 | 元数据只给 `entity` 标识，选项由业务应用按 entity 解析 | ✅ |

---

## 1. 背景

现状：基础组件注册进 `pluginManager`，拖入画布时 `generateNewSchema()` 深拷贝 `defaultSchema`、重发 id、输入组件 `field = id`。节点之间独立，但没有任何字段级约束：可重复、可随意改名、可复制。

业务表单需要的是"字段清单由业务对象决定、字段名稳定、表单内不重复、不可复制"。这些字段来自**业务对象的元数据**（后端/配置中心），不是代码里硬编码的组件清单。

---

## 2. 目标 / 非目标

### 2.1 目标

1. 设计器可通过 `businessObject` 在挂载时获取字段元数据；
2. 元数据字段作为**面板拖拽项**，拖入后生成普通基础组件节点并套用预设属性；
3. 受控模式下：字段名只读、同一 form 内不重复、禁止复制；
4. 自由模式行为零变化；
5. 页面 JSON 自带 `businessObject`，脱离元数据也能正确渲染。

### 2.2 非目标

- 不做子表/明细嵌套（由另一个业务对象承载）；
- 不做运行时派生/继承/配置合并；
- 不做业务字段的组件注册（不新增组件 type）；
- 不做元数据版本号记录；
- 不做全局设计模式、不做模式切换；
- 不改变基础组件现有行为。

---

## 3. 术语

| 术语 | 定义 |
|---|---|
| 基础组件 | UI 包注册的组件，提供 Vue 实现与属性/事件/样式/动作能力；三套 UI 库共享同一套 `type` 命名 |
| 布局组件 | card / row / col / tabs / modal 等容器类组件，不受控 |
| 业务对象 businessObject | 一个表单业务对象（如报销单）的唯一标识 |
| 元数据 FieldMeta | 业务对象返回的字段清单，每项描述一个业务字段 |
| 业务字段 | 元数据中的一项；`field` 全局（业务对象内）唯一 |
| 拖拽模板 | 面板里的业务字段项；拖入时把元数据套到基础组件默认 schema 上 |
| 设计模式 designMode | `free`（自由）/ `controlled`（受控），EDesigner 实例级 |
| form 作用域 | 页面中最近的 `type === 'form'` 祖先节点；根节点本身即 form |

---

## 4. 概念模型

```
业务对象元数据（接口返回，纯 JSON）
  [{ field: 'reimburseAmount', label: '报销金额', type: 'number',
     props: { precision: 2, prefix: '¥' }, rules: [...] }, ...]
        │ 设计器挂载时通过 loader 获取
        ▼
设计器面板：业务字段拖拽项（按 groupName 分组）+ 布局组件（来自注册表）
        │ 拖拽 = 基础组件默认 schema + 元数据覆盖
        ▼
画布节点（普通基础组件节点）
  type: 'number'                 ← 组件层统一 type
  id: 'root_reimburseAmount'     ← form 节点 id + field
  field: 'reimburseAmount'
  props: { precision: 2, prefix: '¥', ... }
        │ 预设属性已写入 schema
        ▼
运行时 EBuilder：按 type 渲染，**不需要元数据**
```

关键：业务字段不是注册组件；节点就是基础组件，业务身份由 `field` 承担。

---

## 5. 设计模式

### 5.1 定义

```ts
// packages/types/src/designer.ts → DesignerProps
designMode?: 'free' | 'controlled';   // 默认 'free'
```

- `free`：自由模式，现状行为，不加载元数据、无字段约束；
- `controlled`：受控模式，面板只提供业务字段 + 布局；字段只读、同 form 唯一、禁止复制。

### 5.2 作用域与生命周期

- **实例级**：每 EDesigner 独立；不写 `pluginManager`、不写 `useStore`、不写页面 JSON；
- 通过 `provide(DESIGNER_CONTEXT_KEY, { props })` 下发，面板读 `useDesignerContext().props.designMode`；
- **禁止切换**：初始化读一次，后续 prop 变化忽略并 `console.warn`；重建实例算新实例；
- 与 `pageManager.isDesignMode`（boolean，设计态/运行态）严格区分。

### 5.3 行为矩阵

| 行为 | `free` | `controlled` |
|---|---|---|
| 元数据加载 | 不加载 | 加载（设计器挂载时） |
| 组件面板 | 全部基础组件 + 布局（现状） | 业务字段（元数据）+ 布局；不出现原始输入组件 |
| 字段名 field | 可自由编辑、自造 | 所有节点只读（隐藏 field 编辑项） |
| label | 可改 | 可改 |
| 同 form 内同 field | 允许 | 拒绝（唯一性校验） |
| 复制/粘贴/Ctrl+D/大纲复制 | 允许（重发 id） | 整体禁止、静默无反应 |
| 跨 form 拖拽 | 允许 | 视为移动；目标 form 已有同 field 则禁止 |
| 业务字段拖入身份 | 不适用（不加载元数据） | `id = ${formNodeId}_${field}` |
| 页面 JSON / 运行时 | 不变 | 增加 `businessObject`；渲染不变 |

---

## 6. 业务对象与元数据

### 6.1 businessObject

```ts
// DesignerProps
businessObject?: string;   // 业务对象唯一标识，如 'expenseReport'
```

- 字符集：中文 / 字母 / 数字 / 下划线，禁止特殊字符（与 id/field 同规则）；
- 一页一业务对象；新建页面用 prop，打开已有页面以 `schema.businessObject` 为准；
- 保存时写入 `PageSchema.businessObject`；
- 导入/打开页面时与当前不同 → 按 schema 值重新加载元数据并提示「已切换到 xxx」；加载失败则不应用本次导入，保留当前页面。

### 6.2 元数据获取流程

```ts
// DesignerProps
businessFieldLoader?: (businessObject: string) => Promise<FieldMeta[]>;
```

流程：

1. 受控模式挂载 → 解析出 `businessObject`（schema 优先 → prop）；
2. 调用 `businessFieldLoader(businessObject)`；
3. 加载中显示 Loading（与 UI 初始化同一套门控）；
4. 失败显示错误 + 重试，允许应用层传入静态数组替代 loader（测试/离线）；
5. 成功 → 校验（6.4）→ 生成面板业务字段项；
6. 建议按 `businessObject` 做内存缓存，避免重复打开闪烁。

### 6.3 元数据协议（FieldMeta）

**精简为业务字段基础信息**（参考易快报 `propertySet`，去掉设计器用不上的属性）：

| 字段 | 必填 | 说明 |
|---|---|---|
| `field` | 是 | 业务字段唯一标识（业务对象内唯一），同时是 formData key；字符集见 §7.3 |
| `label` | 是 | 显示名称 |
| `type` | 是 | 数据类型：`text` / `number` / `money` / `date` / `boolean` / `ref` / `list` |
| `scale` | 否 | 数值精度（小数位），`number` / `money` 使用 |
| `unit` | 否 | 单位（%、张、元…） |
| `entity` | 否 | `ref` 的数据源实体标识（如 `organization.Staff`），用于下拉选项 |
| `group` | 否 | 面板分组（可来自 `ability`） |
| `active` | 否 | 是否启用，默认 `true`；`false` 不展示 |

示例：

```json
{ "field": "expenseMoney", "label": "报销金额", "type": "money" }
```

```json
{ "field": "submitterId", "label": "提交人", "type": "ref",
  "entity": "organization.Staff", "group": "单据信息" }
```

**不写入元数据的属性**（放到表单级配置，见 10.3）：必填、默认值、占位、隐藏、可编辑、长度/范围、校验规则。
**丢弃的属性**：`cnLabel`（与 label 重复）、`enLabel`（后续 i18n 再加）、`canAsDimension`（分析用）、`elemType`（明细/附件 v1 不支持）、专用业务类型（invoice/permitOrder 等，遇到跳过告警）。

#### 6.3.1 数据类型 → 组件层控件

| `type` | 默认组件 type | 说明 |
|---|---|---|
| `text` | `input` | 单行文本；同一字段也可在表单级切换为 `textarea` |
| `number` | `number` | 数值 |
| `money` | `number` | 金额：`scale`/`unit` 写入预设 props（金额展示/精度） |
| `date` | `date` | 日期 |
| `boolean` | `switch` | 布尔 |
| `ref` | `select` | 下拉；选项按 `entity` 由业务应用提供数据源 |
| `list` | 暂不支持 | v1 跳过 + 告警（明细由另一个业务对象承载） |

> 同一数据类型可能对应多个控件（如 `text` → 单行/多行），v1 先给默认控件；是否允许在设计器里切换控件类型见 §17。

### 6.4 元数据校验

1. `field` 字符集合法、在本次元数据内唯一；
2. `type` 必须是 6.3.1 的 7 种之一；映射后的组件 type 在当前 UI 库已注册，否则跳过该字段 + 告警；
3. `ref` 必须有 `entity`；`number` / `money` 的 `scale` / `unit` 允许为空；
4. `active === false` 的字段不进入面板；
5. 校验失败只影响该字段，不阻塞整份元数据（严重错误除外）。

---

## 7. 拖拽模板与节点生成

### 7.1 面板与拖拽

- 受控面板 = 业务字段项（元数据，按 `groupName` 分组、`sort` 排序）+ 布局组件（注册表）；
- 业务字段项不是注册组件，面板单独渲染这一类条目；
- 拖入时构造节点 schema，而不是从注册表取 `defaultSchema`；
- 点击插入与拖拽使用同一构造逻辑。

### 7.2 节点生成规则

拖入时以基础组件 `defaultSchema` 为底，套用元数据：

```
type   = mapDataType(meta.type)      // 见 6.3.1
id     = `${formNodeId}_${field}`
field  = meta.field
label  = meta.label
input  = base.defaultSchema.input     // 决定 FormItem 与 formData 行为
props  = { ...base.defaultSchema.props, ...数据类型相关预设（scale/unit/精度等） }
rules  = base.defaultSchema.rules
```

- 元数据只决定"字段身份 + 默认控件 + 数据类型相关预设"；表单级配置（必填/默认值/占位/隐藏/长度范围）由用户在属性面板设置，存在节点 schema 里（见 10.3）；
- 拖入后与元数据脱钩：元数据后续变化不影响已放置节点；
- 节点 `type` 是基础组件类型，属性面板显示该基础组件的属性项；
- 预设值必须是可 JSON 序列化的纯数据（拖入走 `structuredClone`）。

### 7.3 节点 id 与字符集

**节点 id 规则：**

| 场景 | id |
|---|---|
| 业务字段（受控） | `${formNodeId}_${field}`，如 `root_报销金额`、`form_4821_报销金额` |
| 基础组件（自由模式 / 非业务字段） | `${normalizeType(type)}_${uuid}`，如 `input_4821`、`color_picker_4821` |
| 子节点 | 一律重发 id |

`normalizeType`：把 type 中的 `-` 替换为 `_`（`color-picker` → `color_picker`）。

**字符集（id / field / businessObject 统一）：**

| 项 | 规则 |
|---|---|
| 允许 | 中文、字母、数字、下划线 |
| 禁止 | 中划线（易误认为减号，影响字段运算/公式）、空格、`.`、`/`、`:`、引号、括号、`#`、`@` 等 |
| 首字符 | 中文 / 字母 / 下划线 |
| 正则 | `^[\u4e00-\u9fa5A-Za-z_][\u4e00-\u9fa5A-Za-z0-9_]*$` |
| 存量数据 | 非法 id 不自动改写，加载时告警 |

### 7.4 跨 form 拖拽（移动）

- 视为**移动**：从源 form 移除、在目标 form 新增；
- 目标 form 已存在同 `field` → 禁止并回滚；
- 成功后重算 id = `${目标formNodeId}_${field}`；
- `field`、props 等不变。

### 7.5 子节点与可序列化

- 业务字段一般是叶子节点；若基础组件自带 `children`（极少见），子节点一律重发 id；
- `defaultSchema` 拖入走 `structuredClone`，预设值不能含函数；
- 规则里的 `validator` 用字符串函数名（由 `pageManager.funcs` 解析）。

---

## 8. 唯一性

### 8.1 作用域

- **仅受控模式启用**；自由模式不校验；
- 唯一键 =（最近的 form 祖先 + `field`）；
- 页面根节点即 form；嵌套 form 各自作用域；找不到 form 时回退整页。

### 8.2 校验时机

插入（拖入 / 点击插入 / 跨 form 移动）前，扫描目标 form：

- 已存在同 `field` → 拒绝 + 提示；
- 拒绝时不产生撤销记录、不误报成功。

### 8.3 form 名称

- formData 按 `props.name ?? 'default'` 分区，重名会导致数据混在一起；
- 受控模式要求 form 名称唯一：拖入 form 时自动命名（`form_1`…），可手动改，重名报错。

---

## 9. 复制限制

| `designMode` | 复制 / 粘贴 / Ctrl+D / 大纲复制 |
|---|---|
| `free` | 允许（重发 id） |
| `controlled` | **整体禁止**（任何节点，含纯布局容器；不含移动/排序） |

- 只看 `designMode`，不判断节点类型；
- 受控模式下**静默忽略**：Ctrl+C 不写剪贴板，粘贴/重复无反应，不弹提示、不入撤销栈；
- 移动（同 form / 跨 form）不属于复制，不受限制；
- 无需子树扫描（限制是模式级的）。

---

## 10. 面板与交互

### 10.1 组件面板（受控）

- 业务字段项：来自元数据，按 `groupName` 分组 + `sort` 排序；
- 布局组件：来自注册表（是否全部放开见 §17）；
- 原始输入组件（input/number/…）不出现；
- 过滤按**本实例**执行，禁止调用全局 `hideComponent/setHideComponents`；
- 搜索按 `label` 过滤（含业务字段）。

### 10.2 已放置状态

- 按**当前选中节点所属 form** 内已有的 `field` 集合判断；
- 置灰提示口径待确认（§17）：置灰 + 落点校验，或只做落点校验。

### 10.3 属性面板

- 受控模式下**所有节点**（含旧页面自由字段）`field` 编辑项隐藏/只读；
- `label` 可编辑；
- 预设属性来自节点 `props`，用户编辑直接改节点。

**v1 表单级配置范围**（存在节点 schema 里）：

| 配置 | 落到节点 |
|---|---|
| 必填 `required` | `rules[{ required: true }]` |
| 默认值（常量） | `props.defaultValue` |
| 占位文案 | `props.placeholder` |
| 隐藏 / 可编辑 | `props.hidden` / `props.disabled`（或 `readonly`） |
| 长度限制 | `props.maxLength` / `props.minLength` |
| 数值范围 | `props.min` / `props.max` |

> 默认值的 formula/sum、动态 hide/optional、`dependence`/`filterId`、`visibility`、`priority` 等放到后续演进。

### 10.4 label 一致性

- 部件列表用元数据 `label`；画布悬停用 `config.defaultSchema.label`（基础组件）；
- 大纲/面包屑优先 `schema.label`；
- 拖入时把 `label` 写入节点 schema，保证四处一致。

---

## 11. 运行时与序列化

### 11.1 PageSchema

```ts
interface PageSchema {
  businessObject?: string;   // 业务对象标识（随页面保存）
  canvas?: {...};
  schedule?: ...;
  schemas: ComponentSchema[];
  script?: string;
}
```

- 新建页面：用 prop 的 businessObject，保存时写入 schema；
- 打开已有页面：schema.businessObject 优先；无值回退 prop；
- 导入：schema 值为准；与当前不一致 → 重新加载元数据 + 提示；加载失败不应用导入。

### 11.2 运行时

- 节点 `type` 是基础组件 → EBuilder 按现有链路渲染，**不需要元数据、不需要 businessObject**；
- 预设属性已在 schema 里，字段被后端删除也不影响已放置节点渲染（只是设计器面板里不再提供）；
- 设计器与运行时不需要注册业务字段组件（对比旧方案的大幅简化）。

### 11.3 保存/导入校验

- 保存：写入 businessObject；节点 `field` 不在元数据中 → 警告（是否阻止见 §17）；
- 导入：校验 businessObject、id/field 字符集、同 form 内 field 唯一；冲突项列出提示。

---

## 12. 兼容性与边界

| 场景 | 行为 |
|---|---|
| 现有自由模式应用 | 完全不变（默认 `free`） |
| 旧页面在受控实例打开 | 可渲染；自由字段 field 只读；不参与唯一性/面板置灰 |
| 两个设计器实例不同模式并存 | 互不影响（模式实例级） |
| 元数据加载失败 | 错误态 + 重试；不进入设计 |
| 元数据里字段被删除 | 已放置节点照常渲染；设计器标记"元数据中不存在" |
| 当前 UI 库不支持某 type | 跳过该字段 + 告警 |
| 导入不同 businessObject 的页面 | 按 schema 重新加载元数据 + 提示 |
| 存量数据含非法 id/field | 仅警告，不自动改写 |
| 业务字段想出现多次 | 不允许（同 form 内唯一）；需要多个时属于业务建模问题 |

---

## 13. 影响面清单

| 文件 | 改动点 |
|---|---|
| `packages/types/src/designer.ts` | `DesignerProps` 增 `designMode` / `businessObject` / `businessFieldLoader`；`PageSchema` 增 `businessObject` |
| `packages/core/src/components/designer/src/designer.vue` | 默认值、模式锁定、元数据加载门控、保存写回 businessObject |
| `packages/core/.../hooks/useDesigner.ts` | 模式装配、元数据状态、复制拦截参数 |
| `packages/core/.../hooks/useHotkeys.ts` | 复制/粘贴/重复拦截 |
| `packages/hooks/src/common/clipboard.ts` | copy/paste/duplicate 允许判定 |
| `packages/hooks/src/designer/useBusinessFields.ts`（新增） | 元数据加载、校验、缓存、面板项生成 |
| `packages/ui-kit/panel-ui/.../componentView` | 业务字段项渲染 + 拖拽模板构造 + 插入校验 + 已放置态 |
| `packages/core/.../nodes.vue` | 拖入落点：id 生成、唯一性校验、回滚、不写撤销 |
| `packages/ui-kit/panel-ui/.../outline.vue` | 大纲复制拦截 |
| `packages/ui-kit/panel-ui/.../attribute` | 受控模式隐藏 field 编辑项 |
| `packages/utils/src/common/data.ts` | `generateNewSchema` id 归一化、唯一性/字符集辅助函数 |
| `packages/core/.../toolbar.vue` | 导入：businessObject 切换、校验 |
| `docs`/`examples`/`tests` | 文档章节、mock 元数据示例、单测 |

> 不需要改 `pluginManager` 的组件注册逻辑（不新增业务组件 type）。

### 13.1 真实数据验证（易快报，2026-11-21）

用真实接口数据验证了 v1 范围（数据、脚本与示例见 [specs/mocks](mocks/README.md)）：

| 指标 | 数值 |
|---|---|
| 业务字段（propertySet） | 406 个，精简后可用 361（跳过 list / dynamic / dateRange / 专用类型） |
| 单据模板 | 35 个（28 启用 / 7 停用），共 748 个控件 |
| 控件可映射到现有组件 | 617 / 748 = 82.5% |
| 全部控件都能映射的模板 | 2 个 |
| 含费用明细（details）的模板 | 25 个 |

结论：v1 能覆盖"静态字段表单"约 82.5% 的控件实例；**明细表格、业务对象选择器、版式元素、公式默认值、动态规则、权限可见性**是主要缺口，已列入 §17。35 个模板各生成了一个静态字段示例，见 examples 的「例子」分类。

---

## 14. 实施计划

| 阶段 | 内容 | 验收 |
|---|---|---|
| **P0** 验证基线（已完成） | 抓取易快报 propertySet / specificationGroups；生成 mock 数据与 35 个模板示例；确认 v1 覆盖 82.5% 控件 | 数据与示例可复现（specs/mocks 脚本）；examples「例子」可查看 |
| **P1** 设计器模式与元数据获取 | `designMode`/`businessObject`/loader 类型与默认值；元数据加载 + Loading/失败重试 + 校验；mock 元数据示例 | 受控/自由实例并存互不影响；加载失败可重试；非法字段被跳过告警 |
| **P2** 拖拽模板与面板 | 面板业务字段项渲染、分组排序、拖拽构造节点、点击插入；属性面板受控收口 | 拖入生成正确 type/id/field/props；面板无原始输入组件 |
| **P3** 约束规则 | form+field 唯一性、复制禁止（静默）、跨 form 移动、field 只读、form 自动命名 | 同 form 重复被拒；复制无反应；移动成功重算 id |
| **P4** 持久化与导入 | PageSchema.businessObject 保存/读取/回退；导入切换业务对象；保存/导入校验 | 保存后 JSON 带归属；导入不同对象自动重载并提示 |
| **P5** 文档、示例、测试、回归 | 文档、mock 元数据示例、单测、回归 | lint/typecheck/coverage 通过 + 手测清单 |

---

## 15. 测试计划

### 15.1 单元测试

| 用例 | 断言 |
|---|---|
| 元数据校验 | field 字符集/唯一性、type 不存在跳过、非法 props 拒绝 |
| schema 合并 | type/id/field/props/rules 正确；预设属性写入节点 |
| id 生成 | `${formNodeId}_${field}`；type 中 `-` 归一化为 `_`；子节点重发 |
| 唯一性 | 同 form 重复拒绝、不同 form 允许、嵌套 form 作用域、回退整页 |
| 复制拦截 | 受控：无剪贴板写入、无撤销记录；自由：允许且重发 id |
| 跨 form 移动 | 源删目标增、目标冲突回滚、id 重算 |
| 业务对象 | schema 优先/prop 回退/保存写回/导入切换 |
| 字符集 | 非法 id/field 告警、不自动改写 |
| field 只读 | 受控下所有节点只读；label 可编辑 |

### 15.2 手动回归

1. 自由模式全功能回归；
2. 受控模式：加载元数据 → 面板 → 拖入 → 属性编辑 → 保存 → 刷新 → 预览；
3. 同一字段二次拖入被拒；跨 form 各放一个；复制无反应；
4. 导入不同 businessObject 页面 → 自动切换 + 提示；
5. 元数据接口失败 → 错误态 + 重试；
6. 旧页面（自由字段）在受控实例打开。

---

## 16. 风险与缓解

| 风险 | 缓解 |
|---|---|
| `designMode` 与 `isDesignMode` 混名 | 文档对比；面板只读 props，渲染只读 pageManager |
| 元数据与 UI 库组件不匹配 | type 校验 + 跳过告警；示例只列三库共有类型 |
| 预设属性含函数 | 拖入走 structuredClone，注册/加载时校验纯数据 |
| 业务字段 id 撞车 | id 含 form 前缀 + field（业务对象内唯一）；生成时补冲突检查 |
| 元数据漂移（字段删除/改名） | 节点自带完整 schema，渲染不受影响；设计器提示 |
| 全局单例污染（面板过滤） | 强制实例级过滤，不改全局注册表 |
| 复制限制被绕过（源码面板） | 受控模式源码面板只读（§17 待定） |
| 测试全局单例污染 | `createPluginManager()` 隔离或 afterEach 清理 |
| 覆盖率门槛（hooks 45 / manager 75 / utils 50） | 新代码同步补单测 |

---

## 17. 开放问题 / 后续演进

1. 面板"已放置"：置灰 + 落点校验，还是只做落点校验（倾向后者，避免误导）。
2. 每字段额外属性项：v1 只用基础组件自带属性面板，还是支持按字段追加/隐藏属性项。
3. 受控模式允许的布局组件范围：全部布局 or 白名单。
4. 源码/JSON 面板在受控模式下是否自动只读（防止绕过约束）。
5. 保存时元数据缺失字段：仅警告还是阻止保存。
6. 字段漂移提示方式：画布标红 / 大纲提示 / 不提示。
7. 自由模式在产品侧是否继续暴露（建议库保留、产品只开受控）。
8. `ref` 数据源：业务应用如何按 `entity` 提供选项（接口约定）；是否也允许元数据直接给静态 options。
9. 同一数据类型多控件：v1 是否允许在设计器里切换控件（如 `text` → 单行/多行），还是先用默认控件。
10. 后续能力：`defaultValue` 的 formula/sum、动态 `configs`、`dependence`/`filterId`、`visibility`、`priority`（可复用仓库已有的公式引擎）。
11. 元数据是否需要 `designable`（可放置）标志：真实数据 406 个字段里大量系统字段，全部进面板会失控；建议后端过滤或前端按规则过滤。
12. `ref` 且 `entity` 为「是否」维度时，是否映射成开关（switch）而不是下拉。
13. 明细表格（`details` / `requisitionDetails`，25 个模板有）是否提前到 v1.5，而不是完全推迟。

---

## 18. 决策记录

> v0.13 按"运行时元数据 + 拖拽模板"方向重构，以下为当前有效决策；此前基于"注册组件"的决策已作废。

| 编号 | 决策 | 结论 |
|---|---|---|
| D1 | 业务字段实现 | 不注册组件，是面板拖拽模板；节点 type = 组件层统一 type |
| D2 | 业务字段身份 | 元数据 `field`（业务对象内唯一），同时是 formData key |
| D3 | 节点 id | `${formNodeId}_${field}`；基础组件 `${normalizeType(type)}_${uuid}` |
| D4 | 字符集 | id/field/businessObject：中文/字母/数字/下划线；禁中划线及其他特殊字符 |
| D5 | 设计模式 | `designMode: 'free' \| 'controlled'`，默认 free，实例级，不落盘，禁止切换 |
| D6 | 业务对象 | 一页一对象；EDesigner prop；PageSchema 保存；打开时 schema 优先 |
| D7 | 元数据获取 | 设计器挂载时经 loader 获取；Loading/失败重试；按业务对象缓存 |
| D8 | 类型映射 | 元数据给 `dataType`，经 6.3.1 映射表转成组件层 type；映射后不存在则跳过告警；不引入 kind |
| D9 | 唯一性 | 受控模式；唯一键 =（form + field） |
| D10 | 复制限制 | 按 designMode：free 允许；controlled 整体禁止、静默无反应 |
| D11 | 跨 form 拖拽 | 移动语义；目标 form 冲突禁止；id 重算 |
| D12 | 字段名 | 受控模式所有节点 field 只读；label 可改 |
| D13 | 运行时 | 不需要元数据；页面 JSON 携带 businessObject |
| D14 | 子表/明细 | 不支持；由另一个业务对象承载 |
| D15 | 元数据版本号 | 不记录 |
| D16 | 自由模式 | 保持现状，不加载元数据、不加约束 |
| D17 | form 命名 | 受控模式自动命名 + 可改 + 重名校验 |
| D18 | 元数据模型 | 精简为 `field` / `label` / `type` / `scale` / `unit` / `entity` / `group` / `active`；丢弃 `cnLabel`/`enLabel`/`canAsDimension`/`elemType`/专用业务类型 |
| D19 | 数据类型 → 控件 | `text→input`、`number/money→number`、`date→date`、`boolean→switch`、`ref→select`、`list` 暂不支持（跳过告警） |
| D20 | 表单级配置 | v1：`required`、`defaultValue`（常量）、`placeholder`、`hide`、`editable`、`maxLength`/`minLength`、`min`/`max`；其余后续 |
| D21 | `ref` 数据源 | 元数据只给 `entity`，选项由业务应用按 entity 解析 |
| D22 | v1 范围验证 | 以易快报真实数据为基线：v1 覆盖 617/748 控件（82.5%）；明细/版式/公式/动态规则/权限列入后续 |

### 18.1 变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v0.1–v0.12 | 2026-11-20 | 基于"注册组件"方向的多轮迭代（已被 v0.13 取代） |
| v0.13 | 2026-11-21 | 按「运行时元数据 + 拖拽模板」重构：业务字段不注册组件；businessObject 随页面保存；元数据协议；id/field 统一字符集；重写影响面与计划 |
| v0.14 | 2026-11-21 | 参考易快报 propertySet / specificationGroups：元数据精简为 7 字段；新增 dataType→控件映射；表单级配置收敛为 v1 范围；`ref` 数据源只给 entity |
| v0.15 | 2026-11-21 | 补充真实数据验证（§13.1：406 字段 / 35 模板 / 748 控件，v1 覆盖 82.5%）；新增开放问题（designable 过滤、是否维度映射、明细优先级）、P0 验证基线与决策 D22 |

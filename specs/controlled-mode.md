> **历史规格（2.0 起）**：产品已删除自由模式，designMode 与 isControlled 分支均已移除；当前实现见 specs/controlled-only.md。

# 受控字段模式（Controlled Field Mode）规格书

> **状态**：草案 v0.36　|　**日期**：2026-11-24　|　**范围**：nada-designer 设计器
> **说明**：本版修正 `modelId` 语义：它是**业务对象模型主键 id**（不是 code）；页面 JSON 只存 `modelId`，`code` 仅用于展示/兼容旧数据。**评审通过后按 §14 开工 P1，在此之前不做任何代码改动。**
> 评审时优先看「0. 确认结论」与「18. 决策记录」；非阻塞问题见 §17；版本差异见 §18.1。

---

## 0. 确认结论

| # | 事项 | 结论 | 状态 |
|---|---|---|---|
| 1 | 设计模式 | `designMode: 'free' \| 'controlled'`，默认 `free`，EDesigner 实例级 prop | ✅ |
| 2 | 模式生命周期 | 不落盘、不进全局状态；初始化读一次，**禁止切换**（prop 变更仅告警） | ✅ |
| 3 | 业务对象 | 一个设计页面 = 一个业务对象；`modelId` 为 EDesigner prop | ✅ |
| 4 | 业务对象持久化 | **随页面保存**进 `PageSchema`；打开已有页面以 schema 为准，无值回退 prop，保存写回 | ✅ |
| 5 | 业务对象切换 | 导入/打开页面时与当前不一致 → 按 schema 值重新拉元数据并提示「已切换到 xxx」 | ✅ |
| 6 | 元数据获取 | 设计器挂载时经 loader 获取（首屏只有 prop 可用）；**schema 晚到时二次解析**；内置 Loading / 失败重试 | ✅ |
| 7 | 元数据版本号 | 页面不记录版本号 | ✅ |
| 8 | 子表/明细 | 元数据为**单业务对象扁平字段清单**；无子表结构，需要时关联另一个业务对象 | ✅ |
| 9 | 业务字段身份 | 元数据中的 `field` 即唯一标识（业务对象内唯一），同时是 formData key | ✅ |
| 10 | 字段实现方式 | 业务字段**不注册成组件**；它是面板上的拖拽模板，拖入后节点 `type` = 组件层统一 type | ✅ |
| 11 | 数据类型 | 元数据给 `type`（text/number/money/date/boolean/ref/list），按映射表转成组件层 type | ✅ |
| 12 | 类型缺失处理 | 映射后当前 UI 库不存在对应组件 → 跳过该字段并告警 | ✅ |
| 13 | 字符集 | id 与 field 只允许 中文 / 字母 / 数字 / 下划线；**禁止中划线**及其他特殊字符 | ✅ |
| 14 | 唯一性 | 受控模式启用；唯一键 =（作用域节点 + `field`）；**校验在落点执行，失败摘除回滚且不入撤销栈**；扫描含旧自由字段（v0.16 / v0.17） | ✅ |
| 15 | 复制限制 | 由 `designMode` 决定：自由允许（重发 id）；受控整体禁止（**含 Ctrl+X 剪切**）、静默无反应（v0.16） | ✅ |
| 16 | 字段名 | 受控模式下所有节点 `field` 只读（含旧页面自由字段）；`label` 可改 | ✅ |
| 17 | 跨 form 拖拽 | 视为**移动**；目标 form 已有同 field 则禁止；**id 重算并同步改写动作引用**（v0.16） | ✅ |
| 18 | 运行时 | 节点 type 即基础组件，**运行时不需要元数据**；页面 JSON 携带 `modelId` | ✅ |
| 19 | 自由模式 | 保持现状，不加载元数据、不做任何新约束（产品侧可选择不暴露） | ✅ |
| 20 | 元数据模型 | 精简为 8 项：`field` / `label` / `type` / `scale` / `unit` / `entity` / `group` / `active`（7 个业务属性 + `active` 开关，见 6.3） | ✅ |
| 21 | 布局组件 | 受控面板只提供**白名单布局**（当前 `card` / `row` / `tabs`）+ `form`；`col` / `tab-pane` / `modal` 等由容器内部结构产生，不从面板拖入 | ✅ v0.16 |
| 22 | 数据类型 → 控件 | 7 种数据类型映射到组件层 type（见 6.3.1） | ✅ |
| 23 | 表单级配置 | `required` / `defaultValue`（常量）/ `placeholder` / `hide` / `editable` / `maxLength`/`minLength` / `min`/`max`（见 10.3） | ✅ |
| 24 | `ref` 数据源 | 元数据只给 `entity` 标识，选项由业务应用按 entity 解析 | ✅ |
| 25 | 拖拽/插入校验时机 | 受控按**落点校验 + 回滚**：节点随拖放进入目标列表后立即校验，失败摘除且不写撤销记录；唯一性要求不放宽 | ✅ v0.16 |
| 26 | 受控根节点 | 根节点初始化为 form（`type:'form'`、`id:'root'`、`props.name:'default'`），不再用 `page` 根 | ✅ v0.16 |
| 27 | 受控面板范围（原 §17-3） | 业务字段 + `card` / `row` / `tabs` + `form`；**v0.24 改为模态「添加字段」面板**（分类/搜索/已选开关 + 三列网格 + 取消/确定）；左活动栏默认收起 | ✅ v0.24 |
| 28 | 已放置态（原 §17-1） | 业务字段在**当前选中节点所属作用域**内已放置 → 面板置灰、禁止拖拽/点击；落点校验保留为跨作用域兜底 | ✅ v0.20 |
| 29 | 保存时元数据缺字段（原 §17-5） | **仅警告，不阻止保存** | ✅ v0.16 |
| 30 | 受控下剪切 | Ctrl+X 与复制一并静默禁止（剪切依赖粘贴，粘贴必然重发 id） | ✅ v0.16 |
| 31 | 预设属性收敛 | 预设 props 必须先过「该 UI 库组件 `config.attribute` 白名单」；money 只写 `props.precision`，`unit`/`prefix` v1 不入 props | ✅ v0.16 |
| 32 | 实现落点收口 | 复制拦截在 `useClipboard` 调用方判定；属性面板统一过滤 `field` 项；面板过滤实例级，禁用全局 `hideComponent` | ✅ v0.16 |
| 33 | 无 form 祖先时的作用域 | 回退**页面根节点**作为作用域，id 前缀用根节点 id（不出现 undefined 前缀） | ✅ v0.17 |
| 34 | 旧字段参与唯一性 | 扫描作用域内所有 `input === true && field` 节点（含旧页面自由字段），不新增持久标记 | ✅ v0.17 |
| 35 | 大纲拖拽 | 受控下**禁用大纲拖拽**（自由模式保持现状），避免绕过落点管线 | ✅ v0.17 |
| 36 | 源码面板 | 受控模式**强制源码面板只读**（`sourceCodeReadOnly \|\| controlled`） | ✅ v0.17 |
| 37 | 根 form 布局 | 取当前 UI 库 `form` 组件 `defaultSchema` 深拷贝，覆盖 `id` / `props.name` / `children` | ✅ v0.17 |
| 38 | setData / 导入契约 | 新增 `setDataAsync(): Promise<boolean>`；同步 `setData` 走乐观应用 + 失败回滚 | ✅ v0.17 |
| 39 | 撤销/历史 modelId | 快照有值以快照为准（必要时重载元数据）；快照缺省才回填当前值 | ✅ v0.17 |
| 40 | 导入校验 | 受控导入发现 id/field 重复或非法 → **拒绝导入**并列出冲突 | ✅ v0.17 |
| 41 | 依赖方向 | `useBusinessFields` 不运行时依赖 `manager`（配置查询由调用方注入） | ✅ v0.17 |
| 42 | 字段分组 | **v1 不做分组**：元数据不返回 `group`，面板平铺 + 搜索，数组顺序即展示顺序（后端无需 group/sort 字段） | ✅ v0.18 |
| 43 | 业务对象标识 | 用业务对象**模型主键 id**（`modelId`，全局唯一）；`code` 仅展示/兼容，不作为页面归属键；跨租户导入按 id 校验，缺失则要求重新选择 | ✅ v0.36 |

---

## 1. 背景

现状：基础组件注册进 `pluginManager`，拖入画布时 `generateNewSchema()` 深拷贝 `defaultSchema`、重发 id、输入组件 `field = id`。节点之间独立，但没有任何字段级约束：可重复、可随意改名、可复制。

业务表单需要的是"字段清单由业务对象决定、字段名稳定、表单内不重复、不可复制"。这些字段来自**业务对象的元数据**（后端/配置中心），不是代码里硬编码的组件清单。

### 1.1 实现约束（v0.17 核对代码现状）

以下事实决定了本版若干口径的调整，实施时按此为准（文件位置见 §13）：

1. **拖拽克隆早于落点，且落点前已被库插入**：面板 `:clone="generateNewSchema"` 在 dragstart 生成占位节点；`vue-draggable-plus` 的内部 `onAdd` 会先把占位节点插入目标列表，用户的 `@add` 之后才执行（落点处目前只有"选中 + 入撤销栈"）。因此 `@add` 只能**就地重建/替换**或**摘除回滚**，不能再插入一次；`${作用域节点 id}_${field}` 也只在落点写入。
2. **落点拿不到父节点上下文**：画布落点组件只持有当前 children 数组，没有 owner schema；需补 `parentSchema` 传递（大纲树已有同类 prop 可参照）。
3. **`generateNewSchema` 会覆盖 field**：`(field || input)` 且组件未设 `fixedField` 时强制 `field = id`；业务字段不注册组件，拿不到 `fixedField` → 必须参数化。
4. **没有 `props.schema`**：打开已有页面靠 `setData()`（宿主多在 `onMounted` 后调用）或工具栏导入，schema 一定晚于挂载 → 业务对象解析必须是两段式（prop 首屏 → schema 到达后校正）。
5. **`PageSchema` 只有 `canvas/schemas/script`**，且导入/`setData` 走 `deepCompareAndModify(shouldDelete=true)`：`modelId` 会被删键，必须在每次写入后回填。
6. **保存路径以 `pageSchema` 为唯一真相**：`Ctrl+S` 直接 `emit('save', pageSchema)`、预览 JSON 直接 `JSON.stringify(pageSchema)`，只在 `getData()` 里补字段会漏。
7. **默认根节点是 `page`**（仅 `formMode` 才换成 form）→ 受控根需初始化成 form。
8. **`field` 属性项分散在 40+ 处 UI 组件配置**（`field: 'field'`）→ 只读走属性面板统一过滤，不改 40 处配置。
9. **节点复制有 3 个入口**：快捷键（c/v/x/d）、选中浮层"复制"（`handleDuplicate`，与 `useDesigner` 同一条路径）、大纲独立实现的 `handleCopy`；`useClipboard` 是底层实现而非入口。另有 3 处**文本复制**（属性面板复制节点 id、预览 JSON、事件编辑器复制组件 id）不属于节点复制。节点剪贴板只存在内存 `ref`，未用系统剪贴板。
10. **`innerDefaultSchema` 是模块级 `let`**：多实例会互相污染，"两个实例不同模式并存"的验收前提是改成实例级。
11. **`findSchemaInfoById` 找不到时 `throw`**（不是返回 null）→ 拦截逻辑不能依赖它兜底。
12. **无字符集 / 唯一性 / 最近 form 祖先的工具**：`normalizeType`、字段正则、`(form,field)` 查重都要新增。

---

## 2. 目标 / 非目标

### 2.1 目标

1. 设计器可通过 `modelId` 在挂载时获取字段元数据；
2. 元数据字段作为**面板拖拽项**，拖入后生成普通基础组件节点并套用预设属性；
3. 受控模式下：字段名只读、同一 form 内不重复、禁止复制/剪切；
4. 自由模式行为零变化（例外：新生成节点 id/field 前缀按 §7.3 归一化；存量数据不改写、影响见该节）；
5. 页面 JSON 自带 `modelId`，脱离元数据也能正确渲染。

### 2.2 非目标

- 不做子表/明细嵌套（由另一个业务对象承载）；
- 不做运行时派生/继承/配置合并；
- 不做业务字段的组件注册（不新增组件 type）；
- 不做元数据版本号记录；
- 不做全局设计模式、不做模式切换；
- 不改变基础组件现有行为；
- 不做布局白名单之外的容器扩展机制（新增布局组件需走 §17.2 流程）。

---

## 3. 术语

| 术语 | 定义 |
|---|---|
| 基础组件 | UI 包注册的组件，提供 Vue 实现与属性/事件/样式/动作能力；三套 UI 库共享同一套 `type` 命名 |
| 布局组件 | 面板中 `groupName === '布局'` 的容器组件（当前 `card` / `row` / `tabs`）；`col` / `tab-pane` / `modal` 由容器内部结构产生，不单独出现在面板 |
| 业务对象 modelId | 一个表单业务对象（如报销单）的唯一标识 |
| 元数据 Property | 业务对象返回的字段清单，每项描述一个业务字段 |
| 业务字段 | 元数据中的一项；`field` 全局（业务对象内）唯一 |
| 拖拽模板 | 面板里的业务字段项；拖入时把元数据套到基础组件默认 schema 上 |
| 设计模式 designMode | `free`（自由）/ `controlled`（受控），EDesigner 实例级 |
| 作用域节点 | 业务字段唯一性与 id 的作用域载体：最近的 `type === 'form'` 祖先；**找不到 form 时回退页面根节点**（旧 page 根页面） |
| form 作用域 | 同「作用域节点」；**受控模式新建页面根节点即 form**（`id: root`） |
| 落点校验 | 节点已随拖放进入目标列表后立即执行的校验；失败时摘除该节点并回滚，不写撤销记录 |
| normalizeType | 把组件 type 中的 `-` 替换为 `_`，用于拼接节点 id 前缀 |

---

## 4. 概念模型

```
业务对象元数据（接口返回，纯 JSON）
  [{ field: 'reimburseAmount', label: '报销金额', type: 'money', scale: 2, unit: '元' }, ...]
        │ 设计器挂载时通过 loader 获取；schema 晚到时二次解析
        ▼
设计器面板：业务字段拖拽项（按 group 分组）+ 布局白名单（card/row/tabs/form）
        │ 拖拽 = clone 占位 → 落点校验 → 按作用域节点就地重建
        ▼
画布节点（普通基础组件节点）
  type: 'number'                 ← 组件层统一 type（由元数据 type 映射）
  id: 'root_reimburseAmount'     ← `${作用域节点 id}_${field}`
  field: 'reimburseAmount'
  props: { precision: 2, ... }
        │ 预设属性已写入 schema
        ▼
运行时 EBuilder：按 type 渲染，**不需要元数据**
```

关键：业务字段不是注册组件；节点就是基础组件，业务身份由 `field` 承担。

**拖拽时序约束（v0.17）**：面板拖拽在 dragstart 阶段由 SortableJS `clone` 生成占位节点，此时尚未命中作用域节点，无法确定 `${作用域节点 id}_${field}`。因此：

- `clone` 只生成携带业务字段标识的**占位节点**（临时 id、标记归属）；
- 落点 `add` 触发时占位节点**已被库插入目标列表**，最终节点是**就地重建/替换**（不是插入），按**作用域节点**重建 `id` / `field` / `props`；
- 校验失败则从目标列表摘除，不写撤销记录（见 §8.2）。

---

## 5. 设计模式

### 5.1 定义

```ts
// packages/types/src/designer.ts → DesignerProps
designMode?: 'free' | 'controlled';                          // 默认 'free'
modelId?: string;                                     // 业务对象唯一标识
businessFieldLoader?: (modelId: string) => Promise<Property[]>;
```

- `free`：自由模式，现状行为，不加载元数据、无字段约束；
- `controlled`：受控模式，面板只提供业务字段 + 布局白名单 + form；字段只读、同 form 唯一、禁止复制/剪切。

### 5.2 作用域与生命周期

- **实例级**：每 EDesigner 独立；不写 `pluginManager`、不写 `useStore`、不写页面 JSON；
- 通过 `provide(DESIGNER_CONTEXT_KEY, { props, designMode, ... })` 下发。**context 额外暴露一份冻结的 `designMode` 快照**，面板/属性/大纲读快照，不读 `props.designMode`（props 是响应式代理，直接读会让 prop 变更生效）；
- **禁止切换**：初始化读一次，后续 prop 变化忽略并 `console.warn`；重建实例算新实例；
- 与 `pageManager.isDesignMode`（boolean，设计态/运行态）严格区分；
- 与 `formMode` 的关系：受控模式根=form 不依赖 `formMode`；受控实例**不执行** `formMode` 的全局 `hide('form')`（全局注册表污染，违反 §10.1）；产品同时设置两者时以受控模式为准；
- **根节点**：受控模式初始化时把根节点构造成 form——取当前 UI 库 `form` 组件 `defaultSchema` 的**深拷贝**（保留 `labelCol` / `labelLayout` / `labelWidth` 等布局 props），覆盖 `id:'root'`、`props.name:'default'`、`children: []`；不复用/修改全局 `pluginManager.designer.formSchema`；
- **默认 schema 的实例隔离**：`useDesigner` 内的默认页面数据改为实例级（当前是模块级变量），保证两个实例互不影响。

### 5.3 行为矩阵

| 行为 | `free` | `controlled` |
|---|---|---|
| 元数据加载 | 不加载 | 加载（挂载时先按 prop，schema 到达后校正） |
| 根节点 | `page` | `form`（`id: root`、`name: default`） |
| 组件面板 | 左侧**「布局」+「输入」两个入口**：布局打开布局组件选择器，输入打开输入类组件弹出框（拖拽/多选，自动收起） | 左侧**「布局」+「添加字段」两个入口**：布局打开布局选择器，添加字段打开字段模态面板 |
| 字段名 field | 可自由编辑、自造 | 所有节点只读（隐藏 field 编辑项） |
| label | 可改 | 可改 |
| 同作用域内同 field | 允许 | 拒绝（落点校验 + 摘除回滚） |
| 复制/粘贴/Ctrl+D/**Ctrl+X**/大纲复制 | 允许（重发 id） | 整体禁止、静默无反应 |
| 跨 form 拖拽 | 允许 | 视为移动；目标 form 已有同 field 则禁止；id 重算 + 引用改写 |
| 业务字段拖入身份 | 不适用（不加载元数据） | `id = ${作用域节点 id}_${field}` |
| 大纲拖拽 | 允许（现状） | 禁止（避免绕过落点管线） |
| 源码面板 | 可编辑（除非 prop 只读） | 强制只读 |
| 页面 JSON / 运行时 | 不变 | 增加 `modelId`；渲染不变 |

---

## 6. 业务对象与元数据

### 6.1 modelId

```ts
// DesignerProps
modelId?: string;   // 业务对象模型 id（主键；字符串传递，避免大整数精度丢失）
```

- 类型：`string`（数字/雪花 id 建议由后端转字符串传递，避免 JS 大整数精度丢失）；**不再套用 id/field 的字符集规则**（见 7.3）；
- **标识取业务对象的模型主键 `id`**（写入页面 JSON 的 `modelId`）：全局唯一，随页面保存；**不再使用 `code` 作为归属键**；
- **租户维度**：模型 id 全局唯一，加载时按当前登录租户校验可见性（页面本身不记录租户）；
- **`code` 仅用于展示/兼容旧数据**（如 `销售单据`），可改名，不影响已保存页面；
- **跨租户导入/复制页面**：目标租户下按 `modelId` 解析；不存在则导入校验提示并**要求重新选择业务对象**（字段差异提示见 §11.3）；
- 一页一业务对象；新建页面用 prop，打开已有页面以 `schema.modelId` 为准；
- 保存时写入 `PageSchema.modelId`；
- 导入/打开页面时与当前不同 → 按 schema 值重新加载元数据并提示「已切换到 xxx」；加载失败则不应用本次导入，保留当前页面；
- 受控模式下根 form 的 `props.name` 固定 `default`，与 `modelId` 无关；后续拖入的 form 自动命名 `form_1`…（见 8.3）。

### 6.2 元数据获取流程（两段式）

```ts
// DesignerProps
businessFieldLoader?: (modelId: string) => Promise<Property[]>;
```

流程：

1. **阶段 A（挂载）**：受控模式挂载时，若宿主传了 `props.defaultSchema`，其 `modelId` 优先；否则按 `props.modelId` 加载（打开已有页面通常走 `setData`/导入，schema 在 `onMounted` 之后到达）；两者都没有或未提供 loader → `empty` 错误态，面板提示"未指定业务对象 / 未提供 businessFieldLoader"并提供重新加载；
2. **阶段 B（schema 到达）**：`setData()` / 导入成功后解析 `schema.modelId`（优先）→ 与当前不一致时重新加载元数据并提示已切换；加载失败**不应用本次数据**，保留当前页面；
3. 加载中显示 Loading（与 UI 初始化同一套门控，见 §10.1）；
4. 失败显示错误 + 重试；允许应用层传入静态数组替代 loader（测试/离线）；
5. 成功 → 校验（6.4）→ 生成面板业务字段项；
6. 按 `modelId` 做内存缓存（只读、可跨实例共享），避免重复打开闪烁；
7. **并发切换**：以最后一次请求为准，用递增令牌丢弃过期响应；
8. **loader 契约**：返回 `Property[]`。接口/mock 可能包一层 `{ modelId, properties, ... }`（见 `specs/mocks/*`），**解包由调用侧完成**，loader 自身返回数组。

### 6.3 元数据协议（Property，8 项）

**7 个业务属性 + `active` 开关**（参考易快报 `propertySet`，去掉设计器用不上的属性）：

| 字段 | 必填 | 说明 |
|---|---|---|
| `field` | 是 | 业务字段唯一标识（业务对象内唯一），同时是 formData key；字符集见 §7.3 |
| `label` | 是 | 显示名称 |
| `type` | 是 | 数据类型：`text` / `number` / `money` / `date` / `boolean` / `ref` / `list` |
| `scale` | 否 | 数值精度（小数位），`number` / `money` 使用 |
| `unit` | 否 | 单位（%、张、元…），v1 不写入节点 props（见 6.3.1） |
| `entity` | 否 | `ref` 的数据源实体标识（如 `organization.Staff`），用于下拉选项；**含 `.`，不参与 id/field 字符集校验** |
| `group` | 否 | 面板分组；**v1 不使用**（保留字段，后续可选；见 D43） |
| `active` | 否 | 是否启用，**缺省视为 `true`**；`false` 不展示 |

示例：

```json
{ "field": "expenseMoney", "label": "报销金额", "type": "money", "scale": 2 }
```

```json
{ "field": "submitterId", "label": "提交人", "type": "ref",
  "entity": "organization.Staff", "group": "单据信息" }
```

**不写入元数据的属性**（放到表单级配置，见 10.3）：必填、默认值、占位、隐藏、可编辑、长度/范围、校验规则。
**丢弃的属性**：`cnLabel`（与 label 重复）、`enLabel`（后续 i18n 再加）、`canAsDimension`（分析用）、`elemType`（明细/附件 v1 不支持）、专用业务类型（invoice/permitOrder 等，遇到跳过告警）。

> **数据现状（v0.16 核对）**：`specs/mocks/property.mock.json` 的 361 个字段只出现 7 个键，**没有任何 `active: false` 样本**（原始 406 条全为 true）。因此「`active === false` 不进面板」这条需要 P1 补一条 mock 样本（工程项，见 §17.2）。

#### 6.3.1 数据类型 → 组件层控件

| `type` | 默认组件 type | 说明 |
|---|---|---|
| `text` | `input` | 单行文本；v1 固定 `input`（是否允许切换 `textarea` 见 §17.2） |
| `number` | `number` | 数值 |
| `money` | `number` | 金额：`scale` → `props.precision`（三库共有属性）；`unit` 不入 props |
| `date` | `date` | 日期 |
| `boolean` | `switch` | 布尔 |
| `ref` | `select` | 下拉；选项按 `entity` 由业务应用提供数据源 |
| `list` | 暂不支持 | v1 跳过 + 告警（明细由另一个业务对象承载） |

**预设属性规则（v0.16，v0.17 补 `entity` 例外）**：

- 预设值必须落在**当前 UI 库该组件 `config.attribute` 声明过的 props** 之内，先按白名单过滤再写入，避免向组件塞无效 props；
- `props = { ...base.defaultSchema.props, ...白名单内的预设 }`；
- **白名单的唯一例外**：`ref` 字段的 `props.entity`——宿主协议字段，不出现在属性面板、不经白名单过滤（见 §11.2）；三套 `select` 的 `config.attribute` **不新增** `entity` 项；
- 预设值必须是可 JSON 序列化的纯数据（拖入走 `structuredClone`，含函数会抛错）。

### 6.4 元数据校验

1. `field` / `label` / `type` 必填；`field` 字符集合法、在本次元数据内唯一；
2. `type` 必须是 6.3.1 的 7 种之一；映射后的组件 type 在当前 UI 库已注册，否则跳过该字段 + 告警；
3. `ref` 必须有 `entity`；`number` / `money` 的 `scale` / `unit` 允许为空；
4. `active === false` 的字段不进入面板（缺省 `true`）；
5. 单条失败只影响该字段，不阻塞整份元数据；校验结果返回问题清单（字段 + 原因），供 §12「元数据漂移」与导入校验复用。

---

## 7. 拖拽模板与节点生成

### 7.1 面板与拖拽

- 受控面板 = 业务字段项（元数据，按 `group` 分组、按元数据顺序排序）+ 布局白名单（`card` / `row` / `tabs`）+ `form`；
- 业务字段项不是注册组件，面板单独渲染这一类条目；
- **统一构造入口**：点击插入与拖拽落点调用同一个 `insertBusinessField(meta, scopeNode)`；拖拽时 `clone` 只产出占位节点，最终节点在落点**就地重建**（见 §7.2）；
- 布局组件仍走注册表 `defaultSchema` + `generateNewSchema`；
- 受控过滤只在面板组件内做（实例级），不调用全局 `hideComponent/setHideComponents`。

### 7.2 节点生成规则

**拖拽（受控）**：

1. `clone`（dragstart）：产出占位节点，仅携带业务字段标识与基础 schema；
2. `add`（drop）：此时占位节点**已被库的内部 `onAdd` 插入目标列表**。先定位作用域节点（最近 form 祖先，找不到则页面根节点）→ 落点校验（见 §8.2）→ 用下面的规则**就地重建该项**（替换，不新增）→ 选中 + 写撤销；
3. 校验失败：从目标列表**摘除**该项（不是"回滚插入"），回到拖拽前状态，不写撤销。

**点击插入（受控）**：作用域节点 = 选中节点的最近 form 祖先（找不到则根节点）→ 校验 → 构造 → 插入到选中节点之后（或容器末尾）。

最终节点：

```
type   = mapDataType(meta.type)      // 见 6.3.1
id     = `${scopeNode.id}_${meta.field}`
field  = meta.field
label  = meta.label
input  = base.defaultSchema.input     // 决定 FormItem 与 formData 行为
props  = { ...base.defaultSchema.props, ...白名单内的预设（scale 等） }
rules  = base.defaultSchema.rules
```

- 元数据只决定"字段身份 + 默认控件 + 数据类型相关预设"；表单级配置（必填/默认值/占位/隐藏/长度范围）由用户在属性面板设置，存在节点 schema 里（见 10.3）；
- 拖入后与元数据脱钩：元数据后续变化不影响已放置节点；
- 节点 `type` 是基础组件类型，属性面板显示该基础组件的属性项；
- **`field` 不被 id 覆盖**：`generateNewSchema` 第二参数保持数组（兼容现有调用），新增**第三参数 options** `{ idPrefix?: 'normalized' | 'raw'; fieldPolicy?: 'id' | 'keep' }`，默认值等价现状；受控业务字段构造使用 `fieldPolicy: 'keep'`。

### 7.3 节点 id 与字符集

**节点 id 规则：**

| 场景 | id |
|---|---|
| 业务字段（受控） | `${作用域节点 id}_${field}`，如 `root_报销金额`、`form_4821_报销金额`；无 form 祖先时前缀为根节点 id |
| 基础组件（自由模式 / 非业务字段） | `${normalizeType(type)}_${uuid}`，如 `input_4821`、`color_picker_4821` |
| 子节点 | 一律重发 id |

`normalizeType`：把 type 中的 `-` 替换为 `_`（`color-picker` → `color_picker`）。

**v0.17 实现说明**：当前 `generateNewSchema` 直接用原始 type 拼 id（`color-picker_1234`），且 `normalizeType` 尚不存在。本版要求新增该函数并按上式生成，**只影响新生成的节点，存量 id 不改写**；自由模式因 `field = id`，`color-picker` / `upload-file` / `upload-image` / `time` 等带中划线类型的新节点，其 **formData key 也会从 `color-picker_1234` 变为 `color_picker_1234`**（随机段不变）——需在 P5 回归与文档中明确。现有单测只断言"新 id ≠ 旧 id"，预计影响小；`generateNewSchema` 的签名扩展须保持第二参数（数组）兼容。

**字符集（id / field / modelId 统一）：**

| 项 | 规则 |
|---|---|
| 允许 | 中文、字母、数字、下划线 |
| 禁止 | 中划线（易误认为减号，影响字段运算/公式）、空格、`.`、`/`、`:`、引号、括号、`#`、`@` 等 |
| 首字符 | 中文 / 字母 / 下划线 |
| 正则 | `^[\u4e00-\u9fa5A-Za-z_][\u4e00-\u9fa5A-Za-z0-9_]*$` |
| 例外 | 元数据 `entity`（如 `organization.Staff`）只用于数据源解析，不做字符集校验 |
| 存量数据 | 非法 id 不自动改写，加载时告警 |

### 7.4 跨 form 拖拽（移动）

- 视为**移动**：从源作用域移除、在目标作用域新增；
- 目标作用域已存在同 `field` → 禁止；
- 成功后重算 `id = ${目标作用域 id}_${field}`；
- **引用改写（v0.16）**：新增 `rewriteComponentRefs(schemas, oldId, newId)`，扫描全页 `on.*` 动作中的 `componentId`（`ActionsModel.componentId`；`args` 是 JSON 字符串，v1 不改写其内部文本）并替换为新 id；改写后按 id 反查校验，仍指向不存在承载体的引用 → 列告警；
- `field`、props 等不变；
- **拒绝与回滚（v0.17）**：优先在 Sortable 的 `onMove` 阶段预判拒绝（通过落点元素反查目标作用域，冲突时直接 veto，无中间态）；无法预判时才走 `@add` 回滚，此时必须**同时**处理源列表——库的 drop 顺序是"先 add 目标、后 remove 源"，需在 `@remove` / `@end` 中捕获源列表引用与 `oldIndex`，回滚顺序为：从目标列表摘除 → 恢复源列表原索引 → 复原引用 → 不写撤销；只处理目标列表会导致源节点丢失；
- **大纲拖拽（v0.17）**：受控下禁用（大纲树各级共用同一个 `tree-draggable` group，可跨父移动并绕过上述规则）；自由模式保持现状；

### 7.5 子节点与可序列化

- 业务字段一般是叶子节点；若基础组件自带 `children`（极少见），子节点一律重发 id；
- `defaultSchema` 拖入走 `structuredClone`，预设值不能含函数；
- 规则里的 `validator` 用字符串函数名（由 `pageManager.funcs` 解析）。

---

## 8. 唯一性

### 8.1 作用域

- **仅受控模式启用**；自由模式不校验；
- 唯一键 =（作用域节点 + `field`）；作用域节点 = 最近 form 祖先，找不到时**回退页面根节点**（旧 page 根页面，id 前缀即根 id，不再是 undefined）；
- 嵌套 form 各自作用域；受控新建页面根节点即 form；
- **扫描口径（v0.17）**：作用域内所有 `input === true && field` 的节点都计入（含旧页面自由字段）；不新增"业务字段"持久标记——节点只有 `field`，加标记反而要迁移旧数据；
- 业务字段在面板中不置灰（见 §8.2 / §0-28）。

### 8.2 校验时机（落点校验 + 回滚）

受控模式下唯一性校验在**落点**执行（拖入 / 跨 form 移动）；点击插入在插入前校验：

- 扫描目标 form 内已有 `field`（含 `input === true` 的节点），已存在同 `field` → 拒绝；
- 拖拽路径：节点已被库的内部 `onAdd` 放进目标列表，拒绝时从该列表**摘除**并恢复原状（不是"回滚插入"）；跨作用域移动的回滚须同时恢复源列表，见 §7.4；
- **拒绝时不产生撤销记录、不提示成功**；拖拽中间态可能短暂渲染一次（Vue 单帧），v1 接受；后续可用 Sortable 的 `onMove` 预判消除（§17.2）；
- 点击插入路径：插入前判定，不产生任何中间态。

### 8.3 form 名称

- formData 按 `props.name ?? 'default'` 分区，重名会导致数据混在一起；
- 受控模式要求 form 名称唯一：根 form 固定 `default`；拖入 form 时自动命名（`form_1`…），可手动改，落点与属性编辑时重名校验；
- 导入/旧页面里已有的 form 名称一并参与重名校验（冲突项列出提示）。

---

## 9. 复制限制

| `designMode` | 复制 / 粘贴 / Ctrl+D / Ctrl+X / 大纲复制 |
|---|---|
| `free` | 允许（重发 id） |
| `controlled` | **整体禁止**（任何节点，含纯布局容器；不含移动/排序） |

- 只看 `designMode`，不判断节点类型；
- 受控模式下**静默忽略**：Ctrl+C 不写剪贴板缓存，粘贴/重复/剪切无反应，不弹提示、不入撤销栈；
- **节点复制入口共 3 个**：① 快捷键 Ctrl+C/V/X/D；② 选中浮层"复制"（`handleDuplicate`，与 `useDesigner` 同一路径）；③ 大纲 `handleCopy`（独立实现）；
- **拦截落点（v0.16）**：在 `useClipboard`（`copy`/`cut`/`paste`/`duplicate`）的**调用方判定**早退，覆盖 ①②；③ 单独收口（改为复用同一判定）；
- **不要在 `generateNewSchema` 里按模式拦截**：它同时服务面板插入与点击插入，会误伤；
- 移动（同 form / 跨 form）不属于复制，不受限制；
- 保留：**文本复制**不受限——属性面板"复制节点 id"、预览 JSON"复制 JSON"、事件编辑器"复制组件 id"（查看/调试辅助，走系统剪贴板）；
- 现状提醒：节点剪贴板只存在内存 `ref`，**未使用系统剪贴板**；因此受控下 Ctrl+C 的效果就是"什么都不发生"；
- 无需子树扫描（限制是模式级的）；
- **源码面板（v0.17）**：受控模式强制只读（`sourceCodeReadOnly || designMode === 'controlled'`），避免绕过约束；JSON 预览面板本身只读，无需处理。

---

## 10. 面板与交互

### 10.1 组件面板（受控）

- **v0.34 形态**：受控「添加字段」**复用自由模式同一个弹出选择器**（`ComponentPicker`），只是展示内容换成业务字段：**平铺展示不折叠**，搜索框前提供**类型下拉**（全部 + 各 group/数据类型），并支持按关键字搜索字段名；
- 入口：左侧活动栏「添加字段」图标（与自由模式「输入」同位置，sort 100）；工具栏不再有添加按钮；
- 交互与自由模式一致：**可直接拖到画布**（拖拽产出占位节点，落点按作用域构造正式节点）、**可多选批量插入**（按元数据顺序，合并为一条撤销记录）；插入 / 选中 / 点外部自动收起；
- 已放置字段置灰不可选（§10.2）；原始输入组件（input/number/…）在受控模式不出现；
- 布局组件由左侧「布局」入口提供（`card` / `row` / `tabs` / `form`，见 §10.5）；
- 不再维护独立的模态面板（v0.24 形态已移除，避免重复实现）；
- **Loading 门控**：受控元数据加载中复用现有整页骨架（`EpDesignerLoader`），与 UI 初始化同一个 `v-if` 门控；失败态在 Suspense 同层渲染错误 + 重试，不进入设计。

### 10.2 已放置状态

- **v0.20 决定**：业务字段若已在**当前选中节点所属作用域**内放置，面板置灰（`opacity .45`、`not-allowed`），且**不可拖拽、不可点击**（§0-28、D26）；
- 作用域随选中节点切换：选中另一个 form 内的节点时，按该 form 判断已放置字段；
- 由于面板无法预知拖拽目标 form，**落点校验仍然保留**：跨作用域重复放置会被拒绝并回滚（§8.2）；
- 置灰只是交互提示，唯一性判定仍以落点校验为准；如需按目标 form 精确置灰，需等 §17.2 的 onMove 预判能力。

### 10.3 属性面板

- **v0.29 选中语义**：属性面板常驻并默认展示**页面（根节点）属性**；**点击画布空白处**自动选中页面根节点（显示页面属性）；选中动作带版本号（`selectionVersion`），同一节点被再次选中也会刷新属性面板；点击组件 / 源码 / 大纲图标可切到对应面板，再次选中组件自动切回；
- 受控模式下**所有节点**（含旧页面自由字段）`field` 编辑项隐藏/只读：在属性面板统一过滤 `field === 'field'` 的配置项（不动 40+ 处 UI 组件配置）；
- 建议同时展示业务字段只读信息：`field`、数据类型、是否仍存在于元数据（漂移提示见 §12）；
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

- 部件列表用元数据 `label`；大纲/面包屑优先 `schema.label`；
- 画布悬停/选中浮层**改为优先 `schema.label`**，回退 `config.defaultSchema.label`（v0.17 明确；涉及 `previewWidgets.vue`，见 §13）；
- 拖入时把 `label` 写入节点 schema，保证四处一致。

### 10.5 自由模式组件选择（v0.30 / v0.32）

- 左侧活动栏拆成**「布局」与「输入」两个入口**（v0.32）：
  - **布局**：打开布局组件选择器（`card` / `row` / `tabs` / `form`），**数量少、平铺不分组**，可拖到画布、可多选插入；
  - **输入**：打开输入类组件选择器（其余表单控件），可拖到画布、可多选插入；
- 两个弹出框均锚定在图标旁，插入（拖拽落点 / 批量插入）或点外部自动收起；受控模式把「输入」替换为「添加字段」（字段模态面板），「布局」保持一致；

---

## 11. 运行时与序列化

### 11.1 PageSchema

```ts
interface PageSchema {
  modelId?: string;   // 业务对象标识（随页面保存）
  canvas?: {...};
  schemas: ComponentSchema[];
  script?: string;
}
```

- **唯一真相**：`pageSchema.modelId`（因为 `Ctrl+S` 直接 emit `pageSchema`、预览 JSON 直接 `stringify(pageSchema)`）；
- 写入：初始化、切换业务对象、导入成功后、`reset()` 后保持当前值；
- **回填（v0.16）**：`setData()` / 导入 / 撤销恢复 / `importHistory` / `reset()` 之后都要处理 modelId——这些路径走 `deepCompareAndModify`（默认删除缺失键），不补就会丢归属；
- 新建页面：用 prop 的 modelId，保存时写入 schema；
- 打开已有页面：`defaultSchema` / `setData` / 导入三种来源的 `modelId` 优先；无值回退 prop；
- 导入：schema 值为准；与当前不一致 → 重新加载元数据 + 提示；加载失败不应用导入；
- **同步/异步契约（v0.17）**：`setData(data)` 保持同步签名，自由模式行为不变。受控且 `modelId` 一致 → 同步应用；受控且不一致 → **乐观应用 + 失败回滚**（应用前记录快照，异步加载失败则恢复快照、提示、不写撤销），并 `console.warn` 建议改用异步 API。新增 `setDataAsync(data): Promise<boolean>`：先加载目标对象元数据，失败返回 `false` 且不应用，成功后应用并入撤销；工具栏导入与宿主打开页面优先走该 API；
- **reset 语义（v0.17）**：`reset()` 只重置 `schemas` / `script`，**不改变 modelId**（保持当前值，避免导入 B 后 reset 残留 B 的归属）；受控下重置为当前业务对象的空 form 页面；
- **撤销/历史语义（v0.17）**：`applyRecord` 会先删除快照中没有的键，因此恢复时**以快照值为准**——快照有 `modelId` → 应用该值，若与当前不同则重载元数据 + 提示；快照缺省（旧快照）→ 回填当前值并告警；
- k-form 旧数据：`convertKFormData` 产出的 `PageSchema` 只构造 `schemas` + `script`，需在解析原始 JSON 时先取出 `modelId` 并透传。

### 11.2 运行时

- 节点 `type` 是基础组件 → EBuilder 按现有链路渲染，**不需要元数据、不需要 modelId**；
- 预设属性已在 schema 里，字段被后端删除也不影响已放置节点渲染（只是设计器面板里不再提供）；
- 设计器与运行时不需要注册业务字段组件（对比旧方案的大幅简化）；
- 受控根 form 与自由模式 form 渲染完全一致；
- **`ref` 字段**：v0.16 明确把 `entity` 写入节点 `props.entity`，宿主据此解析选项；该字段是白名单**例外**（不出现在属性面板、不受 §6.3.1 白名单过滤）；选项注入协议仍待约定（§17.2）。

### 11.3 保存/导入校验

- 保存：写入 modelId；节点 `field` 不在元数据中 → **仅警告**（§0-29）；非法 id/field 字符集 → 警告；
- **导入校验（v0.17，受控）**：`modelId` 合法、id 唯一（重复会破坏按 id 选中/撤销）、id/field 字符集、作用域内 field 唯一；发现冲突 → **拒绝导入**并列出冲突项（自由模式保持现状，不校验）；
- 导入中 `modelId` 非法属严重错误 → 不应用本次导入并提示。

---

## 12. 兼容性与边界

| 场景 | 行为 |
|---|---|
| 现有自由模式应用 | 完全不变（默认 `free`；例外：新节点 id/field 前缀按 §7.3 归一化，见该节影响说明） |
| 受控实例新建页面 | 根节点自动为 form（`id: root`、`name: default`） |
| 旧页面在受控实例打开 | 可渲染；根是 page 时作用域回退根节点（id 前缀为 root）；自由字段 field 只读，**参与唯一性校验**（同 formData key） |
| 两个设计器实例不同模式并存 | 互不影响（模式实例级；默认 schema 需在 P1 改为实例级） |
| 元数据加载失败 | 错误态 + 重试；不进入设计 |
| 元数据里字段被删除 | 已放置节点照常渲染；设计器标记"元数据中不存在" |
| 当前 UI 库不支持某 type | 跳过该字段 + 告警 |
| 导入不同 modelId 的页面 | 按 schema 重新加载元数据 + 提示；加载失败不应用 |
| 存量数据含非法 id/field | 仅警告，不自动改写 |
| 旧撤销历史 / 外部导入的历史记录 | 快照有值以快照为准（必要时重载元数据）；快照缺省才回填当前值 |
| 受控实例打开 root=page 页面后拖业务字段 | 作用域=根节点，id 形如 `root_字段`，不出现 undefined 前缀 |
| 受控下大纲拖拽 | 禁用（只读导航）；自由模式保持现状 |
| 受控下源码/JSON 面板 | 源码面板强制只读；JSON 预览天然只读 |
| 导入含重复 id/field 的页面（受控） | 拒绝导入并列出冲突项 |
| 撤销跨越不同业务对象 | 以快照值为准，提示并重载元数据 |
| 同一 field 拖入两次 | 落点拒绝 + 回滚；面板不置灰 |
| 受控下 Ctrl+C / Ctrl+V / Ctrl+D / Ctrl+X / 大纲复制 | 静默无反应，不入撤销栈 |
| mock 元数据全为 `active: true` | 需补 `active: false` 样本，否则该分支无数据验证 |

---

## 13. 影响面清单

| 文件 | 改动点 |
|---|---|
| `packages/types/src/designer.ts` | `DesignerProps` 增 `designMode` / `modelId` / `businessFieldLoader`；新增 `Property` 与 `PropertyType` |
| `packages/types/src/nada-designer.ts` | `PageSchema` 增 `modelId`（该接口无索引签名，必须显式加） |
| `packages/core/.../designer/src/designer.vue` | props 默认值与模式冻结、`designMode` 快照下发、元数据 Loading/错误重试门控、受控根 form（UI `defaultSchema` 深拷贝）、`setData` 后回填 modelId、新增 `setDataAsync`、源码面板只读联动 |
| `packages/core/.../designer/hooks/useDesigner.ts` | 装配 `useBusinessFields`、默认 schema 实例化、modelId 写入/回填、根 form、复制拦截参数 |
| `packages/core/.../designer/hooks/useHotkeys.ts` | 复制/粘贴/重复/剪切拦截（传入 `canMutate`） |
| `packages/hooks/src/common/clipboard.ts` | `useClipboard` 增 `canMutate`（**默认 `true`**，兼容现有 3 参调用），`copy/cut/paste/duplicate` 首行早退 |
| `packages/hooks/src/designer/useBusinessFields.ts`（新增） | 元数据加载、两段式解析、校验、缓存、令牌、面板项生成、节点构造、唯一性判定；配置查询（defaultSchema / attribute 白名单）由调用方注入，**运行时不 import `manager`** |
| `packages/hooks/src/designer/useDesignerContext.ts` | `DesignerContext` 增 `designMode`（冻结值）与 `businessFields` |
| `packages/hooks/src/plugin/usePageSchema.ts` | `modelId` 初始化与回填入口 |
| `packages/hooks/src/designer/index.ts` | 导出新增的 `useBusinessFields`（utils 侧函数已在 `common/index.ts` 通配导出） |
| `packages/ui-kit/panel-ui/.../componentView` | 业务字段分组渲染、布局白名单 + 实例级过滤、搜索、统一构造入口、拖拽 `clone` 改为占位 |
| `packages/core/.../nodes.vue` | 落点：`parentSchema` 传递、作用域解析、唯一性校验、id 重算、就地重建/摘除回滚；跨作用域移动需捕获源列表与 `oldIndex`（`@remove` / `@end`） |
| `packages/core/.../nodeItem.vue` | 向子列表传 `parentSchema` |
| `packages/ui-kit/panel-ui/.../outline.vue` + `packages/ui-kit/base-ui/src/tree/*` | 大纲复制拦截（收口到统一判定）；受控下禁用大纲拖拽（`draggable=false`，避免绕过落点管线） |
| `packages/ui-kit/panel-ui/.../attribute` | 受控模式过滤 `field` 编辑项、业务字段只读信息 |
| `packages/utils/src/common/data.ts` | `generateNewSchema` 第三参 options（id 前缀归一化、field 策略；第二参数数组保持兼容）、最近 form 祖先、唯一性、引用改写、字符集辅助 |
| `packages/utils/src/common/string.ts` | `normalizeType`、字段/id 字符集正则与校验函数 |
| `packages/manager/src/revoke.ts` | 撤销/历史恢复后回填 `modelId` |
| `packages/core/.../toolbar.vue` | 导入：modelId 解析/切换/失败不应用/校验提示；`imported` 事件载荷改为回填后的 pageSchema（保持事件签名兼容） |
| `packages/ui-kit/panel-ui/.../sourceCode/index.vue` | 受控强制只读（`sourceCodeReadOnly \|\| controlled`） |
| `packages/core/.../modules/editContainer/previewWidgets.vue` | 悬停/浮层 label 改为优先 `schema.label` |
| `examples/src/router/index.ts` + `views/designer/controlledMode/`（新增） | 受控模式 demo（mock loader + demo 元数据副本） |
| `docs` | `EDesigner.md` props/事件表、新增受控模式章节页、`hotkeys.md`、sidebar、`updateLog.md` |
| `specs/mocks` | 补 `active: false` 样本；loader 解包约定写入 README |
| `tests` | 单测（见 §15） |

> 不需要改 `pluginManager` 的组件注册逻辑（不新增业务组件 type），也不需要新增全局 provide（复用 `DESIGNER_CONTEXT_KEY`）。三套 `select` 的 `config.attribute` **不需要**加 `entity` 项（见 §6.3.1 例外）。
> **依赖方向（v0.17）**：`manager` 运行时 import `hooks`，因此 `hooks`（尤其新增的 `useBusinessFields`）**不得**运行时 import `manager`；所需组件配置查询以函数参数注入（core / panel 侧传入），纯过滤函数放 `utils`。

### 13.1 真实数据验证（易快报，2026-11-21）

用真实接口数据验证了 v1 范围（数据、脚本与示例见 [specs/mocks](mocks/README.md)）：

| 指标 | 数值 |
|---|---|
| 业务字段（propertySet） | 406 个，精简后可用 361（跳过 list / dynamic / dateRange / 专用类型） |
| 单据模板 | 35 个（28 启用 / 7 停用），共 748 个控件 |
| 控件可映射到现有组件 | 617 / 748 = 82.5% |
| 全部控件都能映射的模板 | 2 个 |
| 含费用明细（details）的模板 | 25 个 |

结论：v1 能覆盖"静态字段表单"约 82.5% 的控件实例；**明细表格、业务对象选择器、版式元素、公式默认值、动态规则、权限可见性**是主要缺口，已列入 §17.2。35 个模板各生成了一个静态字段示例，见 examples 的「例子」分类。

> 注：examples 的「例子」分类是 `EBuilder` 静态渲染示例（fixtures 由脚本全量重写），受控模式 demo 单独新建页面，不复用该目录。

---

## 14. 实施计划

> **前置条件**：本版（v0.17）评审通过。通过前不做任何代码改动。

| 阶段 | 内容 | 验收 |
|---|---|---|
| **P0** 验证基线（已完成） | 抓取易快报 propertySet / specificationGroups；生成 mock 数据与 35 个模板示例；确认 v1 覆盖 82.5% 控件 | 数据与示例可复现（specs/mocks 脚本）；examples「例子」可查看 |
| **P1** 设计器模式与元数据获取 | 类型与默认值；模式冻结快照；两段式解析 + 令牌；Loading/失败重试；根 form；modelId 写入/回填；默认 schema 实例隔离；补 mock `active:false` 样本；demo 骨架 | 受控/自由实例并存互不影响；加载失败可重试；非法字段被跳过告警；`active:false` 不出现 |
| **P2** 拖拽模板与面板 | 面板业务字段项（分组/搜索）、布局白名单 + 实例级过滤、统一构造入口、**唯一性落点校验（重复 field 拒绝）+ 摘除回滚 + id 重算**、属性面板 field 只读 | 拖入生成正确 type/id/field/props；重复 field 拖入被拒且无残留、无撤销记录；面板无原始输入组件 |
| **P3** 约束规则 | 复制/剪切禁止（静默）、跨 form 移动（`onMove` 预判 + 跨列表回滚 + 引用改写）、大纲拖拽禁用、源码面板只读、form 自动命名与重名校验 | 复制/剪切无反应；移动成功重算 id 且引用同步、冲突时源/目标均复原；大纲拖不动 |
| **P4** 持久化与导入 | PageSchema.modelId 保存/读取/回退/回填；`setDataAsync`；导入切换业务对象；保存/导入校验（重复 id/field 拒绝） | 保存后 JSON 带归属；导入不同对象自动重载并提示；失败不应用；撤销/跨对象恢复语义正确 |
| **P5** 文档、示例、测试、回归 | 文档（props/受控章节/hotkeys/updateLog）、受控 demo（三库）、单测、回归 | lint/typecheck/coverage 通过 + 手测清单 |

---

## 15. 测试计划

> **前置提醒（v0.17）**：`typecheck.tsconfig.json` 排除 `**/__test__/**` 与 examples，`eslint` 也忽略 `__test__`，`turbo.json` 无 test 任务 → 新增测试的类型/lint 问题只能靠**本地跑 vitest** 发现。每阶段必须手动执行 `pnpm vitest run` / `pnpm typecheck` / `pnpm lint`。

### 15.1 单元测试

| 用例 | 断言 |
|---|---|
| 元数据校验 | field 字符集/唯一性、type 不存在跳过、`active:false` 跳过、非法 props 拒绝 |
| schema 合并 | type/id/field/props/rules 正确；预设属性按白名单写入 |
| id 生成 | `${作用域节点 id}_${field}`；`normalizeType` 把 `-` 归一化为 `_`；子节点重发 |
| 落点回滚 | 重复 field 被摘除、目标 form 无残留、撤销栈无记录 |
| 已放置置灰 | 当前作用域已有该字段 → 面板项置灰、点击与拖拽均被阻止 |
| 唯一性 | 同作用域重复拒绝、不同作用域允许、嵌套 form 作用域、无 form 时回退根节点 |
| 复制拦截 | 受控：copy/cut/paste/duplicate 均返回 false、剪贴板未写、无撤销记录；自由：允许且重发 id |
| 跨 form 移动 | 源删目标增、目标冲突回滚、id 重算、动作 `componentId` 同步改写、无遗漏告警 |
| 业务对象 | schema 优先/prop 回退/保存写回/setData、撤销、历史导入后仍存在 |
| 两段式解析 | 挂载用 prop；schema 到达后切换；加载失败不应用 |
| 根节点 | 受控实例根 `type:'form'`、`name:'default'`；自由模式仍为 page |
| 字符集 | 非法 id/field 告警、不自动改写；`entity` 不参与校验 |
| field 只读 | 受控下属性面板不出现 `field` 项；label 可编辑 |
| 预设白名单 | money 只写 `precision`，不写 `unit`/`prefix`；`ref` 的 `props.entity` 例外不被过滤 |
| 作用域回退 | root=page 页面拖业务字段 → id 前缀为根 id |
| 根 form 布局 | 根 form 保留当前 UI 的 labelCol / labelLayout 等 props |
| setData 契约 | 一致路径同步应用；不一致且加载失败 → 回滚且不入撤销；`setDataAsync` 失败返回 false 且不应用 |
| reset | reset 后 modelId 保持当前值 |
| 撤销跨对象 | 快照为 A、当前 B → 恢复为 A 并提示重载；旧快照无值回填当前 |
| 导入校验 | 受控重复 id/field → 拒绝并列出冲突 |
| 大纲拖拽 | 受控下 `draggable` 关闭；自由模式不变 |
| 源码只读 | 受控下源码面板只读 |
| loader 契约 | 解包 `{modelId, properties}`；缓存命中不重复调用；令牌丢弃过期响应 |
| 模式冻结/双实例 | prop 变更只告警、行为不变；free + controlled 两实例互不影响 |
| form 命名 | 根 form `default`；拖入 form 自动 `form_N`；重名被拒 |
| 表单级配置 | required / defaultValue / placeholder / hidden / 长度 / min-max 落到节点 |
| 面板白名单 | 受控只出现业务字段 + `card`/`row`/`tabs` + `form` |

### 15.2 手动回归

1. 自由模式全功能回归；
2. 受控模式：加载元数据 → 面板 → 拖入 → 属性编辑 → 保存 → 刷新 → 预览；
3. 同一字段二次拖入被拒（列表无残留、Ctrl+Z 不出现空操作）；跨 form 各放一个；复制/剪切无反应；
4. 导入不同 modelId 页面 → 自动切换 + 提示；
5. 元数据接口失败 → 错误态 + 重试；
6. 旧页面（自由字段）在受控实例打开；
7. 三套 UI 库各跑一遍受控 demo（antd / element-plus / naive-ui）；
8. 自由模式实例与受控实例同页并存，互不影响；
9. 撤销/重做后页面 JSON 仍带 `modelId`；
10. 受控下：大纲节点拖不动、源码面板只读、属性面板无 `field` 项；
11. root=page 的旧页面在受控实例打开后拖业务字段 → id 前缀为根 id，不出现 undefined；
12. 导入含重复 id/field 的页面 → 被拒绝并列出冲突项；
13. `setData` / `setDataAsync` 触发元数据加载失败 → 回滚且归属不变；
14. 撤销跨越不同业务对象 → 提示并重载元数据。

### 15.3 覆盖率与既有测试

- 门槛：hooks 45 / manager 75 / utils 50（statements）；新代码集中在 hooks/utils，必须同步补测；
- `clipboard.ts` 当前 statements 100%，新增受控分支后必须补用例；
- 现 22 个测试文件 / 154 个用例（2026-11-22 实测），作为回归基线；新增预计 45–55 个用例；
- 现有测试全为纯 TS（无 `.vue` 测试）：新增用例优先抽纯函数（utils / hooks）；属性面板过滤、大纲禁用、label 回退等组件逻辑用 `@vue/test-utils` 少量覆盖并在评审中说明；
- `useClipboard` 新增 `canMutate` 必须默认 `true`，否则现有 3 参调用会全部变成"禁止"。

---

## 16. 风险与缓解

| 风险 | 缓解 |
|---|---|
| `designMode` 与 `isDesignMode` 混名 | 文档对比；面板只读 context 快照，渲染只读 pageManager |
| 元数据与 UI 库组件不匹配 | type 校验 + 跳过告警；预设按属性白名单过滤 |
| 元数据漂移（字段删除/改名） | 节点自带完整 schema，渲染不受影响；设计器提示（§10.3、§12） |
| 预设属性含函数 | 拖入走 structuredClone，注册/加载时校验纯数据 |
| 确定性 id 重复（同 field 两次） | 落点硬拦截；重复会连带破坏选中/撤销/大纲（`setSelectedNode` 按 id 查活节点） |
| 落点回滚时短暂渲染 | 跨 form 优先用 `onMove` 预判；`@add` 回滚路径需同时恢复源列表（见 §7.4） |
| 跨 form 移动引用遗漏 | `rewriteComponentRefs` 返回未改写清单 + 告警；单测覆盖 |
| 全局单例污染（面板过滤） | 强制实例级过滤，不改全局注册表；评审 diff 检查 |
| 默认 schema 模块级单例 | P1 改为实例级，否则"两实例并存"不成立 |
| 撤销/历史 modelId 语义 | 以快照值为准，快照缺省才回填当前；跨对象恢复重载元数据（§11.1） |
| 复制限制被绕过（源码面板/大纲） | 受控强制源码面板只读；大纲禁用拖拽（v0.17） |
| 测试全局单例污染 | `createPluginManager()` 隔离或 afterEach 清理 |
| typecheck/lint 不覆盖测试 | 新增测试后本地跑 vitest；评审时检查用例 |
| 覆盖率门槛（hooks 45 / manager 75 / utils 50） | 新代码同步补单测 |
| mock 无 `active:false` 样本 | P1 补样本，否则该分支无数据验证 |
| 跨列表移动回滚丢源节点 | `@remove`/`@end` 捕获源引用与 oldIndex，按 §7.4 顺序回滚；组件级测试 |
| `entity` 被白名单过滤 | `props.entity` 为白名单例外（§6.3.1）；不加入 select 属性面板 |
| 导入重复 id/field | 受控导入拒绝并列出冲突（§11.3） |
| 依赖方向（hooks→manager） | `useBusinessFields` 不运行时 import manager，配置查询注入（§13 注） |

---

## 17. 开放问题 / 后续演进

### 17.1 已关闭（v0.16–v0.17）

> 对应 v0.15 §17 的第 1 / 3 / 5 条。

1. ~~面板"已放置"置灰还是只做落点校验~~ → **按当前作用域置灰 + 禁止拖拽/点击，落点校验兜底**（§10.2、D26）；
2. ~~受控模式允许的布局组件范围~~ → **白名单 `card`/`row`/`tabs` + `form`**（§10.1、D24）；
3. ~~保存时元数据缺失字段：警告还是阻止~~ → **仅警告**（§11.3、D27）；
4. ~~源码/JSON 面板在受控模式下是否自动只读~~ → **源码面板强制只读，JSON 预览天然只读**（§9、D37）。

### 17.2 未决 / 后续

1. 每字段额外属性项：v1 只用基础组件自带属性面板，还是支持按字段追加/隐藏属性项。
2. 字段漂移提示方式：画布标红 / 大纲提示 / 不提示。
3. 自由模式在产品侧是否继续暴露（建议库保留、产品只开受控）。
4. `ref` 数据源：业务应用如何按 `entity` 提供选项（接口约定）；是否也允许元数据直接给静态 options；`props.entity` 之外的宿主注入协议。
5. 同一数据类型多控件：v1 是否允许在设计器里切换控件（如 `text` → 单行/多行），还是先用默认控件。
6. 后续能力：`defaultValue` 的 formula/sum、动态 `configs`、`dependence`/`filterId`、`visibility`、`priority`（可复用仓库已有的公式引擎）。
7. 元数据是否需要 `designable`（可放置）标志：真实数据 406 个字段里大量系统字段，全部进面板会失控；建议后端过滤或前端按规则过滤。
8. `ref` 且 `entity` 为「是否」维度时，是否映射成开关（switch）而不是下拉。
9. 明细表格（`details` / `requisitionDetails`，25 个模板有）是否提前到 v1.5，而不是完全推迟。
10. 布局白名单的扩展流程：后续新增布局组件（含 `col`/`tab-pane`/`modal` 是否需要进面板）如何评审与登记。
11. 已放置态如需轻量视觉提示（非置灰），口径与交互待定。
12. 元数据 loader 是否需要暴露 `AbortSignal`（当前用令牌丢弃过期响应）。
13. 受控模式下 Delete 删除是否需二次确认（当前按自由模式行为，直接删除入撤销栈）。
14. 补 mock `active:false` 样本的具体形态（改 `build_mock.py` 还是手写 demo 条目）。
15. `formMode` 与受控模式同时开启的产品口径（v0.16 暂定受控优先，见 §5.2）。
16. 受控模式「添加」弹层是否支持拖拽插入（v0.21 只支持点击插入）。

---

## 18. 决策记录

> v0.13 按"运行时元数据 + 拖拽模板"方向重构，以下为当前有效决策；此前基于"注册组件"的决策已作废。

| 编号 | 决策 | 结论 |
|---|---|---|
| D1 | 业务字段实现 | 不注册组件，是面板拖拽模板；节点 type = 组件层统一 type |
| D2 | 业务字段身份 | 元数据 `field`（业务对象内唯一），同时是 formData key |
| D3 | 节点 id | 受控 `${作用域节点 id}_${field}`；基础组件 `${normalizeType(type)}_${uuid}`；`normalizeType` 需新增，只影响新节点（v0.16/v0.17） |
| D4 | 字符集 | id/field/modelId：中文/字母/数字/下划线；禁中划线及其他特殊字符；`entity` 除外 |
| D5 | 设计模式 | `designMode: 'free' \| 'controlled'`，默认 free，实例级，不落盘，禁止切换 |
| D6 | 业务对象 | 一页一对象；EDesigner prop；PageSchema 保存；打开时 schema 优先，两段式解析 |
| D7 | 元数据获取 | 设计器挂载时经 loader 获取；Loading/失败重试；按业务对象缓存；令牌丢弃过期响应 |
| D8 | 类型映射 | 元数据给 `type`，经 6.3.1 映射表转成组件层 type；映射后不存在则跳过告警；不引入 kind |
| D9 | 唯一性 | 受控模式；唯一键 =（form + field）；落点校验失败回滚、不入撤销栈（v0.16） |
| D10 | 复制限制 | 按 designMode：free 允许；controlled 整体禁止（含 Ctrl+X）、静默无反应（v0.16） |
| D11 | 跨 form 拖拽 | 移动语义；目标 form 冲突禁止；id 重算 + 动作引用改写（v0.16） |
| D12 | 字段名 | 受控模式所有节点 field 只读；label 可改 |
| D13 | 运行时 | 不需要元数据；页面 JSON 携带 modelId |
| D14 | 子表/明细 | 不支持；由另一个业务对象承载 |
| D15 | 元数据版本号 | 不记录 |
| D16 | 自由模式 | 保持现状，不加载元数据、不加约束 |
| D17 | form 命名 | 受控自动命名 + 可改 + 重名校验；根 form 固定 `default`（v0.16） |
| D18 | 元数据模型 | 8 项：`field`/`label`/`type`/`scale`/`unit`/`entity`/`group`/`active`（v0.16） |
| D19 | 数据类型 → 控件 | `text→input`、`number/money→number`、`date→date`、`boolean→switch`、`ref→select`、`list` 暂不支持（跳过告警）；money 只写 `precision`（v0.16） |
| D20 | 表单级配置 | v1：`required`、`defaultValue`（常量）、`placeholder`、`hide`、`editable`、`maxLength`/`minLength`、`min`/`max`；其余后续 |
| D21 | `ref` 数据源 | 元数据只给 `entity`，选项由业务应用按 entity 解析；v0.16 明确写入节点 `props.entity` |
| D22 | v1 范围验证 | 以易快报真实数据为基线：v1 覆盖 617/748 控件（82.5%）；明细/版式/公式/动态规则/权限列入后续 |
| D23 | 拖拽校验时机 | 落点校验 + 回滚；拒绝不写撤销记录（v0.16） |
| D24 | 受控面板范围 | 业务字段 + `card`/`row`/`tabs` + `form`；其余表单组件不出现（v0.16） |
| D25 | 受控根节点 | `type:'form'`、`id:'root'`、`props.name:'default'`；不复用全局 formSchema（v0.16） |
| D26 | 已放置态 | 按当前选中节点所属作用域置灰并禁止拖拽/点击；落点校验保留为跨作用域兜底（v0.20） |
| D27 | 保存缺字段 | 仅警告，不阻止保存（v0.16） |
| D28 | 受控剪切 | Ctrl+X 与复制一并静默禁止（v0.16） |
| D29 | 预设属性 | 按 UI 组件 `config.attribute` 白名单过滤；money 只写 `precision`（v0.16） |
| D30 | loader 契约 | 返回 `Property[]`；包装由调用侧解包；令牌丢弃过期响应（v0.16） |
| D31 | 实现落点收口 | `useClipboard` 调用方判定、大纲独立收口、属性面板过滤 `field` 项、面板实例级过滤（v0.16） |
| D32 | 测试基建 | typecheck/lint 不覆盖测试 → 新测试必须本地跑 vitest；clipboard 补受控用例（v0.16） |
| D33 | 落点实现 | 占位节点已被库插入目标列表，`@add` **就地重建/替换或摘除回滚**，不再插入（v0.17） |
| D34 | 作用域回退 | 无 form 祖先时作用域=页面根节点，id 前缀=根 id（v0.17） |
| D35 | 唯一性口径 | 扫描作用域内所有 `input + field` 节点（含旧自由字段），不新增持久标记（v0.17） |
| D36 | 大纲拖拽 | 受控禁用，自由模式保持现状（v0.17） |
| D37 | 源码面板 | 受控强制只读（v0.17） |
| D38 | 根 form 布局 | 深拷贝当前 UI `form.defaultSchema` 后覆盖 id/name/children（v0.17） |
| D39 | setData/导入契约 | 新增 `setDataAsync`；同步 `setData` 乐观应用 + 失败回滚（v0.17） |
| D40 | 撤销/历史语义 | 快照有值以快照为准；快照缺省才回填当前（v0.17） |
| D41 | 导入校验 | 受控发现重复 id/field → 拒绝导入（v0.17） |
| D42 | 依赖方向与签名 | hooks 不运行时依赖 manager；`generateNewSchema` 第三参 options、第二参数组兼容（v0.17） |
| D43 | 字段分组 | **v1 不做分组**：元数据不返回 `group`（保留字段），面板平铺 + 搜索，数组顺序即展示顺序；后端不需要 group/sort（v0.18） |
| D44 | 业务对象标识 | 用业务对象**模型主键 id**（页面 JSON `modelId`，全局唯一）；`code` 仅展示/兼容，不作为归属键；跨租户导入按 id 校验、缺失则重新选择（v0.19 用 code，v0.36 修正） |
| D45 | 受控面板形态 | 左侧组件面板不常驻，改为工具栏「添加」弹层（业务字段 / 布局两页签，点击插入）；活动栏默认收起；弹层拖拽留待后续（v0.21） |
| D46 | 弹层多选 | 业务字段支持多选批量插入，按元数据顺序合并为一条撤销记录；已放置字段不可选（v0.22） |
| D47 | 字段分类与最近使用 | 优先用元数据 `group`，缺失时按数据类型自动分类；分类可折叠、支持分类全选；最近使用置顶（localStorage，最多 8 个）；搜索最多渲染 100 条（v0.23） |
| D48 | 添加字段模态面板 | 按界面描述重构为模态面板：标题栏 + 分类下拉/搜索/已选计数/只看已选 + 三列字段网格（⋯ 更多操作）+ 新建入口 + 说明 + 取消/确定；确定批量插入合并撤销（v0.24） |
| D49 | 面板位置 | 属性 / 样式 / 事件面板整体移到左侧活动栏（所有模式统一），右侧栏不再渲染；左侧默认展开第一个可用面板（v0.25） |
| D50 | 合并属性面板 | 属性 / 样式 / 事件合并为左侧单一「属性」面板，**底部页签切换**；活动栏只保留一个入口图标（v0.26） |
| D51 | 属性面板入口 | 活动栏**不设属性图标**；选中组件后左侧自动切换到属性面板，点其它图标切回（v0.27） |
| D52 | 属性面板常驻 | 属性面板**常驻**：初始化及未选中组件时展示页面（根节点）属性；选中组件展示该组件属性（v0.28） |
| D53 | 空白点击选中页面 | 点击画布空白处自动选中页面根节点并显示页面属性；选中动作带版本号，同一节点重复选中也刷新面板（v0.29） |
| D54 | 自由模式组件弹出框 | 自由模式左侧「组件」图标打开弹出框：支持拖拽落点与多选批量插入，插入/点外部自动收起（v0.30） |
| D55 | 添加字段入口位置 | 受控模式「添加字段」入口移到左侧活动栏，与自由模式「组件」同位置；工具栏不再有添加按钮（v0.31） |
| D56 | 布局/输入入口拆分 | 布局组件与输入类组件各一个入口按钮（受控/自由统一）；受控「输入」替换为「添加字段」模态面板（v0.32） |
| D57 | 选择器统一复用 | 受控「添加字段」复用自由模式同一弹出选择器（仅内容换成业务字段，按 group/类型分组）；移除独立模态面板实现（v0.33） |
| D58 | 字段平铺 + 类型下拉 | 受控添加字段弹层平铺不折叠；搜索框前增加类型下拉（全部 + 各分组），支持关键字搜索（v0.34） |
| D59 | 属性更名 modelId | `businessObject` 统一更名为 `modelId`（设计器 prop 与页面 JSON 顶层字段一致）；**值 = 业务对象模型主键 id**（v0.35 更名，v0.36 修正语义） |

### 18.1 变更记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v0.1–v0.12 | 2026-11-20 | 基于"注册组件"方向的多轮迭代（已被 v0.13 取代） |
| v0.13 | 2026-11-21 | 按「运行时元数据 + 拖拽模板」重构：业务字段不注册组件；modelId 随页面保存；元数据协议；id/field 统一字符集；重写影响面与计划 |
| v0.14 | 2026-11-21 | 参考易快报 propertySet / specificationGroups：元数据精简为 7 字段；新增 dataType→控件映射；表单级配置收敛为 v1 范围；`ref` 数据源只给 entity |
| v0.15 | 2026-11-21 | 补充真实数据验证（§13.1：406 字段 / 35 模板 / 748 控件，v1 覆盖 82.5%）；新增开放问题（designable 过滤、是否维度映射、明细优先级）、P0 验证基线与决策 D22 |
| v0.16 | 2026-11-22 | 落实评审 Q1–Q3：①拖拽改为**落点校验 + 回滚**（§7.1/7.2、§8.2、D23）；②跨 form 移动**重算 id + 动作引用改写**（§7.4、D11）；③受控面板 = 业务字段 + `card`/`row`/`tabs` + `form`（§10.1、D24）。同时按代码现状修正：受控根节点为 form（D25）、元数据两段式解析（§6.2）、modelId 回填（§11.1）、预设属性白名单（§6.3.1、D29）、`normalizeType`（§7.3）、复制/剪切拦截落点（§9、D28/D31）、元数据模型口径统一为 8 项（D18）、删除表单必填的旧表述冲突；关闭 §17-1/3/5；新增 §1.1 实现约束、§15.3 测试基建、7 条新风险与 D23–D32 |
| v0.17 | 2026-11-22 | 落实独立评审 10 阻塞 + 13 建议：①落点时序修正——占位节点**已由库插入**，`@add` 就地重建/摘除（D33）；②作用域回退根节点、id 前缀明确（D34）；③唯一性扫描含旧字段（D35）；④跨 form 移动 `onMove` 预判 + 跨列表回滚（§7.4）；⑤大纲拖拽受控禁用（D36）；⑥`props.entity` 白名单例外（§6.3.1）；⑦撤销/历史以快照值为准（D40）；⑧`setDataAsync` + 同步乐观回滚（D39）；⑨根 form 布局取 UI defaultSchema（D38）；⑩源码面板强制只读（D37）；⑪导入重复 id/field 拒绝（D41）；⑫依赖方向与 `generateNewSchema` 签名兼容（D42）；同步修正 `schedule` 字段、label 一致性、测试用例与风险清单，更新 §0-33~41 与 D33–D42 |
| v0.18 | 2026-11-22 | 确认 v1 **不做字段分组**：元数据不返回 `group`、面板平铺 + 搜索、数组顺序即展示顺序；后端表无需 group/sort 字段（§6.3、§10.1、D43） |
| v0.19 | 2026-11-22 | 确认业务对象标识用 **`code`**（租户内唯一，`(tenant_id, code)`；`id` 仅内部主键、不进页面 JSON）；`code` 不可改名；跨租户导入按同 code 解析（§6.1、D44） |
| v0.20 | 2026-11-22 | 按产品反馈调整已放置态：业务字段在当前作用域放置后**面板置灰且不可拖拽/点击**，落点校验保留为跨作用域兜底（§10.2、D26） |
| v0.21 | 2026-11-22 | 按产品反馈调整面板形态：受控模式左侧组件面板不再常驻，改由**工具栏「添加」弹层**（业务字段/布局两页签、点击插入、已放置置灰），活动栏默认收起，画布空间最大化（§10.1、D45） |
| v0.22 | 2026-11-22 | 弹层支持**多选批量插入**：勾选多个字段一次插入，按元数据顺序、合并为一条撤销记录（§10.1、D46） |
| v0.23 | 2026-11-22 | 面向「上百上千字段」：优先按元数据 `group`、缺失时按数据类型自动分类；分类折叠 + 分类全选；最近使用置顶（localStorage）；搜索扁平输出且最多渲染 100 条（§10.1、D47） |
| v0.24 | 2026-11-22 | 按《添加字段面板-界面描述》把选择器重构为**模态面板**：标题栏 + 分类下拉/搜索/已选计数/只看已选开关 + 三列字段网格（⋯ 更多操作）+ 新建入口 + 说明 + 取消/确定；确定批量插入合并撤销（§10.1、D48） |
| v0.25 | 2026-11-22 | 属性 / 样式 / 事件面板整体移到**左侧活动栏**（所有模式统一），右侧栏不再渲染；左侧默认展开第一个可用面板（§10.3、D49） |
| v0.26 | 2026-11-23 | 三个面板**合并为左侧单一「属性」面板**，底部页签切换（属性 / 样式 / 事件），活动栏只保留一个入口（§10.3、D50） |
| v0.27 | 2026-11-23 | 活动栏移除属性图标；**选中组件后左侧自动切换**到属性面板，点组件/源码/大纲图标切回（§10.3、D51） |
| v0.28 | 2026-11-23 | 属性面板改为**常驻**：初始化/未选中时展示页面（根节点）属性，选中组件后展示组件属性（§10.3、D52） |
| v0.29 | 2026-11-23 | 点击画布空白处**自动选中页面根节点**并显示页面属性；选中动作带版本号，同一节点重复选中也刷新面板（§10.3、D53） |
| v0.30 | 2026-11-23 | 自由模式左侧「组件」改为**弹出框**：支持拖拽落点与多选批量插入，插入/点外部自动收起（§5.3、§10.5、D54） |
| v0.31 | 2026-11-23 | 受控模式「添加字段」入口移到**左侧活动栏**（与自由模式「组件」同位置），工具栏不再有添加按钮（§10.1、D55） |
| v0.32 | 2026-11-23 | 组件入口拆分为**「布局」+「输入/字段」两个按钮**（受控/自由统一）；布局选择器与输入选择器各自拖拽/多选（§5.3、§10.5、D56） |
| v0.33 | 2026-11-23 | 受控「添加字段」**复用自由模式同一弹出选择器**（仅内容为业务字段），移除独立模态面板实现（§10.1、D57） |
| v0.34 | 2026-11-23 | 字段弹层**平铺不折叠**，搜索框前增加**类型下拉**（全部 + 各分组），支持关键字搜索（§10.1、D58） |
| v0.35 | 2026-11-24 | 属性更名：`businessObject` → **`modelId`**（设计器 prop 与页面 JSON 顶层字段一致）（§5.1、D59） |
| v0.36 | 2026-11-24 | 修正 `modelId` 语义：**业务对象模型主键 id**（不是 code）；页面 JSON 只存 `modelId`，`code` 仅展示/兼容；不再套用 id/field 字符集（§6.1、D44、D59） |

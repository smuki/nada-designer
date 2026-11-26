# 受控模式 vs 自由模式 —— 代码层与逻辑层完整对照

> 基于当前仓库 `393f527`（spec v0.36；`modelId` = 业务对象模型主键 id）逐文件阅读整理。
> 分析期间仓库被连续推了 4 个提交（`21fe96f` → `393f527`），见 §7.7 的时间线。
> 文中 `路径:行号` 均为当前 HEAD 的真实位置。

---

## 0. 一句话结论

**这不是两套设计器，而是一套设计器上的一个「策略开关」。**

`designMode` 只做两件事：

1. **换掉事实源**：自由模式的事实源是「组件注册表」（`pluginManager.component`）；受控模式的事实源是「业务对象元数据」（`Property[]`，宿主通过 `businessFieldLoader` 注入）。
2. **在事实源之上加持约束**：字段身份只读、同一作用域内 `field` 唯一、禁止复制/剪切、结构落点可校验、导入可拒绝。

渲染、拖拽、撤销栈、属性编辑、样式/事件、预览、画布缩放——**全部共用同一套实现**，没有任何一条通路是"受控专用设计器"。所以差异高度集中在 **入口选择 → 落点构造 → 权限收口 → 校验** 这四个环节。

---

## 1. 模式的声明、冻结与传递

| 位置 | 事实 |
|---|---|
| `packages/types/src/designer.ts:57` | `designMode?: 'controlled' \| 'free'`，默认 `'free'`（`designer.vue:39`） |
| `packages/core/src/components/designer/src/designer.vue:71-72` | `const designMode = props.designMode === 'controlled' ? 'controlled' : 'free'` —— **只读一次，形成冻结快照** |
| `designer.vue:74-84` | 后续 prop 变化只 `console.warn('designMode 初始化后不可切换')`，**行为不变** |
| `packages/hooks/src/designer/useDesignerContext.ts:13-14` | 该快照以 `designMode: 'controlled' \| 'free'` 放进 `DesignerContext` |
| `designer.vue:186-205` | `provide(DESIGNER_CONTEXT_KEY, { designMode, ... })` |
| 所有面板 | `const isControlled = designer.designMode === 'controlled'`（**setup 期一次性读取，非响应式**） |

两个重要推论：

- **`designMode` 不落盘**。`PageSchema`（`packages/types/src/nada-designer.ts:67-77`）只有 `canvas / modelId / schemas / script`，没有 `designMode`。落盘的是 `modelId`。
- 面板侧的非响应式读取**当前是安全的**（模式冻结）；但一旦将来放开切换，所有面板都不会重渲染——这是隐含耦合。

### 相关的三个「模式」概念不要混

| 概念 | API | 含义 |
|---|---|---|
| `designMode` | `'free' \| 'controlled'` | **本次讨论的**：字段来源与约束策略 |
| `formMode` | `boolean` | 自由模式下的"表单模式"：默认根节点换成 form、全局隐藏 `form` 组件（`useDesigner.ts:126-133`）。**受控模式完全跳过这段** |
| `pageManager.setDesignMode()` | `boolean` | `packages/manager/src/pageManager.ts:373`，指"设计态/预览态"，与上面无关，纯命名撞车 |

---

## 2. 代码层：模式分支的完整分布

全仓字面读取 `designMode` 的分支点共 **19 处**（7 处快照声明 + 12 处使用），分布如下。

### 2.1 核心层（`packages/core`）

| 文件:行 | 分支 | 受控 | 自由 |
|---|---|---|---|
| `hooks/useDesigner.ts:82-88` | 默认根节点 | `createControlledFormRoot()`：`type:'form'`、`id:'root'`、`name:'default'` | `createPageRoot()`：`type:'page'`、`id:'root'` |
| `hooks/useDesigner.ts:121-134` | `if (designMode !== 'controlled')` | **跳过** `defaultSchema` 覆盖、`formMode` 处理、`hide/show('form')` | 执行 |
| `hooks/useDesigner.ts:100-106` | `canMutate: () => designMode === 'free'` | 复制/粘贴/重复静默禁用 | 允许 |
| `hooks/useHotkeys.ts:31-36` | 同上 | Ctrl+C/V/X/D 静默无效 | 允许 |
| `designer.vue:141-145` | 挂载时 | `businessFields.load(initialModelId)` | 不加载 |
| `designer.vue:147-166` | 首屏门控 | 元数据 `error/empty` 时整页阻塞 + 重试 | 只等 UI 初始化 |
| `designer.vue:251-277` | `importSchema` | 先 `validateControlledPage` + 加载目标元数据，失败返回 `false` 不应用 | 直接应用 |
| `designer.vue:284-313` | `setData` | 业务对象变化时**乐观应用 + 失败回滚** | 同步应用 |
| `designer.vue:316-335` | `setDataAsync` | 先加载元数据，失败返回 `false` | 同步应用后返回 `true` |
| `designer.vue:348-367` | `handleSave` | 扫描 `input` 节点的未知 `field`，仅 `console.warn` | 不检查 |
| `modules/editContainer/nodes.vue:157-187` | `handleDragMove` | 跨 form 移动前预判 `field` 重复，重复则拒绝拖动 | 早退放行 |
| `nodes.vue:272-306` | `handleDragAdd` | ①已有字段跨列表移动 → 重算 id + 改引用；②占位节点 → 落点构造/摘除；③拖入 form → 自动命名 | 普通拖入 + 入撤销栈 |
| `modules/activityBar/index.vue:32,39-48` | 活动栏图标集 | 移除「组件」，追加「添加字段」 | 保留「组件」 |
| `modules/editContainer/previewWidgets.vue:384` | 画布浮层 | 无「复制」按钮 | 有「复制」 |

### 2.2 面板层（`packages/ui-kit/panel-ui`）

| 文件:行 | 分支 | 受控 | 自由 |
|---|---|---|---|
| `rightSidebars/attribute/attribute.vue:64-73` | 属性项过滤 | 过滤掉所有 `field === 'field'` 项；根节点额外过滤 `props.name` | 原样返回 |
| `attribute.vue:98-112` | 只读业务字段行 | 渲染 `field` + 元数据类型（缺失时提示"元数据中不存在"） | 不渲染 |
| `rightSidebars/attribute/modules/attributeItem.vue:87-112` | 表单名唯一校验 | 全页扫描 form 重名/空名 → 警告 + 回退 | 跳过 |
| `activitybars/outline/outline.vue:84` | 大纲树 | `:draggable="false"` | 可拖 |
| `outline.vue:49` | `handleCopy` | 静默 `return` | 复制节点 |
| `outline.vue:149` | 复制图标 | 不渲染 | 渲染 |
| `activitybars/sourceCode/index.vue:47` | 源码面板 | `sourceCodeReadOnly \|\| isControlled` → **强制只读** | 由 prop 决定 |
| `activitybars/componentView/index.vue:204/275` | 旧侧栏组件面板 | 受控/自由两棵模板 | —— |

> ⚠️ `componentView/index.vue` 实为**死代码**：在 v0.30~v0.34 的面板重构之后，活动栏点击「组件」会直接打开 `ComponentPicker` 弹层（`activityBar/index.vue:115-118`），不再把该组件放进 `sidebarComponent`；受控模式更是把它从图标列表里过滤掉了（`activityBar/index.vue:32`）。全仓仅有 `activitybars/index.ts:11` 注册和 `componentView.test.ts` 直接挂载引用它。**它的模式分支只有测试在跑，不代表线上行为。**

### 2.3 关键点：受控/自由其实是「同一个选择器 + 内容分支」

模式差异在 UI 上几乎全部由 `componentPicker.vue` 的一个 prop 承载，**不是** `designMode`：

```ts
// componentPicker.vue:31-37
mode?: 'field' | 'input' | 'layout'   // 默认 'input'
```

| `mode` | 打开入口 | 内容源 | 插入路径 |
|---|---|---|---|
| `'input'` | 自由模式「组件」图标 | 组件注册表分组 | `generateNewSchema` + `splice` |
| `'layout'` | **两模式共用**「布局」图标 | 注册表 ∩ `['card','form','row','tabs']` | `generateNewSchema` + `splice` |
| `'field'` | 受控模式「添加字段」图标 | `businessFields.fields` | `businessFields.insertField` + 落点校验 |

`activityBar/index.vue:120` 的注释写得很直白：`// 受控模式：添加字段入口（复用同一弹出框，仅内容不同）`。

**布局分支是两模式 100% 同一段代码**。字段分支是共享外壳（搜索 / 多选 / 拖拽克隆 / 批量插入 / 自动收起）内的独立数据分支。

---

## 3. 逻辑层：逐条规则对照

| # | 规则 | 自由模式 | 受控模式 | 实现位置 |
|---|---|---|---|---|
| 1 | 根节点 | `page`（`id: root`） | `form`（`id: root`、`name: default`），深拷贝当前 UI 库 form 的 `defaultSchema` | `useDesigner.ts:40-68` |
| 2 | 可添加内容 | 注册表全部组件 | 业务字段（元数据） + 布局白名单 `card/form/row/tabs` | `componentPicker.vue:50,141-164` |
| 3 | 字段来源 | 无 | `businessFieldLoader(modelId)` → 校验 → 缓存 | `designer.vue:104-129`、`useBusinessFields.ts:191-249` |
| 4 | 节点 `id` | `${type}_${4位随机}` | 业务字段：`${作用域节点id}_${field}` | `data.ts:152`、`businessFields.ts:154` |
| 5 | 节点 `field` | `= id`（可编辑） | `= 元数据 field`（**属性面板隐藏编辑项**） | `data.ts:183-189`、`attribute.vue:68` |
| 6 | 类型映射 | —— | `text→input`、`number/money→number`、`date→date`、`boolean→switch`、`ref→select`、`list→不支持(跳过)` | `businessFields.ts:19-41` |
| 7 | 预设 props | —— | `money/number` 写 `props.precision = scale`；`ref` 写 `props.entity`（白名单例外）；`unit` 不写 | `businessFields.ts:48-79` |
| 8 | 同作用域内重复字段 | 允许 | **面板置灰 + 落点校验拒绝** | `componentPicker.vue:212-228`、`useBusinessFields.ts:325-346` |
| 9 | 复制 / 剪切 / 粘贴 / Ctrl+D | 允许 | **整体静默禁止**（无提示、不入撤销栈） | `clipboard.ts:35-37,43,53,75,96` |
| 10 | 大纲拖拽 | 允许 | 禁止（只读导航） | `outline.vue:84` |
| 11 | 源码面板 | 可编辑 | 强制只读 | `sourceCode/index.vue:47` |
| 12 | 跨 form 拖拽已有字段 | 普通移动 | 视为「移动」：重算 `id`、改写 `on.*[].componentId` 引用；目标已有同字段则拒绝 | `nodes.vue:157-212`、`businessFields.ts:172-195` |
| 13 | 新建 form 命名 | 沿用 `defaultSchema`（`default`） | 拖入时自动 `form_1/form_2…`；属性面板改名查重 | `nodes.vue:252-266`、`attributeItem.vue:87-112` |
| 14 | 导入 / `setData` 校验 | 无校验 | id/field 字符集、id 唯一、作用域内 field 唯一；元数据加载失败则拒绝/回滚 | `utils/businessFields.ts:228-284`、`designer.vue:251-335` |
| 15 | 保存 | 直接 `emit('save')` | 额外扫描未知 `field`，仅告警 | `designer.vue:352-371` |
| 16 | 页面 JSON | —— | 多一个 `modelId` | `pageSchema.modelId` |
| 17 | 首屏 | UI 就绪即渲染 | 需等元数据 `ready`，否则阻塞 + 重试 | `designer.vue:147-166` |
| 18 | 删除 | 允许 | **仍允许**（只禁复制） | `previewWidgets.vue:391-397`、`outline.vue:155-160` |
| 19 | 元数据型删除/样式/事件/预览 | —— | 与自由模式完全相同 | —— |

### 唯一性判定的「作用域」定义

- 作用域键 = **最近的 `form` 祖先节点**，找不到回退页面根节点：`businessFields.ts:87-102` `resolveScopeNode`、`nodes.vue:99-128`。
- 唯一键 = `(作用域节点 id, field)`。
- 三层执行点：**面板置灰**（预览级）→ **落点校验**（拖入 / 跨 form 移动）→ **点击插入前校验**（`checkField`）。失败时摘除占位节点、弹 warning、**不写撤销栈**。

---

## 4. 两条完整数据流

### 4.1 自由模式：拖一个 input 进画布

```
「组件」图标 → pickerMode='input'              activityBar/index.vue:115
  ↓
ComponentPicker(mode=input) 渲染注册表分组      componentPicker.vue:141-164
  ↓ 拖拽开始，cloneItem()
generateNewSchema(schema)                      componentPicker.vue:243 → data.ts:146
   id = `${type}_${随机4位}`；field = id
  ↓ 落到 VueDraggable 列表
nodes.vue:272 handleDragAdd（三个受控分支全不命中）
  ↓
setSelectedNode + revoke.push('拖入组件', true)  nodes.vue:301-305
```

### 4.2 受控模式：拖一个业务字段进画布

```
「添加字段」图标 → pickerMode='field'           activityBar/index.vue:121
  ↓
ComponentPicker(mode=field) 读 businessFields.fields（平铺 + 类型下拉）
  ↓ 拖拽开始，cloneItem() 产出占位节点
{ __businessField: meta, id: '__pending_<field>', type: '__pending' }
                                               componentPicker.vue:234-242
  ↓ 先过 onMove 预判（跨 list 才校验）
nodes.vue:157 handleDragMove → 目标作用域已有同 field → return false（拖不进去）
  ↓ 落到 VueDraggable 列表
nodes.vue:282 handleDragAdd → handleBusinessFieldDrop
  ↓
scopeId = getTargetScopeId()（最近 form 祖先）  nodes.vue:99-111
  ↓
designer.businessFields.checkField(meta, scopeId)   useBusinessFields.ts:325
   ├ buildNode: mapFieldDataType → 组件 defaultSchema 深拷贝
   │            id = `${scopeId}_${field}`，field/label 覆写
   │            props 按该组件 config.attribute 白名单过滤预设值
   ├ hasFieldInScope(scope, field) → 重复则拒绝
   └ findSchemaById(node.id) → id 冲突则拒绝
  ↓
成功：list.splice(index, 1, node) → 选中 → revoke.push('插入业务字段', true)
失败：list.splice(index, 1)（摘除占位）→ $message.warning → 不写撤销
                                               nodes.vue:235-246
```

**核心差异一目了然**：自由模式是「克隆一个注册表模板就直接落地」；受控模式是「先落一个占位节点，再在**落点上下文**里算作用域、构造正式节点、校验、替换」——因为业务字段的 `id` 依赖落点（`scopeId`），无法在拖拽源处确定。

这也直接解释了两条设计约束：

- 为什么受控模式**禁用大纲拖拽**（`outline.vue:84`）：大纲树各级共用 `tree-draggable` group，可跨父移动，会绕过上面这条落点管线。
- 为什么受控模式**强制源码面板只读**（`sourceCode/index.vue:47`）：手改 JSON 可绕过 `field` 只读与唯一性。

---

## 5. 权限收口的实现方式（`canMutate`）

受控模式禁止复制/剪切/粘贴，没有在 3 个入口分别写判断，而是在 `useClipboard` 上加了一个开关：

```ts
// packages/hooks/src/common/clipboard.ts:11-14
export interface UseClipboardOptions {
  /** 是否允许变更（受控模式返回 false 时整体静默禁止）；默认允许 */
  canMutate?: () => boolean;
}
```

```ts
// clipboard.ts:43-47
function copy(selectedNode) {
  if (!canMutate() || !selectedNode?.id) return false;
  ...
}
```

调用方注入策略：

- `useDesigner.ts:100-106` —— `{ canMutate: () => designMode === 'free' }`（管画布浮层的「复制」）
- `useHotkeys.ts:31-36` —— 同一策略（管 Ctrl+C/V/X/D）

`copy / cut / paste / duplicate` 四个函数全部首行早退，**不弹提示、不写撤销栈**，即 spec 所说的"静默禁止"。大纲的复制是**第三个独立入口**，单独在 `outline.vue:49` 加守卫（图标 `v-if` 是第二道防线）。

---

## 6. 元数据层的状态机

`useBusinessFields`（`packages/hooks/src/designer/useBusinessFields.ts`）在**两种模式下都会创建**（`designer.vue:104`），但只有受控模式会真正 `load`。自由模式拿到的是一个 `fields = []`、`status = 'empty'` 的空上下文。

状态：`'empty' | 'loading' | 'ready' | 'error'`（`:20-21`）

```
empty ──load(modelId)──> loading ──成功──> ready
  │                        │
  │                        └──失败──> error ──retry()──> loading（force 跳过缓存）
  └─ 未指定 modelId / 未提供 loader 时停在 empty（designer.vue 显示阻塞态）
```

几个值得注意的实现细节：

- **跨实例内存缓存**：`const fieldsCache = new Map<string, Property[]>()`（`:62-63`），模块级、跨实例共享，只读。
- **请求令牌**：`let token = 0`（`:174`），切换业务对象时丢弃过期响应（`:219,226,243`）。
- **单条失败不影响其余**：`validateProperty`（`:71-156`）逐条校验，非法条目推 `issues` + `console.warn`，其余照常进入面板。
- **`active === false` 的字段**：不进入面板，但**不报 issue**（`:134-137`），意图是"仍记录在元数据中，用于漂移提示"。
- **两段式解析**：挂载时先后解析 `props.defaultSchema?.modelId ?? props.modelId`（`:142-145`）；`schema` 晚到时由 `watch(() => pageSchema.modelId)` 补一次（`:132-139`）。这是为"打开已有页面时 schema 在 `onMounted` 之后才到"设计的。

---

## 7. 当前实现的缺口与风险

以下均为**读代码可直接证实**的问题，按影响排序。

### 7.1 嵌套 form 的作用域判定会越界（逻辑 bug）

`getPlacedFields` / `hasFieldInScope` 用的是 `findSchemas(scope.children, ...)`：

```ts
// useBusinessFields.ts:353-363
function getPlacedFields(nodeId?: string): string[] {
  const scope = resolveScope(nodeId);
  return findSchemas(scope.children ?? [], (node) => node.input === true && Boolean(node.field))
    .map((node) => node.field);
}
```

而 `findSchemas`（`data.ts:595-634`）是**无边界 DFS**，会继续下钻 `children` 和 `slots`。这意味着：父 form 的"已放置字段"集合会**包含嵌套子 form 里的同名字段**，导致

- 面板过度置灰（子 form 里放过的字段，父 form 也显示"已放置"）；
- 落点过度拒绝（`checkField` 走同一个 `hasFieldInScope`）。

对比 `validateControlledPage`（`businessFields.ts:248`）——它用 `const nextScope = node.type === 'form' && node.id ? node.id : scopeId;` 正确维护了作用域栈。**同一条规则，导入校验和落点校验口径不一致。**

### 7.2 点击/批量插入 form 不会自动命名 → 静默重名

`nodes.vue:291-299` 只在**拖拽落点**路径给 form 自动命名（`form_1`…）。而 `componentPicker.vue:291-305` 的批量插入走 `generateNewSchema(defaultSchema)`，`generateNewSchema`（`data.ts:146-194`）只改 `id`/`field`，**不动 `props.name`**；三套 UI 库 form 的 `defaultSchema.props.name` 都是 `'default'`。

→ 受控模式下从「布局」选择器**勾选插入 form**，会得到一个 `name: 'default'` 的 form，与根 form 重名，且没有任何校验或提示。属性面板改名的查重（`attributeItem.vue:87-112`）只拦"手动改名"这一条路径。

### 7.3 导入校验不查表单重名

`validateControlledPage` 只校验 id/field 字符集、id 唯一、作用域内 field 唯一（`businessFields.ts:228-284`），**不含 form 名称唯一**。spec §8.3 要求"落点与属性编辑时重名校验"，导入这一环是缺的。

### 7.4 布局白名单定义了两份，且不参与结构校验

| 站点 | 常量 | 状态 |
|---|---|---|
| `componentView/index.vue:25-26` | `LAYOUT_WHITELIST = new Set(['card','form','row','tabs'])` | **死代码** |
| `componentPicker.vue:50` | `LAYOUT_TYPES = new Set(['card','form','row','tabs'])` | 线上生效 |

成员相同但无共享定义，改一处会漏另一处。更关键的是：白名单**只约束面板可选内容**，`validateControlledPage` 完全不查它——导入来的旧页面里 `col`/`modal`/`tab-pane` 等照常渲染。这是"面板约束"而非"结构约束"，spec §12 也如此声明，但容易被误解。

### 7.5 「已放置字段」只禁点击、不禁拖拽

在线 picker 给已放置条目加了 `.disabled` 类（`componentPicker.vue:396-399`）和点击拦截（`:220-228`），但**没有传 Sortable 的 `filter`**，所以仍可拖出。拖到画布后由 `nodes.vue:235-242` 的落点校验拒绝并摘除占位。

行为上没错（兜底存在），但 UX 上"看得见置灰、却拖得动、拖过去才弹提示"，与被旁路的旧实现（`componentView` 传了 `filter=".is-placed"`）不一致。

### 7.6 `hiddenComponents` 是模块级单例，可能让受控模式加不了 form

`useDesigner.ts:126-133`：

```ts
if (designMode !== 'controlled') {        // ← 受控完全跳过这段
  ...
  pluginManager.component.hide('form');
  ...
  pluginManager.component.show('form');
}
```

`hiddenComponents` 是 pluginManager 模块级状态（跨实例共享）。若同页存在一个 `formMode: true` 的自由模式实例，它会把 `form` 全局隐藏；而受控实例因为这段被跳过**永远不会 `show('form')` 回来**，于是「布局」选择器的注册表里没有 form，受控模式就无法添加表单。旧的 `componentView` 实现专门有兜底（`collectLayoutItems()` 里 `if (!seen.has('form'))` 从注册表补 `defaultSchema`），**在线 picker 没有这个兜底**。

### 7.7 `modelId` 更名与语义修正（阅读期间连续落地，现已一致）

这一节记录一个**时间线事实**，因为它是本次分析的一手观察：仓库在分析过程中被连续推了 4 个提交，`HEAD` 从 `21fe96f` 走到 `393f527`。

| 提交 | 内容 |
|---|---|
| `69a4cf3` | `refactor: businessObject 更名为 modelId`（代码） |
| `8016751` | `docs(spec): v0.35 businessObject 更名 modelId`（文档） |
| `49b7f73` | `refactor: modelId 语义修正为业务对象模型主键 id`（代码） |
| `393f527` | `docs(spec): v0.36 modelId 为业务对象模型主键 id`（文档） |

**命名一致性现在的结论**：

- 代码：`props.modelId`（`types/src/designer.ts:65`）、`pageSchema.modelId`（`types/src/nada-designer.ts:74`），`businessFieldLoader(modelId: string)`（`designer.ts:52`）——**全仓代码中已不存在 `businessObject`**。
- 文档与 demo：`docs/guide/components/controlledMode.md:38` 与 `examples/src/views/designer/controlledMode/index.vue:23` 都已改成 `model-id="1001"`。
- 语义：`modelId` 现在是**业务对象模型主键 id**（字符串传递，避免大整数精度丢失），**不再套用 id/field 字符集**；`isValidSchemaName` 的注释与实现已收缩为只管 `id`/`field`（`string.ts:61,65` + `useBusinessFields.ts:98`、`businessFields.ts:239,251`），前后一致。

**一个值得记住的中间态**：`69a4cf3` 把 prop 改成 `modelId` 时，只改了 demo 的**注释**（`examples/.../index.vue:13`），模板里的 `business-object="销售单据"` 原样留着。那段时间受控 demo 是**真的渲染不出来**的，链路为：

```
designer.vue:142-143        props.modelId === undefined → businessFields.load('')
useBusinessFields.ts:195-199 空 id → status='empty'、error='未指定业务对象'
                            （modelId.value 不被赋值，仍是 null）
designer.vue:154-161        metaBlocked=true → 整页「未指定业务对象」+ 重试
useBusinessFields.ts:264-267 retry(): if (!modelId.value) return false → 重试是死按钮
```

它在 `49b7f73` 被修掉了（改成 `model-id="1001"`，loader 的判等值同步从 `'销售单据'` 改为 `'1001'`）。**之所以能潜伏两个提交**：`packages/core` 零测试（§7.9），`examples` 没有 typecheck 脚本，根 `typecheck.tsconfig.json` 的 `include` 也不含 `examples`。也就是说，**一个不存在的 prop 名可以一路静默通过所有检查**——这是当前工程防护的真实缺口，比这个具体 bug 更值得修。

### 7.8 `normalizeType` 已实现但未接线

`string.ts:57-59` 定义了 `normalizeType`（`color-picker` → `color_picker`），spec §7.3 要求用它拼节点 id 前缀：

```
`${normalizeType(type)}_${uuid}`    // spec 期望
`${type}_${uuid}`                   // data.ts:152 实际
```

全仓 `normalizeType` 除自身定义和单测外**零调用**。它只影响带中划线类型的新节点（受控模式下这些组件本来也不在面板里，所以实际影响很小），属于"规格写了、函数建了、没接上"。

### 7.9 测试覆盖缺口（含一个惊人的分布）

按包统计测试文件数（`*.test.ts` / `*.test.tsx` / `*.spec.ts`，排除 `node_modules`）：

| 包 | 测试文件数 | 说明 |
|---|---|---|
| `packages/utils` | 17 | 纯函数、校验、树操作 |
| `packages/hooks` | 5 | `useBusinessFields`、`clipboard` 等 |
| `packages/manager` | 3 | `revoke`、`pageManager` |
| `packages/ui-kit` | 3 | 全部在 `panel-ui/src/__test__` |
| **`packages/core`** | **0** | **`designer.vue` / `useDesigner` / `useHotkeys` / `nodes.vue` / `activityBar` / `componentPicker` 全无测试** |
| `packages/types` / `ui` / `nada-designer` | 0 | —— |

即：**受控模式最关键的三块——落点管线（`nodes.vue` 三个分支）、共享选择器（`ComponentPicker`）、数据集约层（`designer.vue` 的导入/回滚/门控）——全部零测试**。而 `panel-ui` 那 3 个测试里，`componentView.test.ts` 测的是**已经不可达的旧面板**（§2.2）。

| 有测试 | 无测试 |
|---|---|
| `useBusinessFields.test.ts`（加载/缓存/令牌/`checkField`/`insertField`/`buildNode`） | `ComponentPicker` 三种模式内容切换、批量插入、占位克隆 |
| `componentView.test.ts`（**死代码**） | `nodes.vue` 落点摘除/回滚、跨 form 预判与 id 重算 |
| `attribute.test.ts`（field 只读 / 业务字段行 / 根 name 隐藏） | 模式冻结告警、首屏门控、`importSchema` 拒绝、`setData` 回滚 |
| `outline.test.ts`（`draggable` 开关） | `sourceCode` 只读、`previewWidgets` 复制隐藏 |
| `string.test.ts`（`normalizeType`、`isValidSchemaName`） | `attributeItem` 表单名唯一校验、嵌套 form 作用域、布局白名单缺 form |
| `businessFields.test.ts`（`validateControlledPage` 纯函数） | "导入被拒绝并提示"的集成断言 |

`mockDesigner.ts:133` 默认 `designMode: 'controlled'`，说明测试作者把受控当主场景——但恰恰没测受控真正在跑的那几个文件。

### 7.10 `active: false` 的字段会被误报成"不存在"

`useBusinessFields.ts:134-137`：

```ts
if (meta.active === false) {
  // 不进入面板，但仍记录在元数据中（用于漂移提示）
  return;
}
```

注释说"仍记录"，实际是**直接 `return`，不 push、也不记 issues**，该字段从 `fields` 里彻底消失。于是属性面板对"元数据里存在但已停用"的字段会显示「（元数据中不存在）」（`attribute.vue:109`），与注释意图相反，也和 spec §12 的"漂移提示"语义不符。

### 7.11 `group` 在归一化时被丢弃，类型下拉永远只有类型名

`validateProperty` 组装 `Property` 时（`useBusinessFields.ts:144-152`）只保留 `active/entity/field/label/scale/type/unit`——**没有 `group`**。而 picker 的分类逻辑是：

```ts
const title = meta.group?.trim() || FIELD_TYPE_LABELS[meta.type] || '其他';  // componentPicker.vue:130
```

`meta.group` 恒为 `undefined`，所以下拉里永远只会出现 7 个类型名（文本/数值/金额/日期/开关/引用/列表），元数据里真的传了 `group` 也不会生效。spec D43 说"v1 不做分组"是自洽的，但 `docs/guide/components/controlledMode.md:85` 仍写"搜索框前有「类型」下拉可**按分组**筛选"，属于文档超前。

另外 picker 的搜索只匹配 `meta.label`（`componentPicker.vue:129`），**不匹配 `field`**——按字段标识搜不到东西。

### 7.12 mock 生成脚本会回退已完成的改名

`specs/mocks/build_mock.py` 仍输出 `"businessObject": "expense"`（`:141`、`:161`），而仓库里已提交的 `specs/mocks/field-meta.mock.json` / `field-meta.demo.json` 已被改成 `"modelId"`。重跑该脚本会把改名结果覆盖回去，破坏 spec P0 的"脚本可复现"要求。

### 7.13 `previewWidgets` 的复制按钮与 spec 一致，但删除两模式都有

spec §9 只说禁复制。`previewWidgets.vue:391-397` 的删除按钮、`outline.vue:155-160` 的删除图标在受控模式下**仍然可用**，`useDesigner.handleDelete`（`:181-202`）也没有模式守卫。这是**有意为之**（受控只约束"字段身份"，不约束"删掉不要的字段"），但 spec §17-13 把它列为待定项，需要产品确认。

---

## 8. spec / docs 里"有"、代码里"没有"的清单

除 §7 已展开的问题外，还有这些"规格写了、代码没做"的项（判定基于逐行阅读，未跑测试）：

| 项 | spec / docs 的说法 | 代码现状 |
|---|---|---|
| 切换业务对象成功提示 | 提示「已切换到 xxx」 | 只有失败 toast，成功静默（`designer.vue:132-138`） |
| 保存时非法 id/field 字符集告警 | 应告警 | 只告警"字段不在元数据"（`designer.vue:348-367`） |
| 引用改写后反查悬空引用 | 改写后告警 | `rewriteComponentRefs` 只返回计数，调用方忽略（`nodes.vue:209`）；`collectComponentRefIds` 生产代码零调用 |
| `generateNewSchema` 第三参 `{ idPrefix, fieldPolicy }` | D42 有此签名 | 仍是 `(schema, schemas = [])`（`data.ts:146-149`） |
| 跨租户导入按 `modelId` 解析并提示重选 | v0.36 D44：缺失则提示并要求重新选择 | 无此逻辑；`importSchema` 只在"元数据加载失败"时报错（`designer.vue:251-277`） |
| 导入校验含 form 名称唯一 | 应校验 | 缺（见 §7.3） |
| 已放置字段"不可拖拽" | §10.2 / D26 | 只禁点击（见 §7.5） |
| `setData` 乐观路径提示改用异步 API | 应 `console.warn` | 无（回滚本身已实现，`designer.vue:284-313`） |
| "最近使用 / 分类全选 / 搜索上限 100" | `docs/updateLog.md:8` 称已实现 | `componentPicker.vue` 里只有 `useStorage('ep-component-view-keys')`，无 recent、无 100 截断、无分类全选 |
| 版本号 | 文档标 v1.1.18 | 各 `package.json` 仍是 1.1.13 / 1.1.17，未升 |

> 反向也要注意：**很多行为其实已经实现且与 spec 一致**——模式冻结+告警、受控根 form 深拷贝、实例级默认 schema、受控跳过 `formMode` 全局 hide、两段式元数据加载 + 跨实例缓存 + 请求令牌、首屏阻塞 + 重试、`importSchema`/`setData`/`setDataAsync` 三套契约、保存自动带 `modelId`、reset 保持 `modelId`、撤销/历史恢复回填 `modelId`、`money→precision`、`ref→entity` 白名单例外、大纲拖拽禁用、源码只读、浮层复制按钮隐藏、form 拖入自动 `form_N`、属性面板表单改名查重。这些不是缺失，别误判。

---

## 9. 速查表

| 维度 | 自由模式 | 受控模式 |
|---|---|---|
| 开启方式 | 默认 | `design-mode="controlled"` + `model-id` + `business-field-loader` |
| 根节点 | `page` | `form`（`id: root`, `name: default`） |
| 左侧活动栏 | 布局 / **组件** / 源码 / 大纲 | 布局 / **添加字段** / 源码 / 大纲 |
| 可添加内容 | 注册表全部 | 业务字段 + `card/form/row/tabs` |
| 选择器形态 | 分组折叠 | 字段平铺 + 类型下拉 |
| 字段身份 | 由用户决定（`field = id`） | 由元数据决定，只读 |
| 同表单重复字段 | 允许 | 禁止（置灰 + 落点拒绝） |
| 复制/剪切/粘贴 | 允许 | 静默禁止 |
| 大纲拖拽 | 允许 | 禁止 |
| 源码面板 | 可编辑 | 强制只读 |
| 跨 form 移动字段 | 普通移动 | 重算 id + 改写引用，重复则拒 |
| 导入校验 | 无 | id/field 字符集 + id 唯一 + 作用域内 field 唯一 |
| 首屏 | UI 就绪 | 等元数据，失败阻塞 + 重试 |
| 页面 JSON | 无额外字段 | 增加 `modelId` |
| 不落盘 | —— | `designMode` 本身不落盘 |

---

## 10. 一句话记住设计意图

> **自由模式 = 画什么就是什么**，注册表是唯一事实源，用户拥有全部自由度。
> **受控模式 = 业务对象的字段清单就是唯一事实源**，设计器只允许你在结构上摆布（布局、顺序、标签、样式、事件），但字段的"身份"（存在与否、`field` 名、是否重复）由元数据锁死。

所以受控模式的所有约束都可以归到一句话：**凡是能改变"字段身份"的操作，一律封死；凡是只改变"呈现"的操作，一律放开。** 复制之所以被禁，是因为复制会产生一个 id 不同、`field` 相同（或需要重新分配）的"伪字段"，破坏 `(作用域, field)` 唯一性；源码之所以只读，同理。

# 移动端（H5）适配方案

> **状态**：方案草案 v0.1　|　**日期**：2026-11-26　|　**范围**：`EBuilder` 运行时、移动端展示端、移动 UI 适配包
> **读者**：后续负责 H5 展示端、或新增移动适配包的人
> **行号说明**：文中 `文件:行号` 基于当前分支，随代码演进可能漂移；按符号名检索即可定位。

---

## 0. TL;DR

1. **目标形态**：设计端留在 PC（`EDesigner`），展示端是**独立的 H5 应用**（`EBuilder`）；两端通过 JSON 契约通信，**不做"一套 UI 跨端自适应"**。
2. **EBuilder 的内核可复用**（约 14k 行共享代码：渲染器、表单、校验、事件、字段状态、schema 引擎、面板、管理器）；**缺口在渲染件、运行时样式、移动交互、H5 表单壳**。
3. 移动端体验差距的 90% 来自"用桌面组件库渲染"，不是 JSON。推荐路线：**新增一套移动 UI 适配包，并让设计端与 H5 端使用同一套适配包（双部署）**，以消除 `props` 口径差异。
4. **规模**：共享 14,054 行 / 新增适配包 3,000–4,000 行 + 测试 + 6 处接线；薄版 **2~3 周**、完整契约 **4~6 周**（单人）。
5. **三个硬约束**：
   - 组件注册表是**全局单例** → PC / H5 必须**分构建**，不能同一应用混装两套库；
   - `pageSchema.script` 由 `new Function` 执行 → **严格 CSP 的 WebView / 小程序环境不适用**；
   - `EBuilder` 渲染前必须调用过适配包的 `setupXxx()`（门闩名为 `designer.initialized`）。

---

## 1. 背景与边界

| | 内容 |
|---|---|
| **要做** | 用 `EBuilder` 在移动浏览器 / 微信 WebView 中渲染设计器产出的 JSON，形成独立的 H5 展示端 |
| **不做** | ① 设计器适配移动端；② 让同一份 UI 在 PC 与手机间做像素级自适应；③ 同一应用内混装桌面库与移动库 |
| **共用** | JSON 契约（`PageSchema` / `ComponentSchema`）+ `EBuilder` 内核 + 表单/校验/事件/字段状态引擎 |
| **不共用** | 渲染件（组件库适配包）、运行时样式、H5 表单壳 |

**术语**

- **设计端**：`EDesigner`，PC 浏览器使用，产出 JSON。
- **展示端**：H5 应用，只引 `EBuilder` + 一套适配包，渲染 JSON 并收集表单数据。
- **适配包**：`packages/ui/*`，把 `schema.type` 映射到某套 UI 组件库的组件 + 属性面板描述符。
- **契约**：`schema` 结构、25 个固定 `type` 名、表单值/校验语义、上传值格式。

---

## 2. 关键事实澄清

### 2.1 设计器三档模式 = 设计期画布尺寸预设，不是运行时适配

| 事实 | 证据 |
|---|---|
| `canvasMode` 是正式 prop，枚举 `desktop / mobile / tablet` | `docs/guide/components/EDesigner.md:93`、`packages/types/src/designer.ts:53` |
| 三档 = 画布宽高预设：`desktop {}` / `mobile 390px` / `tablet 780px` | `packages/core/src/components/designer/hooks/useDesigner.ts:108-118` |
| 切换时只写 `pageSchema.canvas = { mode, width }` | `packages/core/src/components/designer/src/modules/editContainer/toolbar.vue:130-138` |
| `canvas` 只有两处消费：设计器画布尺寸盒 + 属性面板 | `.../editContainer/editScreenContainer.vue:89-94`、`packages/ui-kit/panel-ui/src/rightSidebars/attribute/attribute.vue:51-57` |
| `EBuilder` / `NadaNode` / `pageManager` **完全不读 `canvas`** | 全仓检索：builder 目录 0 命中 |

**结论**：切模式**不会改变已存 `props`、不改变所用组件库、也不影响运行时渲染**。它的价值是"在目标端宽度下设计/检查"，不是"自动适配"。移动画布下设计出的 JSON，布局参数是为该宽度调的，但组件仍是桌面库的组件、`props` 仍是桌面库语义。

### 2.2 "JSON 跨端"的准确边界

**成立的部分**

- `schema` 结构（`type/props/children/rules/on/show/field`）与端无关，没有设备字段；
- 25 个 `type` 名跨库对齐，是有意为之的迁移契约（见 `specs/ui-adapter-contract.md` CMP-2）。

**不成立的部分**

- `props` 是**库私有语义**，并原样透传给底层组件：`node.vue:312-330`（`...innerSchema.props` 展开）→ `node.vue:503-506`（`v-bind="getProps"`）；
- 仓库内部词汇都不统一：element-plus 的 form `defaultSchema` 写 `label-position` + `labelWidth`（`packages/ui/elementPlus/src/form/index.ts:132-141`），而示例 JSON 用 antd 的 `labelCol/layout/labelPlacement`（`examples/src/views/builder/basic/index.vue:20-34`）。

**结论**：跨端的是「契约」，不是「外观」。换一套渲染件，必然要做 `props` 口径设计（要么两端同库，要么加映射层）。

### 2.3 EBuilder 单独跑的三个依赖

| 依赖 | 说明 | 证据 |
|---|---|---|
| `page` 组件 | 根节点 `type: 'page'` 由 `panel-ui` 的 `setupPage()` 注册，缺了根节点渲染不出来 | `packages/core/src/components/builder/src/builder.vue:66`、`packages/ui-kit/panel-ui/src/components/index.ts:14-16` |
| `designer.initialized` 门闩 | 未调用适配包 `setupXxx()` 时永远停在 loading（命名有历史包袱，运行时也读它） | `builder.vue:198-204`、`packages/ui/elementPlus/src/index.ts:114` |
| 样式与包体 | `@nada-designer/core` 入口顶层 import 设计器 less，CSS 无法 tree-shake；`monaco-editor` 是 peerDependency | `packages/core/src/index.ts:1-2`、`packages/core/src/index.less:3`、`packages/nada-designer/package.json:42-45` |

---

## 3. 现状盘点

### 3.1 可复用部分（约 14,054 行，不含测试/dist）

| 包 | 行数 | 复用内容 |
|---|---|---|
| `packages/core` | 4,271 | `EBuilder` 渲染入口、`EDesigner` 外壳、撤销、快捷键 |
| `packages/ui-kit` | 5,104 | `NadaNode`、`dynamicFormItem`、属性面板、各类编辑器、tree/collapse/icon/tooltip |
| `packages/manager` | 905 | `pageManager`（动作/事件/自定义函数）、`pluginManager`、撤销 |
| `packages/hooks` | 1,937 | 表单数据、字段状态、事件总线、上下文注入 |
| `packages/utils` | 1,516 | schema 遍历/操作、表达式引擎、schema 迁移 |
| `packages/types` | 321 | 契约类型定义 |
| **合计** | **14,054** | **新适配包不需要改动这些** |

### 3.2 移动端缺口（按归属层）

| 缺口 | 证据 | 影响 | 归属层 |
|---|---|---|---|
| 24 栅格固定 `span`（col 默认 6、row 默认 12+12） | `packages/ui/elementPlus/src/col/index.ts:14-21`、`row/index.ts:83-98` | 375px 下一列约 94px，内容被压扁 | schema 值 / 渲染层 |
| form 默认左置标签 + `labelWidth: '100px'` | `packages/ui/elementPlus/src/form/index.ts:132-141` | 100px 标签吃掉近 1/3 屏宽 | schema 值 / 渲染层 |
| 桌面库固定 px 控件（日期区间 350–400、数字框 150、上传图卡 148） | 依赖库 CSS；`packages/ui/elementPlus/src/upload-image/uploadImage.ts:119` | 横向溢出 | 渲染件 / 运行时样式 |
| antd 弹窗写死 `minWidth:700px / absolute / left,right:150px` | `packages/ui/antd/src/modal/modal.vue:33-50` | 手机上必溢出 | 渲染件 |
| EP 弹窗 `calc(100vh - 50px)`、无 `dvh`/safe-area | `packages/ui/elementPlus/src/index.less:71-79` | iOS 地址栏/刘海下高度异常 | 渲染件 / 运行时样式 |
| "控件 100% 宽"规则只挂在 `.ep-designer-main` 作用域 | `packages/ui/elementPlus/src/index.less:1-4` | 运行时 `.ep-builder-main` 不生效 | 运行时样式（缺失） |
| 全仓无 `@media`、无 touch/pointer 分支、无色号 16px 约定 | `packages/` 全量检索（`.less/.ts/.vue`）0 命中 | 无响应式基础设施；iOS 聚焦缩放 | 运行时样式 |
| 触控热区：库默认控件高 32px | 依赖库默认值；`.ep-button` 32px（`packages/core/src/index.less:22-23`） | 点击命中率低 | 运行时样式 |
| 上传 picture-card 删除/预览按钮 hover 才显示 | 依赖库 CSS；封装未做触屏兜底 | 触屏上功能不可见 | 渲染件 |
| schema 无移动端表单壳（提交/吸底/分组/步骤/错误滚动定位） | `scrollToError` 只透传给库（`packages/ui/elementPlus/src/form/index.ts:110-114`），运行时无实现 | 填写体验差 | H5 壳 |
| `pageSchema.script` 用 `new Function` 执行 | `packages/manager/src/pageManager.ts:200-221`、`:414-420` | 严格 CSP / 小程序环境不可用 | 运行时环境约束 |
| EBuilder 从包根导入会带进设计器样式 | `packages/core/src/index.ts:1-2`、`index.less:3` | H5 包体带无用 CSS | 工程 |

---

## 4. 方案对比

| 方案 | 做法 | 移动体验 | 成本 | 改核心代码 | 维护性 | 适用 |
|---|---|---|---|---|---|---|
| **A. 桌面库 + 响应式层** | H5 继续用 element-plus/antd；补运行时样式入口 + 少量移动分支 + H5 壳 | 60–75 分 | 1–2 周 | 否 | 好 | 移动端是辅助渠道、能填就行 |
| **B. 双部署移动适配包**（推荐） | 新增移动适配包；设计端部署两个入口（PC 库 / 移动库），H5 端用移动库；同一适配包两处共用 | 85–90 分 | 2–3 周（薄版）/ 4–6 周（完整） | 否（可选做注册表作用域改造） | 好 | 移动端是正式渠道 |
| **C. 完整契约适配包** | B 的完整版：25 个 type + L1–L4 契约测试 | ≈95 分 | 4–6 周 | 否 | 最好 | 多端长期并行 |
| **D. 一份 JSON 多端共用 + 运行时设备变换** | 设计端只出一份 JSON，H5 渲染前做设备变换 + props 映射 | 70–80 分 | 2–4 周 + 长期映射维护 | 是（新增变换层） | 差（映射会腐烂） | 仅当产品强制"一份 JSON" |

> A 与 B 的前置工作重叠（运行时样式、H5 壳、真机验收在两条路线里都要做），所以 A 不会白做，可作为 B 的第一阶段。
> D 不建议：既要做设备判断，又要维护两套库的 `props` 映射，成本高于 B，收益低于 B。

---

## 5. 推荐路线（B）

### 5.1 架构

```text
                ┌────────────────────────────┐
   PC 浏览器 ──▶│ EDesigner + 桌面适配包      │──┐
                │ (element-plus/antd/...)     │  │  PC 页面 JSON
                └────────────────────────────┘  │
                                                ├──▶ 后端存储（PageSchema）
                ┌────────────────────────────┐  │
   PC 浏览器 ──▶│ EDesigner + 移动适配包      │──┘  移动页面 JSON
   （移动页设计）│ (390px 画布 + vant 等)      │
                └────────────────────────────┘
                                                ┌──────────────────────────────┐
   H5 / WebView ──────────────────────────────▶ │ EBuilder + 移动适配包         │
                                                │ + runtime 样式 + H5 表单壳    │
                                                └──────────────────────────────┘
```

要点：**设计端和展示端用同一套移动适配包**，`props` 口径天然一致，不需要映射层。

### 5.2 双部署

- 同一套设计器代码，部署两个入口：
  - PC 入口：`setupElementPlus()`（或现有桌面库）+ `canvasMode="desktop"`；
  - 移动页入口：`setupVant()` + `canvasMode="mobile"`（390px 画布）。
- 两个入口各自保存 JSON（可按 `modelId` / 页面类型区分），H5 端只加载移动页 JSON。
- 好处：核心零改动；移动库组件尺寸固定、不依赖媒体查询，390px 画布内所见即所得。
- 代价：设计器**外壳控件**（`input/select/button/modal/radio/number/form-item` 既供外壳也供画布，见 `specs/ui-adapter-contract.md` §2.5）会变成移动组件，280px 属性面板里放 44px 高控件，观感偏松。

### 5.3 可选增强：注册表作用域改造（保留桌面外壳）

若不能接受"设计器外壳移动化"：把**外壳专用 type** 与**画布 type** 解耦（例如外壳统一走 `ui-input` / `ui-select`，适配包可分别注册外壳实现与画布实现）。改动集中在 `packages/hooks/src/plugin/useComponentManager.ts` 与若干 `pluginManager.component.get()` 调用点，预估 2~5 人日，一次性投入。做完后：桌面外壳 + 移动画布可以共存于同一个设计器部署。

### 5.4 H5 运行时组成

```text
H5 应用
├─ EBuilder（来自 nada-designer）
├─ 移动适配包（setupXxx + 组件库 CSS）
├─ runtime 样式入口（新增：token + .ep-builder-main 作用域，不含设计器样式）
└─ H5 表单壳（吸底提交、分组/步骤、错误定位、键盘/安全区处理）
```

---

## 6. 移动适配包实施清单

### 6.1 type 清单与里程碑

25 个契约 type（参照 `packages/ui/tdesign/src/__test__/setup.test.ts:17-43`）：

```text
外壳：input select button modal radio number form-item
表单：form textarea input-number checkbox switch slider date time select cascader color-picker
布局：row col card tabs tab-pane modal collapse collapse-item
上传：upload-image upload-file
遗留：Collapse CollapseItem epTable（可选）
```

| 里程碑 | 内容 | 完成标准 | 估算 |
|---|---|---|---|
| **M1 跑通设计器** | 外壳 7 件套 + `setupXxx` + 工作区接线 | 设计器能打开、能拖入组件、属性面板可用 | 3~5 人日 |
| **M2 常用表单** | form/textarea/input-number/checkbox/radio/switch/slider/date/select + row/col/card/tabs/collapse + 描述符 | 普通移动表单可设计、可渲染、可校验 | 5~8 人日 |
| **M3 交互重灾区** | 日期/时间 picker、级联、上传 ×2、modal 全屏 | 真机可用 | 5~10 人日 |
| **M4 契约测试** | 照抄 tdesign 的 `setup.test.ts`（type 全集、编辑器 type 可解析、可重入）+ 渲染 smoke | 进 CI | 3~5 人日 |

### 6.2 语义差异与映射要点

| 主题 | 现状契约 | 移动库差异 | 处理 |
|---|---|---|---|
| 校验规则 | `rule.type` 表示数据类型（string/number/date/email/url） | 组件库 `type` 表示消息级别（error/warning） | 必须转换（范式：`packages/ui/tdesign/src/form-item/formItem.vue:35-66`，契约 FORM-4） |
| 上传值 | `modelValue` 为逗号分隔 URL 串，双向转换 `fileList` | Vant Uploader 是 file 对象 + `after-read` | 重写绑定与请求层（契约 UP-1~6） |
| 日期/时间 | `format/valueFormat` + 字符串值 | 移动库多为 popup + 数组值 | 包装层做格式转换 |
| 选择/级联 | `options` + `modelValue` | 移动端通常是 Picker / 底部弹层 | 包装成 Picker 形态，保持值契约 |
| `bindModel` | `modelValue`（默认）/ `value` / `checked` | 各库不同 | 按 CMP-9 逐组件核对 |
| 尺寸枚举 | `large/default/small` | 常见 `large/medium/small` | 描述符内归一 |
| 主题令牌 | 消费 `--ep-*` 设计令牌 | 移动库有自己的 CSS 变量 | 做令牌映射，不硬编码主色（THM-1/THM-3） |

### 6.3 库选型（按 PC 端已有库对齐）

| 库 | 适用 | 备注 |
|---|---|---|
| `vant@4` | PC 用 element-plus / antd | 表单、上传、日期、Picker、Cascader 齐全，生态最主流 |
| `tdesign-mobile-vue` | PC 用 tdesign | 设计语言统一，团队维护成本低 |
| `@nutui/nutui@4` | 未来要 Taro / 小程序 | 京东系，可延伸多端 |
| `@varlet/ui` | 偏好 Material 风格 | 团队有偏好时再评估 |

### 6.4 接线清单（每套适配包都要改）

1. `packages/ui/<lib>/package.json`：`files: dist`、`main/module/types/exports`、`peerDependencies`（`vue` / `nada-designer` / 组件库）
2. `build.config.ts`：`externals` 加组件库名；alias 指回 `nada-designer` 子包
3. `dev-stub.ts` + 根 `postinstall` 的 `stub`
4. 根 `package.json` devDeps（`workspace:*`）、`turbo.json`（`<pkg>#stub`）、`typecheck.tsconfig.json` include
5. `examples/src/layout/components/Header/index.vue` 的 `switchUI` 分支
6. `README.md` / `docs/guide/start/quick-start.md` 的 UI 列表

### 6.5 验收

直接套用 `specs/ui-adapter-contract.md` §3 的清单：

- **L0** 包与接线（TC-P01~P06）
- **L1** 组件配置契约（TC-C01~C10，无需安装组件库）
- **L2** setup 集成（TC-S01~S09，用 `createPluginManager()` 隔离）
- **L3** 渲染 smoke（TC-R01~R08，建议本次补齐，仓库目前未落地）
- **L4** 手工矩阵（TC-M01~M10，examples 本地 `pnpm dev`）

移动端另加真机项：iOS Safari、Android Chrome、微信内置浏览器；覆盖日期、上传、校验、键盘遮挡、长表单滚动。

---

## 7. H5 表单壳工程清单

适配包只解决「渲染件」，以下由 H5 应用（或共享壳组件）承担：

| 项 | 说明 |
|---|---|
| 提交/吸底操作栏 | `EBuilder` 只暴露 `validate/getData/resetData`，按钮与固定在壳里 |
| 分组/步骤 | schema 无"步骤"概念，可用 `card/collapse/tabs` 拼，或壳层做分页 |
| 错误定位 | 校验失败后滚动到首个错误并考虑吸顶高度偏移 |
| 键盘遮挡 | 聚焦时用 `visualViewport` 调整吸底栏位置 |
| 安全区 | `env(safe-area-inset-bottom)`，底部操作栏 |
| 视口高度 | 用 `100dvh` 替代 `100vh`（`100vh` 见 `elementPlus/src/index.less:73`、`naiveUi/src/index.less:32`） |
| 输入字号 | ≥16px，避免 iOS 聚焦缩放 |
| 触控热区 | ≥44px |
| 上传 | 图片压缩 / 失败重试 / 微信 WebView 兼容 |
| 弱网与监控 | 首次渲染耗时、脚本异常（`scriptError`）、组件未注册告警 |

---

## 8. 工期估算

| 项 | 估算 | 说明 |
|---|---|---|
| runtime 样式入口（A/B 共用前置） | 1~3 人日 | 与库无关，先做 |
| 移动适配包 M1~M3（薄版 15~18 type） | 13~23 人日 | 约 2~3 周 |
| 移动适配包 M4 + 完整 25 type | +8~13 人日 | 完整契约约 4~6 周 |
| 注册表作用域改造（可选） | 2~5 人日 | 保留桌面外壳 |
| H5 表单壳 | 3~5 人日 | 不含业务定制 |
| 真机联调与验收 | 3~5 人日 | 机型矩阵 |
| 设计端双部署 + 移动页入口 | 1~2 人日 | 复用现有设计器代码 |

---

## 9. 风险与开放问题

| 风险 | 说明 | 缓解 |
|---|---|---|
| `new Function` 与 CSP | 页面脚本/自定义函数在严格 CSP 的 WebView 不可用（`pageManager.ts:200-221`） | 确认 H5 宿主 CSP；必要时禁用 script 能力 |
| 小程序 / 原生 App | `EBuilder` 是 Vue DOM 渲染，不能直接跑在小程序；需 Taro/uni-app 侧另做渲染器（schema 可复用） | 若目标含小程序，需单独立项 |
| 注册表全局单例 | 同 type 后注册覆盖；PC/H5 必须分构建 | 分仓/分构建，不要混装 |
| 设计器外壳观感 | 双部署下外壳变成移动组件 | 做 §5.3 作用域改造，或接受观感 |
| 测试缺口 | L3 渲染 smoke 仓库未落地 | 移动适配包顺手补上 |
| 存量 JSON | 已有移动页可能是桌面库语义的 JSON | 迁移前先盘点；必要时一次性转换或重设计 |
| 行号漂移 | 本文证据行号会过期 | 按 §附录 A 的符号名检索 |

**开放问题（需产品/技术决策）**

1. 移动端是否正式渠道？决定走 A 还是 B。
2. 目标环境是否只有浏览器/微信 WebView？是否要小程序？
3. 移动页是否允许**独立设计一份 JSON**（推荐），还是必须与 PC 共用一份？
4. 是否接受设计器外壳移动化？决定要不要做注册表作用域改造。
5. 移动适配包选哪套库？按 PC 端已有库对齐。

---

## 附录 A：证据索引

| 结论 | 位置 |
|---|---|
| `canvasMode` 三档、只改画布宽 | `packages/types/src/designer.ts:53`、`packages/core/src/components/designer/hooks/useDesigner.ts:108-118`、`.../toolbar.vue:130-138` |
| `canvas` 仅设计器消费 | `.../editScreenContainer.vue:89-94`、`packages/ui-kit/panel-ui/src/rightSidebars/attribute/attribute.vue:51-57` |
| 渲染链路 schema → NadaNode → 注册表 | `packages/core/src/components/builder/src/builder.vue:215-219`、`packages/ui-kit/base-ui/src/node/node.vue:427-442` |
| `props` 原样透传 | `packages/ui-kit/base-ui/src/node/node.vue:312-330`、`:503-506` |
| 注册表全局单例 / 同 type 覆盖 | `packages/manager/src/pluginManager.ts:258`、`packages/hooks/src/plugin/useComponentManager.ts:93-111` |
| EBuilder 初始化门闩 | `packages/core/src/components/builder/src/builder.vue:198-204` |
| EBuilder 依赖 page 组件 | `packages/core/src/components/builder/src/builder.vue:66`、`packages/ui-kit/panel-ui/src/components/index.ts:14-16` |
| 运行时样式/设计器样式耦合 | `packages/core/src/index.ts:1-2`、`packages/core/src/index.less:3` |
| 栅格/label 默认值 | `packages/ui/elementPlus/src/col/index.ts:14-21`、`row/index.ts:83-98`、`form/index.ts:132-141` |
| 弹窗固定尺寸 | `packages/ui/antd/src/modal/modal.vue:33-50`、`packages/ui/elementPlus/src/index.less:71-79` |
| 上传值契约 | `packages/ui/elementPlus/src/upload-image/uploadImage.ts:119`、`specs/ui-adapter-contract.md` §2.7 |
| 页面脚本执行方式 | `packages/manager/src/pageManager.ts:200-221`、`:414-420` |
| 适配包契约 / type 清单 / 测试清单 | `specs/ui-adapter-contract.md`、`packages/ui/tdesign/src/__test__/setup.test.ts:17-43` |
| `monaco-editor` peer 依赖 | `packages/nada-designer/package.json:42-45` |

## 附录 B：现有适配包体量参考

统计口径：`packages/*/src` 下 `.ts/.vue/.less`，排除 `node_modules` / `dist` / `__test__`。

| 包 | 文件数 | 行数 |
|---|---|---|
| `packages/core` | 30 | 4,271 |
| `packages/ui-kit` | 67 | 5,104 |
| `packages/manager` | 4 | 905 |
| `packages/hooks` | 30 | 1,937 |
| `packages/utils` | 9 | 1,516 |
| `packages/types` | 8 | 321 |
| **共享合计** | 148 | **14,054** |
| `packages/ui/elementPlus` | 49 | 3,949 |
| `packages/ui/antd` | 45 | 4,019 |
| `packages/ui/naiveUi` | 49 | 3,610 |
| `packages/ui/tdesign` | 55 | 3,094 |

移动适配包预估落在 3,000–4,000 行区间；测试另计 1,000–1,600 行。

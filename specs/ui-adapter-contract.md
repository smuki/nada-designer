# UI 适配器契约与一致性测试清单

> **状态**：草案 v0.1　|　**日期**：2026-11-25　|　**范围**：`packages/ui/*`
> **读者**：新增 / 维护 UI 适配器的人，评审第 4+ 个适配器（如 shadcn-vue）的人。
> **用法**：新增适配器时按 §2 逐条打勾；评审时用 §3 的 TC 清单验收；踩过的新坑补进 §7。

---

## 0. 摘要

设计器与 UI 库之间只隔一层**适配器**：一个 npm 包 + 一个 `setupXxx()` 函数 + 若干 `ComponentConfigModel`。

但这层契约**比"注册一批画布组件"大**，实际横跨 6 个层面：

| 层面 | 内容 | 常见误解 |
|---|---|---|
| PKG | 包元数据、构建、workspace 接线 | 以为复制一份 `antd/` 目录就完事 |
| SET | setup 函数的注册顺序与副作用 | 漏 `setInitialized(true)` → 设计器永远 loading |
| CMP | `ComponentConfigModel` 字段语义 | `attribute` 不用 `props.*` → 「修改属性」动作是空的 |
| RUN | 组件实现必须接受的注入 props / 插槽协议 | 容器组件没转发插槽 → 拖不进子组件 |
| SHELL | **设计器外壳自己要用**的组件（属性面板、预览弹窗…） | 只做画布组件 → 面板白屏 / 报错 |
| FORM/UP/THM | 表单校验、上传、主题变量 | 各库语义不同，必须逐库归一 |

**一句话**：适配器是"设计器 UI 的底座"，不是"画布组件包"。

---

## 1. 适配器边界：谁提供什么

```text
宿主应用
  ├─ 安装组件库 CSS / 主题
  ├─ setupXxx(pluginManager, { uploadImage, uploadFile })   ← 适配器
  └─ <EDesigner/> / <EBuilder/>

EDesigner setup 时（packages/core/src/components/designer/src/designer.vue:44）
  └─ setupPanel(pluginManager)  → 面板、属性编辑器、MonacoEditor 等「外壳组件」
       └─ 面板里的控件仍按 type 从 pluginManager 取 → 这些 type 必须由适配器提供

渲染时（packages/ui-kit/base-ui/src/node/node.vue:496-527）
  └─ pluginManager.component.get(schema.type)
       └─ v-bind="getProps" + v-model:[bindModel] + #node / #edit-node 插槽
            └─ 若 defaultSchema.input && !noFormItem → 外面再包一层 'form-item'
```

| 提供方 | 内容 | 证据 |
|---|---|---|
| 核心 `nada-designer` | 渲染器 `NadaNode`、动态 FormItem、拖拽、schema 引擎、面板外壳、设计令牌 `--ep-*` | `packages/core/src/index.ts`、`packages/ui-kit/base-ui/src/node/node.vue` |
| 面板 `@nada-designer/panel-ui` | `EInputSize` / `EColEditor` / `ERuleEditor` / `ETabPaneEditor` / `EOptionsEditor` / `EActionEditor` / `epActionModal` / `MonacoEditor` / `EpField` / `Page` | `packages/ui-kit/panel-ui/src/components/index.ts:23-62` |
| **适配器** | 画布组件 + 外壳所需控件（input/select/button/modal/radio/number/form-item）+ `$message` + 组件库样式 | 本文 §2 |
| 宿主应用 | 组件库样式表、暗色 class、全局上传地址、`pluginManager.global` | `docs/guide/start/theme.md`、`docs/guide/start/dark-mode.md` |

---

## 2. 契约清单

打勾方式：`- [ ]` 未做 / `- [x]` 已满足。

### 2.1 包与工程（PKG）

- [ ] **PKG-1** 包名 `nada-designer-<lib>`，`type: "module"`，`files: ["dist"]`，`main/module/types/exports` 指向 `dist/index.{mjs,cjs,d.ts}`
- [ ] **PKG-2** `peerDependencies` 至少 3 项：`vue`、`nada-designer`、被适配的组件库（带上下界）。**组件库本身不打包进 dist**
- [ ] **PKG-3** `scripts.build = "unbuild"`、`scripts.stub = "tsx dev-stub.ts"`（根 `postinstall` 会 `pnpm -r run stub`）
- [ ] **PKG-4** `dev-stub.ts` 与其它包一致：把 `dist/index.mjs` / `dist/index.d.ts` 写成 `export * from '../src/index'`，让 workspace 里无需先 build
- [ ] **PKG-5** `build.config.ts` 的 `externals` 含 `vue` + 组件库 + `nada-designer`；`@rollup/plugin-alias` 把 `@nada-designer/{manager,types,utils,hooks}` 指到 `nada-designer`
- [ ] **PKG-6** 根 `package.json` `devDependencies` 增加该包（`workspace:*`）；`pnpm-workspace.yaml` 的 `packages/ui/*` 已覆盖，无需改
- [ ] **PKG-7** `turbo.json` 的 `nada-examples#dev.dependsOn` 增加 `<pkg>#stub`
- [ ] **PKG-8** `examples/src/layout/components/Header/index.vue` 的 `selectOptions` + `switchUI()` 增加分支
- [ ] **PKG-9** 文档三处：`README.md`、`docs/guide/start/quick-start.md`、`docs/guide/start/{theme,dark-mode}.md` 的 UI 列表
- [ ] **PKG-10** `LICENSE`；发版时与 `nada-designer` **同版本号**（`docs/updateLog.md` 与 `PUSH-GUIDE.md` 均要求多包同步）

> 现状参考：`packages/ui/tdesign` 已按本清单完成接线（根 `package.json` / `turbo.json` / `typecheck.tsconfig.json` / 发布 CI / examples 切换 / README + quick-start），可作为新增适配器的样板。

### 2.2 setup 函数（SET）

- [ ] **SET-1** 签名固定：`export function setupXxx(pluginManager: PluginManager = pManager, config: SetupConfig = {}): void`
- [ ] **SET-2** 先注册**外壳内部组件**（见 §2.5），再注册画布组件 —— 外壳组件不在组件面板出现（无 `groupName`），但必须能被 `get()` 到
- [ ] **SET-3** 画布组件成对调用：`pluginManager.component.register(cfg)` + `pluginManager.component.addBaseComponentType(cfg.defaultSchema.type)`。后者决定**切库时能否被一起移除**（`removeBaseComponents()`）
- [ ] **SET-4** 挂 `pluginManager.global.$message = { error, info, success, warning }`，四项都要有函数
- [ ] **SET-5** 处理 `SetupConfig.uploadImage / uploadFile`：写入 `UploadImage.defaultSchema.props.action`；且当 `pluginManager.global.uploadImage/uploadFile` 有值时，`config.attribute` 里过滤掉 `props.action`（三包一致行为，见 `packages/ui/antd/src/index.ts:114-134`）
- [ ] **SET-6** 组件库版本差异在适配器内部消化（如 antd `v3/v4` 分支与样式 hack，`packages/ui/antd/src/index.ts:41-71`）
- [ ] **SET-7** 样式入口在该包 import（`./index.less`；组件库基础样式由谁 import 需在 README 写清 —— 现状 antd/element 交给宿主、tdesign 自己 import，不一致）
- [ ] **SET-8** **最后一步**调 `pluginManager.designer.setInitialized(true)`。这是设计器渲染门闩（`designer.vue:200`），漏了就是永久 loading
- [ ] **SET-9** 可重入：`setup → removeBaseComponents → setup` 第二次不重复、不报错（examples 的热切换就走这条路）
- [ ] **SET-10** setup 必须在 `<EDesigner/>` 挂载**之前**完成（`designer.vue` 在自己 setup 阶段就 `setupPanel` + `get('epBuilderSlot')`）

### 2.3 组件配置 `ComponentConfigModel`（CMP）

- [ ] **CMP-1** `component` 必须是**懒加载**（`() => import('./x.vue')`），否则整个适配器进主包
- [ ] **CMP-2** `defaultSchema.type` 是全局唯一 key（注册 / 渲染 / 落盘 schema 全靠它）。命名用 kebab-case，且**与其它适配器同名组件保持同名**（`input`/`select`/`button`…），否则页面 schema 不能跨库迁移
- [ ] **CMP-3** `defaultSchema.input: true` 才进入"表单输入"语义：自动注入 `setValue`/`getValue` 动作（`useComponentManager.ts:278-302`）+ 会被 `form-item` 包裹（`node.vue:280-285`）
- [ ] **CMP-4** `defaultSchema.props` 是初始属性；`componentProps` 已废弃（注册时会 warn 并迁移，`useComponentManager.ts:342-350`）
- [ ] **CMP-5** `groupName` 决定是否出现在组件面板（不设 = 只注册不展示：`form-item`、antd 的 `col` 都属于这类"子组件"）；只应使用 `表单` / `布局` 两个内置分组名，其它分组名会排在它们之后（`sortedGroups` 默认 `['表单','布局']`）
- [ ] **CMP-6** `config.attribute` 中**属性字段一律写 `props.xxx`**：只有 `props.*` 会被收进「修改属性」动作的可选项（`useComponentManager.ts:303-340`），写成 `xxx` 则该属性无法被动作修改
- [ ] **CMP-7** `config.attribute[].type` 引用的是**属性编辑器 type**，必须在本适配器（或外壳）里存在：`input`/`select`/`number`/`switch`/`radio`/`color`/`slider`/`EpField`/`EInputSize`… 引用了不存在的 type → 属性面板对应行渲染失败
- [ ] **CMP-8** `config.event` 声明可绑定事件；运行时 `schema.on` 的 key 会转成 `onXxx` 监听（`node.vue:291-302`），因此组件必须真的 emit 同名事件
- [ ] **CMP-9** `bindModel` 必须等于被包裹组件真实支持的 v-model prop 名。参考现状：
  | 情况 | bindModel |
  |---|---|
  | 默认 | `modelValue` |
  | antd / naive 多数表单件 | `value` |
  | antd switch | `checked` |
  | naive date-picker | `formatted-value` |
  | 上传类（全库） | `modelValue` |
- [ ] **CMP-10** `editConstraints`：`inline`（如 button）、`immovable`、`locked`、`fixedField`、`childImmovable` 按需
- [ ] **CMP-11** `priority` 默认 99，同 type 高者覆盖低者（`useComponentManager.ts:93-111`）；`sort` 控制组内顺序
- [ ] **CMP-12** 子表组件 `isSubTable`（了解即可，非通用契约）

### 2.4 运行时渲染（RUN）—— 组件的 `.vue` 必须满足

渲染器如何挂载组件（`node.vue:496-527`）：

```vue
<dynamicFormItem :check-payload="checkPayload" :has-form-item="hasFormItem" :form-item-props="getFormItemProps">
  <component
    :is="componentRef"
    v-bind="getProps"
    v-model:[getProps.bindModel]="innerValue"
    :model="formData"
    @check="handleCheck"
    :class="{ 'ep-hidden': innerSchema.props?.hidden, 'ep-readonly': getProps.readonly }"
    @vue:mounted="handleAddComponentInstance"
  >
    <template #node="data"><EpNode v-bind="data" /></template>
    <template #edit-node><slot name="edit-node" /></template>
  </component>
</dynamicFormItem>
```

由此推出：

- [ ] **RUN-1** 必须接受被注入的 props：`disabled`、`readonly`、`hidden`、`style`、`bindModel`、`model`（表单数据）；未声明的会落成 attrs，需 `inheritAttrs` 正确处理
- [ ] **RUN-2** v-model 是**动态名**（`value` / `checked` / `formatted-value` / `modelValue`）：组件必须声明对应 prop 并 emit `update:<name>`，否则值不回流
- [ ] **RUN-3** 单根节点：`ep-hidden` / `ep-readonly` class 会加到组件根上；fragment 根会导致样式/实例异常
- [ ] **RUN-4** 会通过 `@vue:mounted` 抓组件实例并挂 `setValue`/`getValue`（输入组件）→ 组件不要阻止实例暴露（正常 SFC 即可）
- [ ] **RUN-5** **容器组件**（form/card/modal/tabs/collapse/row/col）必须实现插槽协议：
  - `#node`：按 `props.componentSchema.children` 逐个渲染，透传 `componentSchema`
  - `#edit-node`：优先渲染它（画布拖动容器），为空时回退到 children
  - 参考 `packages/ui/antd/src/card/card.ts:26-35`、`tabs/tabs.ts:43-67`
- [ ] **RUN-6** 表单控件读取数据用 `useFormItem()`（或兼容 `inject('formData')`），**不要**自己维护一份 state 冒充 formData
- [ ] **RUN-7** 同时尊重两条 disabled/readonly 通道：`props.disabled/readonly` 与 `fieldStateMap` 推下来的状态（`node.vue:159-177, 317-327`）
- [ ] **RUN-8** 站在**设计态**上不要"看起来对但数据错"：设计模式下 `field` 会被追加 `-design-mode` 后缀（`node.vue:132-144`），嵌套表单还有 `fieldPathPrefix` 前缀（`node.vue:79`）→ 不要把 field 当稳定 id 用
- [ ] **RUN-9** `@check` 是**预留**事件（emit `{ result, message }` 可让 form-item 显示自定义校验态）。当前三个适配器均未使用，不是硬契约

### 2.5 外壳内部组件（SHELL）—— 最容易被漏的一层

这些 type 由设计器外壳/面板按名字取用，**必须**由适配器提供（表内"消费方"为证据）：

| type | 消费方 | 最低能力 |
|---|---|---|
| `input` | 组件树搜索、`EpField`、`EOptionsEditor`、`ETabPaneEditor`、`EInputSize`、属性面板所有 `type: 'input'` 行 | `placeholder`、可选 `clearable`、v-model |
| `select` | 画布缩放选择器、`EInputSize`、`setAttr` 动作的"选择属性"下拉 | `options`、`placeholder`、v-model（值可能非字符串） |
| `button` | 设计器头部、`EOptionsEditor`、`ERuleEditor`、`epActionModal` | 文本插槽、点击事件 |
| `modal` | 预览（表单/JSON）、预览确认、`epActionModal` | `v-model` 显隐、`componentSchema`、`children`、footer（`okText`/`cancelText`/`footer`/`hideConfirm`/`fixedHeight`）+ emit `ok`/`close`/`update:modelValue`；参考 `packages/ui/antd/src/modal/modal.vue:8-100` |
| `radio` | `EColEditor`（栅格 span） | `options`、v-model |
| `number` | `EColEditor`（数字输入） | v-model、min/max |
| `form-item` | `dynamicFormItem.vue:26` **唯一消费者** | 见 §2.6；键名必须是小写 `form-item` |
| `Collapse` / `CollapseItem` / `epTable` | **当前无消费方**（全仓 grep 无 `get()`） | 历史遗留，保持注册即可，不是硬契约 |

外壳自己已提供、适配器**不需要**实现的：`MonacoEditor`、`EActionEditor`、`epActionModal`、`ERuleEditor`、`ETabPaneEditor`、`EOptionsEditor`、`EColEditor`、`EInputSize`、`EpField`、`Page`、`NadaNode`、`epBuilderSlot`。

### 2.6 表单与校验（FORM）

- [ ] **FORM-1** `form` 组件需 `defineExpose({ form, getData, setData, resetData, validate })`，并在挂载时把自身注册进 `formInstances[name]`（`useForm(name)`，name = `props.name ?? schema.name ?? 'default'`）——参考 `packages/ui/antd/src/form/form.vue:82-145`
- [ ] **FORM-2** 兼容 `labelCol/wrapperCol/layout/labelLayout/labelWidth`（含 `labelWidth` 为 number 的旧数据），见 `form.vue:105-131`
- [ ] **FORM-3** `form-item` 必须接收并消费 `checkPayload`（`{ result, message }`）→ 映射成各库的错误/校验态属性
- [ ] **FORM-4** `form-item` 必须归一化设计器规则：设计器的 `rule.type` 表示**数据类型**（string/number/date/email/url），而各库 `type` 表示**消息级别**（error/warning）→ 必须转换（范式：`packages/ui/tdesign/src/form-item/formItem.vue:35-66`）
- [ ] **FORM-5** 必填：渲染器会补齐 required 规则，优先级 `fieldState.required > props.required > rules.required`（`node.vue:199-238`），表单项需正确显示必填星标
- [ ] **FORM-6** 自定义校验器：`rule.validator` 可能是字符串 → 从 `pageManager.funcs[validator]` 解析（`node.vue:213-217`），`form-item` 只需把它透传给组件库
- [ ] **FORM-7** 校验失败时可滚动到首个错误（可选，`scrollToFirstError`）
- [ ] **FORM-8** **不要**引入第三方表单库（vee-validate / zod 等）来替代上述契约 —— 设计器有自己的规则引擎与 schema 结构，适配器只做"渲染 + 透传"

### 2.7 上传（UP）

- [ ] **UP-1** 值格式统一：**逗号分隔的 URL 字符串**（多图），`modelValue` ↔ `fileList` 双向转换，参考 `packages/ui/antd/src/upload-image/uploadImage.vue:37-77`
- [ ] **UP-2** 上传地址优先级：`pluginManager.global.uploadImage/uploadFile` **优先于** `attrs.action`（即 `defaultSchema.props.action`）
- [ ] **UP-3** 请求头取 `pluginManager.global.axiosConfig?.headers`
- [ ] **UP-4** 响应解析容错：`response.data.url ?? response.data`；拿不到 URL 视为失败
- [ ] **UP-5** 图片：`accept` 白名单 + `maxCount` + 预览
- [ ] **UP-6** `upload-file` / `upload-image` 在多数组件库里**没有原生对应物**，需自研或基于通用上传 primitive 组合 —— 这是新适配器最费工的两件

### 2.8 主题与样式（THM）

- [ ] **THM-1** 消费设计器令牌 `--ep-*`（`packages/core/src/theme/base.less:1-53`），不要硬编码主色
- [ ] **THM-2** 暗色靠 `<html class="dark">`（`packages/hooks/src/common/theme.ts:29-31`），不是 media query
- [ ] **THM-3** **禁止全局 reset / 全局 CSS 变量注入**：宿主可能同时装其它库，且 examples 支持热切库
- [ ] **THM-4** 需要作用域时用 `.ep-scoped`（UnoCSS variant，`packages/nada-designer/uno.config.ts:30-35`）
- [ ] **THM-5** 尺寸用 px 或遵循 `presetRemToPx` 约定（设计器统一 px 语义）
- [ ] **THM-6** 样式导入顺序：`nada-designer/dist/style.css` 之后才能覆盖 `--ep-*`（`docs/guide/start/theme.md:24-31`）

---

## 3. 一致性测试清单（TC）

分 4 层，**L0/L1 零依赖可跑，L2/L3 需要组件库可解析，L4 手工**。

### L0 包与接线（纯静态）

| ID | 用例 | 断言 / 做法 |
|---|---|---|
| TC-P01 | 包名与导出 | `package.json` 的 `main/module/types/exports` 均指向 `dist/index.*`，且 `dist/index.mjs` 存在（stub 后） |
| TC-P02 | peerDependencies | 含 `vue`、`nada-designer`、组件库，且组件库**不在** `dependencies` |
| TC-P03 | 构建外置 | `build.config.ts` 文本包含组件库名于 `externals` |
| TC-P04 | 依赖接线 | 根 `package.json` devDeps 含该包；`turbo.json` 含 `<pkg>#stub` |
| TC-P05 | demo 接线 | `examples/.../Header/index.vue` 的 `switchUI` 含该库分支 |
| TC-P06 | 版本同步 | 包版本 === `packages/nada-designer/package.json` 版本 |

### L1 组件配置契约（无需安装组件库）

> 前提：配置层 `<comp>/index.ts` 按约定不 import 组件库。**已核实**：`packages/ui` 下顶层 import 组件库的只有各包的 `src/index.ts`（setup 入口），配置层全部零依赖，实现文件是懒引用的 `./x.vue` / `./card.ts`。

| ID | 用例 | 断言 |
|---|---|---|
| TC-C01 | type 唯一且 kebab-case | 遍历所有 `defaultSchema.type`，无重复、匹配 `/^[a-z][a-z0-9-]*$/` |
| TC-C02 | type 跨库同名 | **核心表单类** type 集合与其它适配器一致（`input/select/form/form-item/textarea/input-number/checkbox/radio/switch/slider/date-picker`），布局与复杂件允许差异 |
| TC-C03 | input 标记正确 | 表单控件 `defaultSchema.input === true`；布局件（row/col/card/tabs/modal）不为 true |
| TC-C04 | 懒加载 | `typeof component === 'function'` |
| TC-C05 | 分组合法 | `groupName` ∈ `{表单, 布局}`（`form-item` 例外：必须无 groupName） |
| TC-C06 | attribute 路径 | 属性字段以 `props.` 开头（`field`/`label` 等 schema 字段除外） |
| TC-C07 | 编辑器 type 可解析 | 收集 `attribute[].type`，断言 `pluginManager.component.get(type)` 存在或属于外壳白名单 |
| TC-C08 | bindModel 合理 | 与 CMP-9 表一致；未知时默认 `modelValue` |
| TC-C09 | 事件非空 | 可交互组件至少声明 1 个 `config.event` |
| TC-C10 | defaultSchema 完整 | 含 `type`、`label`、`props`（表单件）；容器件含 `children: []` |

### L2 setup 集成（需要组件库可解析；用 `createPluginManager()` 隔离）

| ID | 用例 | 断言 |
|---|---|---|
| TC-S01 | 初始化门闩 | `setupXxx(pm)` 后 `pm.designer.initialized.value === true` |
| TC-S02 | 外壳组件齐全 | `get()` 到 `input/select/button/modal/radio/number/form-item` 全部为真 |
| TC-S03 | 消息函数 | `$message` 四方法均为 function |
| TC-S04 | 分组非空 | `getComponentSchemaGroups().value` 非空，且含 `表单`、`布局` |
| TC-S05 | 基础 type 记录 | `baseComponentTypes` 数量 === 注册的画布组件数 |
| TC-S06 | 可重入 | `setup → removeBaseComponents → setup` 后组件数不翻倍、不抛错 |
| TC-S07 | 上传配置 | 传 `{ uploadImage: 'https://x/up' }` 后 `UploadImage.defaultSchema.props.action === 'https://x/up'` |
| TC-S08 | 属性过滤 | 设 `pm.global.uploadImage` 后 `UploadImage.config.attribute` 不含 `props.action`（注意 `watchEffect` 需 `nextTick`） |
| TC-S09 | 版本分支 | mock 组件库 `version` 的两个大版本，setup 均不抛错（仅 antd 适用） |

**已验证样例（L2，2026-11-25 实测通过）**：

```ts
// packages/ui/naiveUi/src/__test__/adapter-contract.test.ts
import { createPluginManager } from '@nada-designer/manager';
import { setupNaiveUi } from 'nada-designer-naive-ui';
import { describe, expect, it } from 'vitest';

describe('naive-ui 适配器契约', () => {
  it('完成注册并置 initialized', () => {
    const pm = createPluginManager();
    setupNaiveUi(pm);

    expect(pm.designer.initialized.value).toBe(true);
    for (const type of ['form-item', 'input', 'select', 'button', 'modal', 'radio', 'number']) {
      expect(pm.component.get(type), `缺少 ${type}`).toBeTruthy();
    }
    expect(typeof pm.global.$message?.success).toBe('function');
    expect(pm.component.getComponentSchemaGroups().value.length).toBeGreaterThan(0);
  });
});
```

> 为什么用 `createPluginManager()` 而不是全局 `pluginManager`：单例会被多个用例互相污染，且热切库语义无法测。等价用法见 `packages/hooks/src/__test__/plugin/useComponentManager.test.ts:26-28`。
> 注意：必须从 `@nada-designer/manager` 入口导入，直接按文件导入 `useComponentManager` 会因 `utils ↔ manager ↔ hooks` 循环依赖报 "is not a function"。

### L3 渲染 smoke（jsdom + `@vue/test-utils`）

> 建议做法，尚未在本仓库落地（需先解决 L2 依赖矩阵，见 §4）。

| ID | 用例 | 断言 |
|---|---|---|
| TC-R01 | 固定 pageSchema 渲染 | 用一段含 `form > [input, select, switch, upload-image, row > col]` 的 `PageSchema` 渲染 `EBuilder`，各 type 对应 DOM 出现、无 `组件xxx未注册` 报错 |
| TC-R02 | 值回流 | `setData({ x: 1 })` 后控件显示 1；触发 input 事件后 `getData().x` 更新 |
| TC-R03 | 校验 | `form.validate()` 在必填为空时 reject；填值后 resolve |
| TC-R04 | 表单项 | `form-item` 渲染出 label；`checkPayload` 为失败时出现错误文案 |
| TC-R05 | 容器插槽 | row/col/card/tabs 的 children 被渲染（`#node` 协议生效） |
| TC-R06 | 事件 | 运行时 `schema.on.click` 在按钮点击后触发一次 |
| TC-R07 | 上传值格式 | 注入假 `fileList` 后 `modelValue` 为逗号串；反向回填正确 |
| TC-R08 | 设计态不炸 | `<EDesigner>` 挂载后无未注册组件告警、无 loading 卡死 |

### L4 手工验收（浏览器矩阵）

每次适配器大改后按此表过一遍（examples 本地 `pnpm dev`）：

| ID | 场景 | 通过标准 |
|---|---|---|
| TC-M01 | 拖入全部组件 | 面板分组正确、拖入后画布正常渲染 |
| TC-M02 | 属性面板 | 每个组件所有 `attribute` 行可编辑且立即生效 |
| TC-M03 | 表单校验 | 设计态/运行态都能看到必填与规则错误 |
| TC-M04 | 预览弹窗 | footer 的确定/关闭文案生效，`hideConfirm` 生效 |
| TC-M05 | 上传 | 图片/文件都能上传、回显、删除 |
| TC-M06 | 暗色 | 切换后画布、属性面板、弹窗均正常（无白底块） |
| TC-M07 | **切库** | antd → element → naive → 本库 来回切，不残留、不白屏 |
| TC-M08 | EBuilder | 运行态页面渲染与设计态外观一致 |
| TC-M09 | JSON/源码预览 | 弹窗内 Monaco 正常、无样式串味 |
| TC-M10 | 缩放 | 画布缩放后下拉/弹窗定位仍正确 |

---

## 4. 测试环境与运行矩阵

| 事实 | 影响 |
|---|---|
| 根 `node_modules` 只装了 `naive-ui`、`tdesign-vue-next`；`ant-design-vue`、`element-plus` 只在 `examples/node_modules` | L2/L3 对 naive/tdesign 可在根目录跑；对 antd/element-plus 需在 `examples` 内跑，或把两者补进根 `devDependencies`（catalog 已有版本） |
| `vitest.config.ts` 的覆盖率阈值只配了 `hooks`/`manager`/`utils` | 新增 `packages/ui/*` 测试不会拖低门槛，但也没有门槛；建议补 `packages/ui/*` 的 statements 阈值，否则契约测试会慢慢失修 |
| Windows + DSH 沙箱下 `pnpm vitest` 会因 esbuild 子进程 `spawn EPERM` 启动失败 | L1-L3 需在**非沙箱**终端或 CI 运行（本次 L2 实测即在放开沙箱后通过）；不要把此错误当成用例失败 |
| `vitest.config.ts` 已配 `environment: 'jsdom'` + `@vitejs/plugin-vue` | L3 可直接挂载 SFC，无需额外配置 |

建议目录约定（按包就近）：

```text
packages/ui/<lib>/src/__test__/
  adapter-contract.test.ts   # L2
  palette.test.ts            # L1
  render.smoke.test.ts       # L3（组件库可解析时）
```

---

## 5. 新适配器 kickoff 顺序（照做即可）

1. 复制 `packages/ui/tdesign` 骨架（`package.json` / `build.config.ts` / `dev-stub.ts` / `tsconfig.json` / `LICENSE`），替换库名
2. 装 peer 依赖；确认组件库 CSS 入口（谁 import 写进 README）
3. **先做 5 件套**：`button` / `input` / `select` / `form-item` / `modal` —— 能撑起外壳即可让设计器起来
4. `src/index.ts` 写 SET-1..SET-8，跑通 L2 的 TC-S01..S04
5. 补 `form` / `row` / `col` / `card` / `tabs` / `tab-pane`（容器插槽协议 RUN-5）
6. 补其余表单件（checkbox/radio/switch/slider/input-number/date-picker/cascader/color-picker/time-picker）
7. 最后做 upload ×2、以及库缺失件的自研（UP-1..UP-6）
8. examples 接线（PKG-8），跑 TC-M01..M03、M07
9. 属性面板过一遍 TC-M02 + TC-C07（编辑器 type 全部可解析）
10. 补 L1 用例，把 TC-C01..C10 固化成测试
11. 跑 L3（先在有依赖的库上）
12. 文档 + 版本同步（PKG-9/10）
13. CI：`stub` → `build` → `test` 顺序确认

**别跳过第 4 步**：外壳 5 件套不齐时，后面所有手工验收都会被"面板白屏"掩盖成假问题。

---

## 6. 新适配器 PR 评审清单

- [ ] `packages/ui/<lib>/src/index.ts` 只有注册与配置，**无业务逻辑**
- [ ] 所有 `component` 为懒加载；`dist` 不含组件库代码（`grep` dist 里无库名）
- [ ] 外壳 7 个 type 全部可 `get()`；`form-item` 键名为小写
- [ ] 至少一个 L2 用例进 CI，且 3 个旧适配器**同一份用例**能跑（用参数化）
- [ ] 无全局 CSS reset / 无 `:root` 变量注入
- [ ] 暗色下无白底块（截图）
- [ ] 切库热切换回归通过
- [ ] README 写清：peer 依赖、样式由谁 import、支持的组件库版本范围、已知缺口（哪些组件没有）

---

## 7. 已知坑与历史遗留

| 坑 | 说明 | 处理 |
|---|---|---|
| `component.add('FormItem', ...)` | 外壳实际取的是 **`get('form-item')`**（`dynamicFormItem.vue:26`），大小写不是同一个 key；各包 `add('FormItem')` 属历史遗留 | 新适配器只需保证 `defaultSchema.type === 'form-item'` |
| `Collapse` / `CollapseItem` / `epTable` | 三个包都注册，但全仓无消费方（外壳用的是 `base-ui` 的 `EpCollapse`） | 保持注册即可，不计入硬契约 |
| `@check` 事件 | `node.vue:508` 在听，但没有适配器 emit | 预留能力；若要做"自定义校验态"，组件 emit `{ result, message }` |
| `bindModel` 语义差异 | `checked`（antd switch）、`formatted-value`（naive date-picker）等 | 逐组件核对，见 CMP-9 |
| 设计态 `field` 后缀 | 设计模式下 field 追加 `-design-mode` | 测试不要断言精确 field；组件不要缓存 field 做 key |
| 上传响应结构 | 代码假设 `response.data.url ?? response.data` | 新适配器需在 README 写明后端响应约定 |
| 适配包断链 | `src/index.ts` import 不存在的组件文件 | 收尾或先从组件数组里摘掉 |
| antd 版本 hack | `v3/v4` 分支 + 注入 `<style>` 到 `head` | 属于"适配器内部消化版本差异"的范式，但注意热切库时 style 标签会重复插入 |

---

## 附录 A：最小 type 速查

| 分类 | type | 是否硬契约 |
|---|---|---|
| 外壳 | `input` `select` `button` `modal` `radio` `number` `form-item` | **强制** |
| 画布-表单 | `form` `textarea` `input-number` `checkbox` `switch` `slider` `date-picker` | 强制（缺则面板少件，schema 迁移不完整） |
| 画布-布局 | `row` `card` `tabs` `tab-pane` `modal` | 强制 |
| 画布-布局（子组件） | `col` | 强制但**无 `groupName`**（由 `row` 创建，不出现在面板） |
| 画布-复杂 | `cascader` `color-picker` `time-picker` `upload-image` `upload-file` | 强烈建议 |
| 遗留 | `Collapse` `CollapseItem` `epTable` | 可选 |

## 附录 B：证据索引

| 契约 | 位置 |
|---|---|
| 注册/去重/动作注入 | `packages/hooks/src/plugin/useComponentManager.ts:93-111, 270-356` |
| 分组与排序 | `packages/hooks/src/plugin/useComponentManager.ts:116-189` |
| 切库移除 | `packages/hooks/src/plugin/useComponentManager.ts:361-378` |
| 渲染器注入与插槽 | `packages/ui-kit/base-ui/src/node/node.vue:288-331, 496-527` |
| 表单项包裹 | `packages/ui-kit/base-ui/src/node/dynamicFormItem.vue:26-53` |
| 必填/规则归一 | `packages/ui-kit/base-ui/src/node/node.vue:199-271` |
| 设计态 field 后缀 | `packages/ui-kit/base-ui/src/node/node.vue:132-144` |
| 外壳组件注册 | `packages/ui-kit/panel-ui/src/components/index.ts:23-62` |
| 设计令牌 | `packages/core/src/theme/base.less:1-53` |
| 暗色切换 | `packages/hooks/src/common/theme.ts:29-31` |
| 三个参考适配器 | `packages/ui/antd/src/index.ts`、`elementPlus/src/index.ts`、`naiveUi/src/index.ts` |
| 表单范式 | `packages/ui/antd/src/form/form.vue`、`packages/ui/tdesign/src/form-item/formItem.vue` |
| 容器插槽范式 | `packages/ui/antd/src/card/card.ts`、`tabs/tabs.ts` |
| 上传范式 | `packages/ui/antd/src/upload-image/uploadImage.vue` |

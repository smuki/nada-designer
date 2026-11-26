# 设计参考：从易快报模板配置模型到新系统

> 本文是从易快报「单据模板」接口的真实数据（35 个模板、748 个控件、84 个配置项、18 种控件类型）中抽象出的**设计参考**，用于新系统的表单/流程引擎设计。
> 数据来自 `docs/reference/ekb/` 下的 JSON（[config-options.json](config-options.json)、[widget-types.json](widget-types.json)），本文只讲**结构与取舍**，不绑定易快报具体字段。

## 1. 参考定位

- **参考结构，不参考数值**：配置项出现次数、默认值、样例都是该租户的真实配置；换租户/换系统后分布会变，但配置项的**集合与语义**基本稳定。
- **字段与控件解耦**：易快报把「业务字段字典（propertySet）」和「控件绑定（components）」分成两个接口。新系统也建议保留这层解耦——字段描述“是什么”，模板描述“怎么展示/怎么填”。
- **模板 = 扁平有序控件列表**：没有嵌套 children，版式元素（分组标题/说明/分隔线）与字段控件混排，顺序即渲染顺序。

## 2. 建议的模型分层

```text
FormTemplate                    表单/单据模板
├─ meta       id / name / type(expense|requisition|loan|payment|custom)
│             state / active / version / dbVersion / visibility
├─ configs    能力配置块（按 ability 分组：pay/print/expense/apply…）
└─ controls[] 控件数组（扁平、有序）
     ├─ type          控件类型（注册表 key，如 text/select/money）
     ├─ field         业务字段名（→ 字段字典 FieldCatalog）
     ├─ config        静态配置（必填、可编辑、隐藏、占位、类型专属…）
     └─ runtimeRules  动态规则（hide/optional/setip，条件表达式）

FieldCatalog                    业务字段字典（独立服务）
└─ Field        name / label / dataType / entity / ability / 是否可做维度
```

对应到实现，建议拆成 4 个独立能力，而不是写死在一个大对象里：

| 能力 | 职责 | 参考数据 |
| --- | --- | --- |
| 字段字典 FieldCatalog | 字段语义、类型、选项来源（ref → 维度/枚举） | 406 个字段的定义 |
| 控件注册表 WidgetRegistry | 控件类型 → 前端组件 + 配置 schema | `widget-types.json` 18 种 |
| 配置 schema ConfigSchema | 每个控件可配哪些项、类型、默认值 | `config-options.json` 84 项 |
| 表达式引擎 FormulaEngine | 字段引用、函数、条件求值 | 公式默认值/动态规则 |

## 3. 控件注册表设计

18 种控件可归为 4 类，建议注册表里每项声明：`code`、`名称`、`绑定 dataType`、`默认配置`、`支持的动态规则`、`前端组件映射`。

| 类别 | 控件（数量） | 绑定字段类型（易快报实测） | 建议前端组件 |
| --- | --- | --- | --- |
| 输入类 | `text` 168、`textarea` 41、`money` 40、`number` 1、`date` 46、`dateRange` 7、`switcher` 5 | text / money / number / date / dateRange / boolean | Input、Textarea、MoneyInput、InputNumber、DatePicker、RangePicker、Switch |
| 选择类 | `select` 276、`city` 6、`payeeInfo` 17、`dataLink` 24、`corporateExpenseCard` 1 | ref / list / 专用组件 | 实体选择器、城市选择、收款信息、业务对象选择、易商卡组件 |
| 列表类 | `attachments` 40、`details` 14、`requisitionDetails` 11 | list | Upload、明细子表格 |
| 版式类 | `group` 19、`annotation` 19、`separator` 13 | —（无 field） | 分组标题、说明文本、分隔线 |

设计建议：

1. **控件与版式分离**：版式元素没有 `field`、没有值配置，只有 `label`（annotation 额外有 `url`/`maxLength`/`onlyEditVisible`）。注册表里用 `kind: data | layout` 区分，避免渲染器分支混乱。
2. **一个 dataType 可对应多个控件**（如 `text` 可配 `text`/`textarea`；`ref` 可配 `select`/`dataLink`/`city`/`payeeInfo`），所以**不能用 dataType 反推控件**，必须显式存 `type`。
3. **控件注册表配置用 schema 描述**：每个控件列出它支持的配置项（可直接从 `config-options.json` 的 `widgets` 字段反查），前端据此动态渲染配置面板，而不是硬编码表单。

## 4. 配置模型设计

### 4.1 三层配置

| 层级 | 内容 | 易快报对应 | 建议 |
| --- | --- | --- | --- |
| 模板级配置 | 按业务能力分块的配置（支付、打印、编码规则、核销…） | `specifications[].configs[]`（`ability` 分组） | 用 ability → config 的 Map，避免大 flat 对象 |
| 控件静态配置 | 必填/可编辑/隐藏/占位/长度/数值范围/明细样式… | `components[].*` | 按 `config-options.json` 的 category 分组，强类型 |
| 控件动态规则 | 运行时按条件改变 hide/optional 等 | `components[].configs[]`（property + formula） | 单独存规则数组，求值时覆盖静态配置 |

### 4.2 静态配置分组（共 84 项，12 类）

| 类别 | 项数 | 说明 |
| --- | --- | --- |
| 基础标识 | 5 | 名称/类型/绑定字段 |
| 显示与占位 | 5 | 占位提示、说明链接 |
| 编辑、必填与复制 | 6 | 是否可编辑/非必填/可复制 |
| 显隐与权限 | 5 | 隐藏 + 例外可见 + 黑名单 |
| 默认值与动态配置 | 3 | 默认值、取值优先级、动态规则 |
| 依赖与联动 | 16 | 依赖字段、过滤、联动赋值、层级规则 |
| 文本/数字/金额/日期 | 13 | 长度、范围、格式、时间精度 |
| 选择器 | 13 | 范围、多选、层级路径、导入 |
| 城市 | 3 | 城市组/城市选项 |
| 附件 | 2 | 明细发票类型校验 |
| 明细表格 | 11 | 样式、排序、费用类型导入、币种 |
| 业务对象/公司卡 | 2 | 业务对象模板、卡种范围 |

### 4.3 语义建议（避免照搬易快报的坑）

- **必填**：易快报用 `optional`（true=非必填），语义反向；新系统建议正向 `required: boolean`，迁移时取反。
- **只读**：易快报的 `readonly` 恒 false，实际只读用 `editable: false` 表达（180 个）。新系统只保留一个 `editable` 即可，`readonly` 可丢弃。
- **隐藏**：`hide`（默认隐藏）+ `hideVisibility`（不隐藏的例外人群）+ `hideBlacklistVisibility`（黑名单）。新系统建议统一成 `hidden: boolean` + `visibleFor: Scope` + `hiddenFor: Scope`，避免三套字段。
- **默认值**：用判别联合：`{ kind: 'none' | 'predefined' | 'formula' | 'constant' | 'aggregate', value/expr }`。易快报 predefine 有 `submit.date`/`submitter`/`submit.department`/`entity.default` 等标记。
- **取值优先级**：`priority: [{ source: 'manual' | 'linkage' | 'auto_calc' | 'cost_standard', weight: number }]`，保留数值可比。
- **动态规则**：`rules: [{ property: 'hide'|'optional'|'tip', when: expression, value }]`，运行时求值后**覆盖**静态配置。
- **外部引用**：`assignmentRule`/`filterId`/`referenceData`（业务对象模板）都只是 ID，新系统应设计成“引用 + 解析服务”，不要内联复杂规则。
- **null vs missing**：null = 已声明但未配置；字段缺失 = 该控件不支持该配置。序列化时建议显式区分（如 `undefined` 不落盘、`null` 表示未配置）。

### 4.4 建议的控件 schema（示意）

```json
{
  "type": "select",
  "field": "legalEntity",
  "required": true,
  "editable": true,
  "hidden": false,
  "defaultValue": { "kind": "formula", "expr": "`$applicantCompany`" },
  "rules": [{ "property": "optional", "when": "`$isProxy` == \"是\"", "value": true }],
  "dependencies": [{ "field": "submitterId", "direction": "forward", "condition": "AND" }],
  "options": { "range": "all", "multiple": false, "hideCode": true },
  "limits": {}
}
```

## 5. 运行时管线（渲染/提交顺序）

建议按下列顺序实现，避免“先渲染后判断”导致的闪烁与脏数据：

1. **加载模板**：指定 `templateId` + 版本（易快报有 `version`/`dbVersion`/`grayver`）；
2. **解析字段**：`fieldRef` → FieldCatalog，拿到 label、dataType、选项来源；
3. **静态配置合并**：模板默认 → 控件配置；
4. **动态规则求值**：按当前用户/表单上下文计算 hide/optional/tip，覆盖静态值；
5. **权限/可见性**：模板 `visibility` + 控件 `visibleFor`/`hiddenFor`；
6. **依赖与过滤**：计算依赖字段、过滤条件，拉取选项数据（维度/枚举/员工/部门/业务对象/单据）；
7. **默认值与优先级**：按 priority 顺序决定最终值（公式需依赖图拓扑求值）；
8. **渲染**：按 controls 顺序渲染，版式元素作为区块/分隔；
9. **明细行**：`details` 这类明细区需要加载“费用类型/子模板”才能渲染每行控件；
10. **提交**：表单值以 `field` 为 key；校验必填/长度/范围；隐藏但预填的字段也要提交。

> 公式求值建议做成 DAG：公式 A 引用字段 B，则 B 先算；易快报公式支持反引号字段引用与 `to_Str`/`format`/`day_diff`/`month_add`/`if` 等函数。

## 6. 新系统必做能力清单

用 `config-options.json` 逐项对照，建议至少覆盖：

| 能力 | 参考数据 | 建议实现 |
| --- | --- | --- |
| 控件注册表 | 18 种控件、748 个控件 | 注册表 + schema 驱动配置面板 |
| 配置项校验 | 84 项配置 | 每控件一个 schema，保存时校验 |
| 默认值 | 5 种 kind（none/predefine/formula/constant/sum） | 统一 DefaultValue 联合类型 + 解析器 |
| 取值优先级 | 4 类来源 | priority 数组 + 解析顺序 |
| 动态规则 | 61 个控件使用、hide/optional/setip | 规则表 + 条件表达式引擎 |
| 依赖与联动 | 70 条依赖、79 个 assignmentRule、9 个 filterId | 依赖图 + 外部规则引用 |
| 数据过滤 | filterId、filterRules（收款对象类型） | 过滤器服务（可复用查询 DSL） |
| 选项服务 | ref entity → 维度/枚举/员工/部门/业务对象 | 统一 OptionProvider 接口 |
| 明细子表 | details/requisitionDetails + feeTypeForm | 子模板加载 + 行级校验 |
| 可见性/权限 | hideVisibility / hideBlacklistVisibility / 模板 visibility | Scope 表达式 + 用户上下文 |
| 多语言 | label/cnLabel/enLabel + 3 种 placeholder | i18n 回退链 enLabel → cnLabel → label |
| 版本与灰度 | version/dbVersion/grayver | 模板版本化 + 灰度发布 |
| 校验 | maxLength/minLength/max/min/exceedConfigs/countRule | 统一 Validator |

## 7. 迁移时容易踩的坑

1. **别照抄易快报字段名**：`readonly`/`showInDetails`/`defaultField` 恒 false，`copyable` 恒 true，这些是历史保留字段；`caculate`（应为 calculate）、`canNotBeApportioned` 等命名也不规范。
2. **`optional` 是反向语义**：新系统建议用 `required`。
3. **“隐藏 + 预填”是常态**：280 个控件隐藏、其中 138 个带默认值（84 个公式）。新系统必须支持“隐藏但参与计算/提交”的字段，否则会丢值。
4. **公式不能只做文本替换**：需要安全的表达式引擎（类型、函数、依赖图、循环检测）。
5. **ID 引用要可解析**：assignmentRule/filterId/referenceData 只是 ID，需配套查询服务，否则无法渲染/联动。
6. **选项不在模板里**：ref 字段只给实体类型（如 `organization.Staff`、`basedata.Dimension.成本中心`），选项必须另查。
7. **字符串数值**：易快报 money/number 的 max/min 是字符串（如 `"10000000000.00"`），新系统建议数值类型。
8. **租户扩展字段**：`u_` 前缀字段是租户自定义，字段字典要支持扩展命名空间；换租户后字段集合不同。
9. **明细行控件不在主模板**：`details` 只声明明细区，行内控件由费用类型模板决定，新系统要设计“子模板/行模板”概念。
10. **版式即顺序**：易快报没有嵌套布局，group/annotation/separator 是顺序中的版式元素；若新系统要支持多列/嵌套，需额外定义布局模型（不要假设能直接套用）。

## 8. 验证清单（落地时逐项打勾）

- [ ] 用 `widget-types.json` 建立「易快报 type → 新系统组件」映射表，18 项全覆盖；
- [ ] 用 `config-options.json` 建立「配置项 → 新系统字段」映射表，84 项逐项确认支持/降级/忽略；
- [ ] 用模板样例（`widget-types.json` 的 `example`、字段配置项文档附录 9.3）做 golden case：渲染结果 + 提交值；
- [ ] 覆盖 5 种默认值类型与 4 类优先级；
- [ ] 覆盖动态规则（hide/optional）与依赖/过滤；
- [ ] 覆盖隐藏字段参与计算与提交；
- [ ] 覆盖明细子表（费用类型模板）场景；
- [ ] 覆盖多语言回退与空值语义（null vs missing）。

## 9. 相关文件

- [config-options.json](config-options.json)：84 个配置项机器可读字典
- [widget-types.json](widget-types.json)：18 种控件类型与配置项清单
- [README.md](README.md)：参考包索引与数据来源
- [../../易快报单据模板字段配置项说明.md](../../易快报单据模板字段配置项说明.md)：配置项可读版说明
- [../../易快报单据模板(specificationGroups)分析.md](../../易快报单据模板(specificationGroups)分析.md)：模板数据结构分析
- [../../易快报业务字段定义.md](../../易快报业务字段定义.md)：406 个业务字段字典

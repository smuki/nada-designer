# 易快报单据模板（specificationGroups）数据分析

> **数据来源**：`GET https://app.ekuaibao.com/api/form/v2/specificationGroups?orgId=&corpId=ID01PH4Q5CJboX&accessToken=…`
>
> - **抓取时间**：2026-11-21
> - **企业 ID**：`ID01PH4Q5CJboX`
> - **数据规模**：4 个模板分组、35 个单据模板、748 个控件实例、约 877 KB
> - **结构化参考包**（供新系统设计使用）：[docs/reference/ekb/README.md](reference/ekb/README.md)（配置项字典 JSON + 控件清单 JSON + 设计要点）
>
> **一句话结论**：上一份 [`propertySet` 字段字典](易快报业务字段定义.md) 只回答“字段是什么”（数据语义），这份 `specificationGroups` 回答“字段在界面上怎么渲染”（控件类型 + 绑定 + 配置）。二者通过 `component.field` ↔ `propertySet.name` 关联——本次 150 个模板字段 **100% 命中** propertySet。

## 目录

1. [接口与数据概况](#1-接口与数据概况)
2. [数据模型](#2-数据模型)
3. [模板分组（4 个）](#3-模板分组4-个)
4. [单据模板（35 个）](#4-单据模板35-个)
5. [模板级配置 configs](#5-模板级配置-configs)
6. [控件体系 components](#6-控件体系-components)
7. [控件与业务字段映射](#7-控件与业务字段映射)
8. [渲染与接入建议](#8-渲染与接入建议)
9. [附录](#9-附录)

## 1. 接口与数据概况

### 1.1 请求

| 项 | 值 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/api/form/v2/specificationGroups` |
| 参数 | `corpId`（企业 ID）、`accessToken`（令牌）、`orgId`（本例为空串） |
| 特点 | 一次返回全部模板及全部控件，无分页、无 `total`、无版本参数 |

### 1.2 响应结构

响应体只有 `items`，每个 item 是一个**模板分组**，分组里内嵌 `specifications`（单据模板），模板里再内嵌 `components`（控件列表）：

```text
{ items: [ specificationGroup ] }
  specificationGroup
    ├─ id / name / enName / version / dbVersion / active / locked …
    └─ specifications: [ specification ]
         ├─ id / name / type / state / active / systemPreset / usageMode / icon / color / pri …
         ├─ configs:    [ { ability: "pay", … } ]        模板级配置（按业务能力分块）
         ├─ components: [ { type: "select", field: "法人实体", … } ]   控件（扁平有序）
         │    └─ configs: [ { property: "hide", formula: "…", ability: "caculate" } ]  控件级动态规则
         ├─ rules:      [ { code, field, standard } ]     模板规则
         └─ visibility: { fullVisible, staffs, roles, departments, … }  可见范围
```

### 1.3 规模指标

| 指标 | 数值 | 说明 |
| --- | --- | --- |
| 模板分组 | 4 | 3 个业务分组 + 1 个系统分组 |
| 单据模板 | 35 | 含测试/停用模板 |
| 启用模板 | 28 | `active = true` |
| 停用模板 | 7 | `active = false` |
| 控件实例 | 748 | components 扁平数组元素总数 |
| 绑定业务字段的控件 | 697 | 带 `field` 的控件 |
| 去重后业务字段 | 150 | 全部命中 propertySet |
| 控件类型 | 18 | 见 6.1 控件类型表 |
| 模板级配置块 | 307 | `spec.configs` 元素总数 |
| 模板级配置 ability | 17 | 17 种 |
| 规则 | 5 | 仅 5 个模板有 `rules` |
| 全员可见模板 | 18 | `visibility.fullVisible = true` |

### 1.4 与 propertySet 的分工

| 维度 | `propertySet`（字段字典） | `specificationGroups`（模板） |
| --- | --- | --- |
| 数量 | 406 个字段定义 | 35 个模板 / 748 个控件 |
| 描述什么 | 字段语义：名称、类型、是否可做维度、业务归属 | 渲染 schema：控件类型、绑定字段、必填/隐藏/默认值/联动 |
| 关联键 | `name` | `component.field` |
| 能否渲染界面 | 不能（只有类型提示） | 能（控件 + 配置 + 顺序） |

## 2. 数据模型

### 2.1 模板分组属性（18 个）

| 属性 | 含义 | 本次观察 |
| --- | --- | --- |
| `id` | 分组 ID | 两种形态：随机 ID（新建）与 `corpId:xxx`（内置分组） |
| `name` / `enName` | 中文/英文名 | 4 个分组均有中英文名 |
| `nameSpell` | 名称拼音（搜索用） | 如 `GERENFEIYONG` |
| `version` / `dbVersion` | 乐观并发版本 | 2/2、3/3、6/3、9/3 |
| `active` | 是否启用 | 全部 `true` |
| `locked` | 是否锁定（禁止编辑） | 全部 `false` |
| `createTime` / `updateTime` | 创建/更新时间（毫秒时间戳） | 最早 2020-03，最近 2026-11 更新 |
| `corporationId` / `sourceCorporationId` / `dataCorporationId` | 租户/来源/数据归属企业 | 均为当前 corpId 或 null |
| `pipeline` / `grayver` / `threadId` | 平台内部元数据 | 灰度版本 `9.167.0.0-prd` |
| `appId` | 关联应用 ID | 全部 null |
| `specifications` | 内嵌的模板数组 | 35 个模板分布在这 4 个分组中 |

### 2.2 单据模板属性（35 个）

| 属性 | 含义 | 本次观察 |
| --- | --- | --- |
| `id` | 模板 ID（渲染/查询的主键） | 32 个普通 ID；1 个 `corpId:system:*`；2 个 `corpId:PRESET_*` |
| `name` / `enName` / `nameSpell` | 名称 | 部分模板无英文名 |
| `type` | 单据类型 | `expense` / `requisition` / `loan` / `payment` / `custom` |
| `state` | 状态 | 全部 `PUBLISHED` |
| `active` | 是否启用 | 28 启用 / 7 停用 |
| `systemPreset` | 是否平台预置模板 | 全部 `false`（本租户自定义配置） |
| `usageMode` | 使用模式 | 全部 `ALL` |
| `specificationGroupId` | 所属分组 | 与分组 `id` 对应 |
| `editorId` | 最后编辑人 | 形如 `corpId:staffId` |
| `icon` / `color` / `pri` | 图标/主题色/排序 | 5 种图标、4 种颜色；`pri` 全部 0 |
| `code` / `description` | 编码/描述 | 全部为空 |
| `budgetPermitAllowEdit` | 预算权限内是否可改 | 全部 `false` |
| `forbidSubmit` | 禁止提交 | 全部 `false` |
| `mustUpdateTemplate` | 是否必须更新模板 | 14 个为 `true`（多为常用在途模板） |
| `visibility` | 可见范围 | 18 个全员可见，其余按人员/角色/部门受限 |
| `flowPlanConfigId` | 流程配置 ID | 全部 null（实际值在 `configs.flow.flowPlanConfigId`） |
| `configs` | 模板级配置数组 | 见第 5 节，平均 8.8 块/模板 |
| `components` | 控件数组 | 见第 6 节，平均 21.4 个/模板（7 ~ 50） |
| `rules` | 规则数组 | 见第 8 节，5 个模板各 1 条 |
| `version` / `dbVersion` / `grayver` / `pipeline` / `threadId` / `appId` | 平台元数据 | 用于并发控制与灰度，业务上一般忽略 |

## 3. 模板分组（4 个）

| 分组 | ID | 模板数 | 版本 | 创建时间 | 更新时间 | 英文名 |
| --- | --- | --- | --- | --- | --- | --- |
| 预算调整（系统） | `ID01RXB9Ivt1oz` | 3 | v2 / dbv2 | 2026-04-07 | 2026-11-04 | Budget Adjustment (System) |
| 个人费用 | `ID01RKk7PwG6If` | 8 | v3 / dbv3 | 2026-03-30 | 2026-11-04 | Personal Expenses |
| 部门费用 | `ID01PH4Q5CJboX:personalCost` | 11 | v6 / dbv3 | 2020-03-26 | 2026-11-04 | Departmental Expenses |
| 申请事项 | `ID01PH4Q5CJboX:departmentCost` | 13 | v9 / dbv3 | 2020-03-16 | 2026-11-04 | Application Item |

观察：

- 业务分组依次为 **个人费用**（8）、**部门费用**（11）、**申请事项**（13），另有系统分组 **预算调整（系统）**（3）；
- 两个内置分组使用 `corpId:personalCost` / `corpId:departmentCost` 形式的固定 ID（2020 年创建），两个新分组使用随机 ID（2026 年创建），说明分组 ID 形态不统一，接入时不要按 ID 规则硬编码；
- 分组 `version`/`dbVersion` 每次模板变更都会递增，可作为缓存失效信号。

## 4. 单据模板（35 个）

### 4.1 模板类型分布

| `type` | 含义 | 数量 |
| --- | --- | --- |
| `expense` | 报销单 | 14 |
| `requisition` | 申请单 | 14 |
| `loan` | 借款单 | 3 |
| `payment` | 付款单 | 3 |
| `custom` | 自定义单据 | 1 |

其中 `payment`（付款单）与 `custom`（自定义单据）数量少，属于该租户为资金调拨、预算调整单独配置的模板。

### 4.2 模板清单

| 分组 | 模板名 | 类型 | 控件数 | 配置块 | 规则 | 状态 | 可见范围 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 预算调整（系统） | 摊销明细确认单 | 报销单 | 20 | 10 | 0 | 启用 | 受限 |
| 预算调整（系统） | 待摊合同确认单 | 申请单 | 20 | 7 | 0 | 启用 | 受限 |
| 预算调整（系统） | 预算调整申请单 | 自定义单据 | 8 | 7 | 0 | 启用 | 受限 |
| 个人费用 | 差旅费和市内交通费快速报销单「测试」 | 报销单 | 27 | 10 | 1 | 启用 | 受限 |
| 个人费用 | 历史借款导入 | 借款单 | 7 | 11 | 0 | 停用 | 全员 |
| 个人费用 | 个人费用报销单-测试 | 报销单 | 30 | 11 | 0 | 停用 | 受限 |
| 个人费用 | 差旅费和市内交通费快速报销单 | 报销单 | 28 | 10 | 1 | 启用 | 全员 |
| 个人费用 | 差旅费和市内交通费快速报销单（暂弃） | 申请单 | 15 | 7 | 0 | 停用 | 受限 |
| 个人费用 | 个人借款单 | 借款单 | 25 | 8 | 0 | 启用 | 全员 |
| 个人费用 | 个人费用报销单 | 报销单 | 34 | 11 | 0 | 启用 | 全员 |
| 个人费用 | 快速报销单（自动生成）（暂弃） | 报销单 | 16 | 8 | 0 | 停用 | 受限 |
| 部门费用 | 资金调拨明细单（外币） | 付款单 | 17 | 8 | 0 | 启用 | 受限 |
| 部门费用 | 资金调拨单「多币种」 | 报销单 | 9 | 14 | 0 | 停用 | 受限 |
| 部门费用 | 支付退票申请单 | 报销单 | 19 | 10 | 0 | 启用 | 全员 |
| 部门费用 | 资金调拨明细单（自动付款） | 付款单 | 16 | 8 | 0 | 启用 | 受限 |
| 部门费用 | 内部付款申请单 | 报销单 | 34 | 10 | 0 | 启用 | 受限 |
| 部门费用 | 资金调拨明细单（自动生成） | 付款单 | 17 | 8 | 0 | 启用 | 受限 |
| 部门费用 | 资金调拨单 | 报销单 | 8 | 14 | 0 | 启用 | 受限 |
| 部门费用 | 付款申请单（自动生成） | 报销单 | 42 | 10 | 1 | 启用 | 全员 |
| 部门费用 | 先款后票核销单 | 报销单 | 35 | 10 | 0 | 启用 | 全员 |
| 部门费用 | 付款申请单（先款后票） | 报销单 | 39 | 10 | 1 | 启用 | 全员 |
| 部门费用 | 付款申请单（已有发票） | 报销单 | 40 | 10 | 0 | 启用 | 全员 |
| 申请事项 | 二手车销售统一发票「自动开票」 | 申请单 | 50 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 发票申请单「自动开票」 | 申请单 | 40 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 国际易商卡额度申请 | 申请单 | 10 | 12 | 0 | 启用 | 受限 |
| 申请事项 | 激励码申请单 | 申请单 | 10 | 7 | 0 | 启用 | 受限 |
| 申请事项 | 测试-项目预算申请单 | 申请单 | 16 | 7 | 0 | 停用 | 受限 |
| 申请事项 | 预提申请单 | 申请单 | 19 | 7 | 0 | 启用 | 受限 |
| 申请事项 | 项目预算申请单 | 申请单 | 18 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 采购申请单（自动生成） | 申请单 | 15 | 7 | 1 | 启用 | 全员 |
| 申请事项 | 发票申请单 | 申请单 | 11 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 支付本地账号申请 | 申请单 | 10 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 财务资料申请单 | 申请单 | 14 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 银行账号申请 | 申请单 | 18 | 7 | 0 | 启用 | 全员 |
| 申请事项 | 备用金申请 | 借款单 | 11 | 6 | 0 | 停用 | 全员 |

### 4.3 观察

- 全部 35 个模板 `state = PUBLISHED`，但 **7 个 `active = false`**（历史借款导入、若干「测试」「暂弃」模板、资金调拨多币种、备用金申请等）。渲染/发起单据时必须再判断 `active`，不能只看 `PUBLISHED`；
- 模板命名中直接出现「测试」「暂弃」「（自动生成）」属于该租户的真实配置，接入时建议按 `active` + `specificationGroupId` 过滤，而不是按名称排除；
- `mustUpdateTemplate = true` 的 14 个模板是当前在用的主力模板（个人费用报销单、付款申请单系列、发票申请单等）；
- 图标/主题色只有 5 种 icon、4 种 color，可作为列表展示资源映射。

## 5. 模板级配置 `configs`（17 种 ability）

`spec.configs` 是数组，每一项对应一个业务能力（`ability`）的整块配置。同一模板通常包含多个能力块，**所有 35 个模板都有 `flow`、`print`、`code` 三块**，其余按单据类型出现：

| `ability` | 出现模板数 | 配置键 |
| --- | --- | --- |
| `flow` | 35 | flowPlanConfigId |
| `print` | 35 | printTemplateId, isPrintInvoice, multipleMode |
| `code` | 35 | codeRuleId |
| `voucherPreview` | 32 | isSupportVoucherPreview, visibility |
| `habExtend` | 32 | isSupportHabExtend, extendData, visibility |
| `pay` | 22 | isRequirePayeeInfo, payMoney, allowMultiplePayees, detailsOnly, moneyOnly, payeeOnly, optionalPayeeByZero, paymentPlanByApportion, allowSelectionReceivingCurrency, currencyRange |
| `manualRepayment` | 17 | allowBeneficiaryInfo, allowManualRepayment, beneficiaryType |
| `writtenOff` | 14 | writeOffTurnOff, limitOnlyOneSubmitExpense, mustWrittenOff, loanList, foreignCurrency, writtenOffRateType, crossCurrencyWrittenOff, crossCurrencyWrittenOffRateType, sameLegalEntityWrittenOff |
| `expense` | 14 | feeType, isInvoiceBagCode, isTicketReview, lockFeeTypeVersion, isSubmitEditable, isApproveEqualExpense, isApproveGreatExpense, isForbiddenByFeeType, isEBussCard, draftFlowCheckCostControl |
| `chargeAgainst` | 14 | isChargeAgainst |
| `apply` | 14 | canApply, mustApply, requisitionList, overCheck, isForbidSubmit, sameCurrency, sameLegalEntity, tripOrderInfo, autoAssociateOrderConfig, onlyRequisitionDetails, checkTravelCloseLoop, checkTravelOrderConfirm, limitTripOrder |
| `requisition` | 14 | applyContentRule, applyCloseRule, feeType, tripType, linkRequisitionInfo, linkRequisitionControlled, applyRule, lockFeeTypeVersion, overLimitCloseOption, allowSubmitterRetract, autoShareRule, autoShare, ignoreUsageSpecificationIds, optionalComment, forbidInitiateChange, renewRequisitionInfoName, tppBusinessType, requisitionCustomCloseRuleId, cannotManualClose, forbidChangeFromRequisitionInfo, draftFlowCheckCostControl, allowECardOfflineAuthorized |
| `erpVoucher` | 10 | voucherNo, voucherStatus, voucherCreateTime |
| `sourceFileTemplate` | 8 | sourceFileTemplateId |
| `loan` | 5 | isLimitRepaymentDate, allowModifyRepaymentDateConfig, limitRepaymentDateRange, foreignCurrency, writtenOffMaxTimes, autoShare, allShare |
| `publicExpansion` | 4 | isConfigureDefaultCurrency, currencyInfoId |
| `allowRepayment` | 2 | isAllowedRepayment, isAllowedRepaymentForeign, isForbiddenSubmit |

典型配置说明：

- `pay`：支付相关配置，其中 `payMoney` 是支付金额公式，如个人费用报销单里为 `"expenseMoney-writtenOffMoney"`；`isRequirePayeeInfo`、`allowMultiplePayees`、`paymentPlanByApportion` 控制收款信息与支付计划行为；
- `expense`：报销单配置，`feeType` 限定可选费用类型（`{isAll:false, ids:[...]}`），`isTicketReview`、`isEBussCard`、`lockFeeTypeVersion` 控制票审与费用类型版本；
- `apply`：关联申请配置，`canApply`/`mustApply`/`requisitionList`/`onlyRequisitionDetails` 控制能否关联、是否必须关联申请单；
- `writtenOff`：核销配置（`mustWrittenOff`、`crossCurrencyWrittenOff` 等）；
- `requisition`：申请单专属（`applyContentRule`、`tripType`、`linkRequisitionInfo` 等 22 个键）；
- `loan` / `allowRepayment` / `manualRepayment`：借款与还款配置；
- `erpVoucher` / `sourceFileTemplate` / `publicExpansion`：ERP 凭证、源文件模板、多币种等集成配置；
- `habExtend` / `voucherPreview`：扩展与凭证预览的可见范围。

> 这些 `ability` 与 `propertySet` 的 `ability` 是同一套业务能力标识（`flow`/`pay`/`expense`/`apply`/`writtenOff`…），可以据此把“字段”和“模板配置”挂到同一个业务模块下。

## 6. 控件体系 `components`

### 6.1 控件类型（18 种）

`components` 是**扁平、有序**数组：遍历顺序就是页面渲染顺序，没有嵌套 children。每个控件的 `type` 就是前端组件类型：

| `type` | 数量 | 含义 | 对应 propertySet 的 dataType | 典型字段 |
| --- | --- | --- | --- | --- |
| `select` | 276 | 下拉/选择器（人员、部门、维度、枚举、单据） | ref（273）/ list（3） | 法人实体、u_摊销方式、submitterId |
| `text` | 168 | 单行文本输入 | text | title、u_供应商名称、u_供应商编码 |
| `date` | 46 | 日期选择 | date | expenseDate、u_开始时间、u_结束时间 |
| `textarea` | 41 | 多行文本输入 | text | title、u_内部备注、description |
| `attachments` | 40 | 附件上传 | list&lt;attachment&gt; | attachments、u_银行回单、u_退票回单 |
| `money` | 40 | 金额输入（千分位、上下限） | money | u_合同金额、beforeAdjustAmount、afterAdjustAmount |
| `dataLink` | 24 | 业务对象（数据关联）选择 | ref → datalink.DataLinkEntity.* | u_关联合同流程、u_使用权摊销明细、u_关联直线摊销 |
| `annotation` | 19 | 说明/提示文本（版式元素） | —（无 field） | — |
| `group` | 19 | 分组标题（版式元素） | —（无 field） | — |
| `payeeInfo` | 17 | 收款信息选择组件 | ref → pay.PayeeInfo | payeeId |
| `details` | 14 | 费用明细表格（报销单） | list（details） | details |
| `separator` | 13 | 分隔线（版式元素） | —（无 field） | — |
| `requisitionDetails` | 11 | 费用明细表格（申请单） | list（details） | details |
| `dateRange` | 7 | 日期区间选择 | dateRange | u_受益期间、feeDatePeriod |
| `city` | 6 | 城市选择 | ref → basedata.city | u_常驻地 |
| `switcher` | 5 | 开关 | boolean | u_合思提单判断 |
| `number` | 1 | 数字输入 | number | u_总天数 |
| `corporateExpenseCard` | 1 | 易商卡申请组件 | corporateExpenseCard | corporateExpenseCardForm |

合计 748 个控件实例。版式元素（`group` / `annotation` / `separator`）没有 `field`，其余 697 个控件都绑定了一个业务字段。

### 6.2 控件通用属性

| 属性 | 含义 | 观察 |
| --- | --- | --- |
| `field` | 绑定的业务字段名，= propertySet.name | 697 个控件有值 |
| `label` / `cnLabel` / `enLabel` | 显示名（模板内可覆盖字段名） | 存在 `cnLabel` 为 null、`enLabel` 为空的情况 |
| `type` | 前端组件类型 | 18 种，见 6.1 |
| `placeholder` / `cnPlaceholder` / `enPlaceholder` | 占位提示 | 文本/选择类控件普遍有值 |
| `optional` | 是否非必填 | 有值控件中大量为 true；也可被 `configs` 动态覆盖 |
| `readonly` | 是否只读 | **全部为 false**，实际只读效果由 `editable`/`hide`/权限控制 |
| `editable` | 是否可编辑 | 金额/日期等自动计算字段常为 false |
| `hide` | 是否默认隐藏 | 预填/自动计算字段普遍隐藏（如 money 控件 29/40 隐藏） |
| `hideVisibility` / `hideBlacklistVisibility` | 隐藏的例外可见范围 | 结构同 `visibility`，控制“谁可见” |
| `visibility` | 控件级可见范围 | 部分控件有值，null 表示不额外限制 |
| `defaultValue` | 默认值 | 5 种类型，见 6.3 |
| `priority` | 取值来源优先级 | 见 6.4 |
| `configs` | 控件级动态规则 | 见 6.5 |
| `dependence` / `dependenceCondition` / `filterId` | 字段联动/过滤条件 | 如“直接上级”依赖“提交人” |
| `copyable` / `showInDetails` | 可复制 / 是否在明细中展示 | 前者普遍 true，后者本次全部 false |

### 6.3 默认值 `defaultValue`（697 个控件设置）

| `type` | 数量 | 说明 |
| --- | --- | --- |
| `none` | 392 | 不设默认值，留空待填 |
| `predefine` | 130 | 平台预定义值（如 `submit.date` 提交日期、`entity.default` 默认主体） |
| `formula` | 93 | 公式计算（EKB 表达式，如 `` `$提交人`.name + "申请报销" ``） |
| `constant` | 61 | 常量/固定选项（如固定某个维度 `{id: "ID01..."}`） |
| `sum` | 21 | 明细汇总（如 `amount` 把明细金额合计到表头） |

公式默认值使用易快报表单表达式，例如标题字段：

```text
`$提交人`.name + "申请报销" + to_Str(`$付款金额`.本位币) + "元"
```

支持 `if`、`day_diff`、`to_Str` 等函数，说明**渲染端需要具备表达式求值能力**，否则只能展示为空。

### 6.4 取值优先级 `priority`

多数控件带 `priority` 数组，声明 4 类取值来源的相对优先级：

| 取值来源 | 含义 |
| --- | --- |
| `MANUALLY_FILL_IN` | 手工录入 |
| `LINKAGE_ASSIGNMENT` | 联动赋值（其他字段带出） |
| `AUTOMATIC_CALCULATION` | 自动计算（公式/默认值） |
| `COST_STANDARD` | 费用标准/制度取值 |

同一来源在不同控件里的优先级数值可能不同（如 5/10/15/20 的组合会变化），应按控件实际的 `value` 排序处理。

### 6.5 控件级动态配置 `configs`

`components[].configs` 是**运行时动态属性**，结构为 `{ property, valueType, formula, ability }`：

| `property` | 出现次数 | 含义 |
| --- | --- | --- |
| `hide` | 55 | 满足公式时隐藏 |
| `optional` | 39 | 满足公式时切换必填 |
| `setip` | 4 | 设置说明文案（set tip） |

示例（快速报销单）：

```json
{
  "property": "hide",
  "valueType": "BOOLEAN",
  "formula": "`$付款金额`.本位币 <= 2000",
  "ability": "caculate"
}
```

即“付款金额（本位币）≤ 2000 时隐藏该控件”。注意 `ability` 值 `caculate` 是平台侧拼写（应为 calculate），接入时按原值透传即可。

### 6.6 各控件的专属属性

| 控件 | 专属属性 |
| --- | --- |
| `text` / `textarea` | `maxLength` / `minLength` / `exceedConfigs` |
| `number` | `max` / `min` / `countRuleCheck` / `countRule` |
| `money` | `max` / `min` / `isShowThousandsSeparator` / `hiddenRate` |
| `date` | `withTime` / `specificTime` / `dateTimeType` / `defaultWorkingTime` |
| `dateRange` | 同 `date` 的时间配置 |
| `select` | `multiple` / `selectRange` / `dependence` / `filterId` / `onlyBelongDepartment` / `allowExternalStaff` / `hideCode` / `isShowFullPath` |
| `city` | `multiple` / `hasForbiddenCityGroup` / `cityGroupId` / `cityOptions` |
| `attachments` | `checkDetailInvoiceType` / `detailInvoiceTypes` |
| `details` / `requisitionDetails` | `showType`（LIST）/ `showTypeNew`（TABLE/TABLE_P）/ `orderByType` / `isFeeTypeEmpty` / `feeTypeImportRuleId` / `showDetailNo` / `realtimeCalculateBudget` |
| `dataLink` | `referenceData`（业务对象模板 ID）/ `assignmentRule` / `enableExactSearchAllData` / `subTypeId` |
| `payeeInfo` | `dependence` / `filterRules`（按付款对象过滤） |
| `switcher` | 复用动态配置 `configs`（hide/optional） |
| `corporateExpenseCard` | `eCardOptionalRange`（境内/境外卡种范围） |

### 6.7 特殊控件说明

- **`details` / `requisitionDetails`**：费用明细区，出现在全部报销单（14/14）和 11/14 个申请单中。但它们内部**不再内嵌 components**，明细行里的控件由「费用类型模板」定义（propertySet 中的 `feeTypeForm` / `tripForm` 就是该动态表单），需要另行调用费用类型/行程模板接口；
- **`group` / `annotation` / `separator`**：分别 19 / 19 / 13 个，是纯版式元素（分组标题、说明文字、分隔线），没有 `field`，渲染时可跳过或作为区块标题；
- **`payeeInfo`**：收款信息组合组件，绑定 `payeeId`；
- **`dataLink`**：业务对象选择，`referenceData` 给出业务对象模板 ID（如 `af15be9234f71a3703c0`），与 propertySet 中 `ref.entity` 的后缀一致，可用于二次查询业务对象数据。

> 控件可配置的全部选项（共 84 个配置项，含默认值、显隐、依赖、类型专属配置等）见配套文档：[易快报单据模板字段配置项说明.md](易快报单据模板字段配置项说明.md)。

## 7. 控件与业务字段映射

### 7.1 关联方式

**`component.field` = `propertySet.name`**。本次 150 个去重字段全部在 propertySet 中找到定义（命中率 100%），反向有 256 个 propertySet 字段未出现在这 35 个模板里（多为报表字段、明细行字段、未启用模板的字段）。

### 7.2 控件类型 × 数据类型分布

仅统计绑定字段的 697 个控件；版式元素（`group` / `annotation` / `separator`）无 `field`，不参与统计。

| 控件 `type` | propertySet `dataType` 分布（实例数） |
| --- | --- |
| `attachments` | list ×40 |
| `city` | ref ×6 |
| `corporateExpenseCard` | corporateExpenseCard ×1 |
| `dataLink` | ref ×24 |
| `date` | date ×46 |
| `dateRange` | dateRange ×7 |
| `details` | list ×14 |
| `money` | money ×40 |
| `number` | number ×1 |
| `payeeInfo` | ref ×17 |
| `requisitionDetails` | list ×11 |
| `select` | ref ×273、list ×3 |
| `switcher` | boolean ×5 |
| `text` | text ×168 |
| `textarea` | text ×41 |

结论：

- **存在稳定映射**：`text↔text`、`textarea↔text`、`money↔money`、`number↔number`、`date↔date`、`dateRange↔dateRange`、`switcher↔boolean`、`attachments↔list`、`details/requisitionDetails↔list`；
- **不是一一对应**：同一个 `dataType` 可对应多个控件——`text` 字段可以做单行输入、多行文本，也可以做**说明文字**（annotation 不绑定字段，但可展示文本）；`ref` 字段可以是普通下拉、业务对象选择、城市选择、收款信息；`list` 字段可以是附件、明细表格、多选下拉；
- 因此仅凭 propertySet 的 `dataType` **无法确定控件**，必须读模板的 `component.type`；反之读模板时不读 propertySet 则不知道字段含义与选项来源。

### 7.3 同一字段跨模板使用不同控件（5 个）

| 字段 | 使用控件 |
| --- | --- |
| `title` | text、textarea |
| `u_支出事由` | text、textarea |
| `u_内部备注` | text、textarea |
| `details` | details、requisitionDetails |
| `u_OA文本` | text、textarea |

最典型是 `title`（标题）与 `details`（费用明细）：同一业务字段在不同单据里既可能是单行文本也可能是多行文本，既可能是报销明细也可能是申请明细。

### 7.4 特殊：`select` 绑定 `list` 字段

有 3 处 `select` 控件绑定的是 `list` 类型字段（多选）：

| 模板 | 字段 | 说明 |
| --- | --- | --- |
| 预算调整申请单 | `budgetAdjustDetails` | 预算调整详情（`multiple=true`） |
| 财务资料申请单 | `u_资料申请主体` | 公司主体多选（`multiple=true`） |
| 财务资料申请单 | `u_申请资料类型` | 申请资料类型多选（`multiple=true`） |

## 8. 渲染与接入建议

推荐渲染链路：

1. **选模板**：按 `type` + `active` + `visibility` 过滤出用户可用模板；
2. **遍历控件**：按 `components` 数组顺序，跳过 `group`/`annotation`/`separator` 或作为区块渲染；
3. **控件类型**：`component.type` → 前端组件（第 6.1 节映射）；
4. **字段语义**：`component.field` → 查 propertySet 拿 `label / dataType / ability / canAsDimension`；
5. **选项来源**：`ref` 字段按 `dataType.entity` 调维度/枚举/员工/业务对象接口；`select` 的 `filterId`、`dependence` 决定过滤与联动；
6. **初始值**：执行 `defaultValue`（formula 需表达式引擎；constant 直接取；sum 汇总明细）；
7. **动态规则**：执行 `components[].configs` 的 formula 得到 hide/optional 等运行时属性；
8. **权限**：结合模板 `visibility` 与控件 `hideVisibility`/`hideBlacklistVisibility` 判断可见性；
9. **提交数据**：表单数据以 `component.field` 为 key 写入 formData；
10. **明细行**：`details`/`requisitionDetails` 需要再拉费用类型模板（`feeTypeForm`）才能渲染明细字段。

其它注意点：

- **停用模板**：7 个 `active=false` 的模板不应出现在新建单据的可选列表里；
- **版本与缓存**：模板有 `version`/`dbVersion`/`grayver`（本次 `9.167.0.0-prd`）与 `updateTime`，建议按 `specificationId + version` 缓存控件 schema，变更时失效；
- **表达式引擎**：`defaultValue.formula` 与 `configs[].formula` 使用易快报表达式（``$字段``、函数 `to_Str`/`day_diff`/`if`），跨平台复用时需要实现子集或降级为可空；
- **配置分散**：模板级 `configs`（能力配置）与控件级 `configs`（动态属性）同名不同义，解析时要区分层级；
- **规则 `rules`**：本次仅 5 个模板各有 1 条 `{code:"11", field:"u_合思提单判断", standard:true}`，属于合规/风控规则，渲染时通常不需要处理，但提交流程可能需要；
- **无分页**：接口一次返回全部模板（约 877 KB），大租户可能更大，建议服务端缓存后供前端按需取单个模板。

## 9. 附录

### 9.1 模板 ID 与标识一览（35 个）

| 分组 | 模板名 | 模板 ID | 英文名 | 需更新模板 |
| --- | --- | --- | --- | --- |
| 预算调整（系统） | 摊销明细确认单 | `ID01TxgE3fhD6n` | Amortization Detail Confirmation Form | — |
| 预算调整（系统） | 待摊合同确认单 | `ID01TsEGrzAcdF` | Prepaid/Deferred Contract Confirmation Form | — |
| 预算调整（系统） | 预算调整申请单 | `ID01PH4Q5CJboX:system:预算调整申请单` | Budget Adjustment Application Form | 否 |
| 个人费用 | 差旅费和市内交通费快速报销单「测试」 | `ID01W4NWgo2pFt` | Quick Reimbursement Form for Travel and Local Transportation Expenses(duplicate) | 是 |
| 个人费用 | 历史借款导入 | `ID01VIkJABdTUr` | — | — |
| 个人费用 | 个人费用报销单-测试 | `ID01T3K2IwTdVB` | — | — |
| 个人费用 | 差旅费和市内交通费快速报销单 | `ID01ScMGoP2qNV` | Quick Reimbursement Form for Travel and Local Transportation Expenses | 是 |
| 个人费用 | 差旅费和市内交通费快速报销单（暂弃） | `ID01S7TAR2zSY7` | — | — |
| 个人费用 | 个人借款单 | `ID01PIc4maYdHh` | Personal Loan Form | 是 |
| 个人费用 | 个人费用报销单 | `ID01PIc4maYdaf` | Personal Expense Reimbursement Form | 是 |
| 个人费用 | 快速报销单（自动生成）（暂弃） | `ID01PIc4maYcTJ` | — | — |
| 部门费用 | 资金调拨明细单（外币） | `ID01XOL7LES6Sz` | Fund Transfer Detail Sheet (Auto-generated)(duplicate) | — |
| 部门费用 | 资金调拨单「多币种」 | `ID01Xlu0sxibkr` | Fund Transfer Voucher (Multi-currency) | — |
| 部门费用 | 支付退票申请单 | `ID01XltgiPKukv` |  Payment Return/Rejection Application Form | 是 |
| 部门费用 | 资金调拨明细单（自动付款） | `ID01WCRy6izJvx` | Fund Transfer Detail Sheet (Automatic Payment) | 是 |
| 部门费用 | 内部付款申请单 | `ID01RUrd8JhueH` | Internal Payment Application Form | 是 |
| 部门费用 | 资金调拨明细单（自动生成） | `ID01RUq5zrhZTh` | Fund Transfer Detail Sheet (Auto-generated) | — |
| 部门费用 | 资金调拨单 | `ID01RU9sdQnnGv` |  Fund Transfer Voucher | — |
| 部门费用 | 付款申请单（自动生成） | `ID01RU8VFXPHiv` | Payment Application (Auto-Generated) | — |
| 部门费用 | 先款后票核销单 | `ID01RU8tUYeHMP` | Prepayment First Invoice Write-Off Slip | 是 |
| 部门费用 | 付款申请单（先款后票） | `ID01RU7A2ehTdB` | Payment Application (Prepayment First) | 是 |
| 部门费用 | 付款申请单（已有发票） | `ID01PIc4maYdqL` | Payment Application Form (With Invoice) | 是 |
| 申请事项 | 二手车销售统一发票「自动开票」 | `ID01WyHYmqTXj1` | Unified Invoice for Used Car Sales | 是 |
| 申请事项 | 发票申请单「自动开票」 | `ID01Wx91ZV2HD1` | Invoice Application Form | 是 |
| 申请事项 | 国际易商卡额度申请 | `ID01VXeCvJAHTh` | International Business Card Credit Limit Application | 是 |
| 申请事项 | 激励码申请单 | `ID01VwRGzzWcA7` | Incentive Code Application Form | — |
| 申请事项 | 测试-项目预算申请单 | `ID01UVyMEwYmg7` | — | — |
| 申请事项 | 预提申请单 | `ID01RW7SgAdEVp` | Accrual Application Form | — |
| 申请事项 | 项目预算申请单 | `ID01RUsg8sHQar` | Project Budget Application Form | — |
| 申请事项 | 采购申请单（自动生成） | `ID01RUrV3EGRcj` | Purchase Requisition (Auto-generated) | — |
| 申请事项 | 发票申请单 | `ID01RUsa8zODVl` | In Application Form  | — |
| 申请事项 | 支付本地账号申请 | `ID01RUrTaWfxJJ` |  Local Payment Account Application | 是 |
| 申请事项 | 财务资料申请单 | `ID01PH4Q5CJboX:PRESET_REQUISITION_TRIP` | Financial Information Application Form | — |
| 申请事项 | 银行账号申请 | `ID01PH4Q5CJboX:PRESET_REQUISITION_TEAM_BUILDING` | Bank Account Application | — |
| 申请事项 | 备用金申请 | `ID01PIc4maYdXN` | — | — |

### 9.2 被模板绑定的业务字段（150 个）

按使用模板数降序排列；「控件」列为该字段在全部模板中出现过的控件类型。

| 字段 `field` | 中文名 | dataType | 引用实体（ref） | 使用模板数 | 控件类型 |
| --- | --- | --- | --- | --- | --- |
| submitterId | 提交人 | ref | organization.Staff | 35 | select |
| title | 标题 | text | — | 35 | text、textarea |
| u_内部备注 | 内部备注 | text | — | 29 | text、textarea |
| attachments | 附件 | list | — | 27 | attachments |
| 法人实体 | 法人实体 | ref | basedata.Dimension.法人实体 | 25 | select |
| details | 费用明细 | list | — | 25 | details、requisitionDetails |
| u_申请人部门 | 申请人部门 | ref | organization.Department | 22 | select |
| u_支出事由 | 支出事由 | text | — | 21 | text、textarea |
| u_OA文本 | OA文本 | text | — | 20 | text、textarea |
| u_申请人成本中心 | 申请人成本中心 | ref | basedata.Dimension.成本中心 | 18 | select |
| payeeId | 收款信息 | ref | pay.PayeeInfo | 17 | payeeInfo |
| u_直接上级 | 直接上级 | ref | organization.Staff | 15 | select |
| expenseDate | 报销日期 | date | — | 14 | date |
| legalEntityMultiCurrency | 法人实体多币种 | ref | basedata.Dimension.法人实体 | 14 | select |
| requisitionDate | 申请日期 | date | — | 14 | date |
| u_付款金额 | 付款金额 | money | — | 13 | money |
| u_银行回单 | 银行回单 | list | — | 12 | attachments |
| u_摘要 | 摘要 | text | — | 12 | text |
| u_关联合同流程 | 关联合同流程 | ref | datalink.DataLinkEntity.af15be9234f71a3703c0 | 10 | dataLink |
| u_凭证摘要 | 凭证摘要 | text | — | 10 | text |
| u_供应商名称 | 供应商名称 | text | — | 9 | text |
| u_是否含纸质票据 | 是否含纸质票据 | ref | basedata.Dimension.是否 | 9 | select |
| u_是否境外付款 | 是否境外付款 | ref | basedata.Dimension.是否 | 9 | select |
| u_二级领导 | 二级上级 | ref | organization.Staff | 8 | select |
| u_供应商编码 | 供应商编码 | text | — | 8 | text |
| u_关联供应商 | 关联供应商 | ref | datalink.DataLinkEntity.fc15be911db53f66d3c0 | 8 | dataLink |
| u_申请人归属公司 | 申请人归属公司 | ref | basedata.Dimension.法人实体 | 8 | select |
| u_预计付款日期 | 预计付款日期 | date | — | 7 | date |
| u_常驻地 | 常驻地 | ref | basedata.city | 6 | city |
| u_发票金额 | 发票金额 | money | — | 6 | money |
| u_开户类型 | 开户类型 | ref | basedata.Dimension.银行账号开户类型 | 6 | select |
| u_实际报销人 | 实际报销人 | ref | organization.Staff | 6 | select |
| u_是否签署合同 | 是否签署合同 | ref | basedata.Dimension.是否 | 6 | select |
| u_受益期间 | 受益期间 | dateRange | — | 6 | dateRange |
| u_系统来源 | 系统来源 | ref | basedata.Dimension.系统来源 | 6 | select |
| loanMoney | 借款金额 | money | — | 5 | money |
| u_成本中心 | 成本中心 | ref | basedata.Dimension.成本中心 | 5 | select |
| u_合思提单判断 | 合思提单判断 | boolean | — | 5 | switcher |
| u_合同编码 | 合同编码 | text | — | 5 | text |
| u_是否付款 | 是否付款 | ref | basedata.Dimension.是否 | 5 | select |
| u_是否必须有票 | 是否必须有票 | ref | basedata.Dimension.是否 | 4 | select |
| u_是否质检指定的成本中心 | 是否质检指定的成本中心 | ref | basedata.Dimension.是否 | 4 | select |
| u_特殊标签 | 特殊标签 | ref | basedata.Dimension.特殊标签 | 4 | select |
| u_资金属性 | 资金属性 | ref | basedata.Dimension.资金属性 | 4 | select |
| loanDate | 借款日期 | date | — | 3 | date |
| loanDepartment | 借款部门 | ref | organization.Department | 3 | select |
| payMoney | 支付金额 | money | — | 3 | money |
| requisitionMoney | 申请金额 | money | — | 3 | money |
| u_调出银行账号 | 调出银行账号 | ref | basedata.Dimension.调出银行账号 | 3 | select |
| u_票和款差额 | 票和款差额 | money | — | 3 | money |
| u_资金调拨原始单号 | 资金调拨原始单号 | text | — | 3 | text |
| u_资金调入公司 | 资金调入公司 | ref | basedata.Dimension.法人实体 | 3 | select |
| u_资金用途 | 资金用途 | ref | basedata.Dimension.资金用途 | 3 | select |
| description | 描述 | text | — | 2 | textarea |
| expenseLink | 关联申请 | ref | requisition.RequisitionInfo | 2 | select |
| u_地址 | 地址 | text | — | 2 | text |
| u_电话 | 电话 | text | — | 2 | text |
| u_发票备注栏 | 发票备注栏 | text | — | 2 | text |
| u_红冲类型 | 红冲类型 | ref | basedata.Dimension.红冲类型 | 2 | select |
| u_红冲原因 | 红冲原因 | ref | basedata.Dimension.红冲原因 | 2 | select |
| u_借款类型 | 借款类型 | ref | basedata.Dimension.借款类型 | 2 | select |
| u_开户行 | 开户行 | text | — | 2 | text |
| u_开票方税号 | 开票方税号 | text | — | 2 | text |
| u_开票公司名称 | 开票公司名称 | text | — | 2 | text |
| u_开票公司主体名称 | 开票公司主体名称 | ref | basedata.Dimension.法人实体 | 2 | select |
| u_开票类型 | 开票类型 | ref | basedata.Dimension.发票类型 | 2 | select |
| u_开票台账 | 开票台账 | ref | datalink.DataLinkEntity.b916a54e6f55a6f3c3c0 | 2 | dataLink |
| u_模板类型 | 模板类型 | ref | basedata.Dimension.模板类型 | 2 | select |
| u_实际报销人部门 | 实际报销人部门 | ref | organization.Department | 2 | select |
| u_是否代报销 | 是否代报销 | ref | basedata.Dimension.是否 | 2 | select |
| u_是否红冲 | 是否红冲 | ref | basedata.Dimension.是否 | 2 | select |
| u_是否涉及集团内部公司 | 是否涉及集团内部公司 | ref | basedata.Dimension.是否 | 2 | select |
| u_是否线下开票 | 是否线下开票 | ref | basedata.Dimension.是否 | 2 | select |
| u_收票方地址 |  收票方地址 | text | — | 2 | text |
| u_收票方电话 |  收票方电话 | text | — | 2 | text |
| u_收票方开户行 | 收票方开户行 | text | — | 2 | text |
| u_收票方名称 | 收票方名称 | text | — | 2 | text |
| u_收票方税号 | 收票方税号 | text | — | 2 | text |
| u_收票方银行账号 | 收票方银行账号 | text | — | 2 | text |
| u_收票方主体名称 | 收票方主体名称 | ref | basedata.Dimension.法人实体 | 2 | select |
| u_收票邮箱 | 收票邮箱 | text | — | 2 | text |
| u_外部单据编号 | 外部单据编号 | text | — | 2 | text |
| u_项目预算申请金额 | 项目预算申请金额 | money | — | 2 | money |
| u_银行账号币种 | 银行账号币种 | ref | basedata.Dimension.开户币种 | 2 | select |
| u_预算部门 | 预算部门 | ref | basedata.Dimension.预算部门 | 2 | select |
| u_预算部门编码 | 预算部门编码 | text | — | 2 | text |
| u_预算范围 | 预算范围 | ref | basedata.Dimension.预算范围 | 2 | select |
| u_原开票申请流程号 | 原开票申请流程号 | text | — | 2 | text |
| u_账号 | 账号 | text | — | 2 | text |
| afterAdjustAmount | 调整后总金额 | money | — | 1 | money |
| beforeAdjustAmount | 调整前总金额 | money | — | 1 | money |
| budgetAdjustDetails | 预算调整详情 | list | — | 1 | select |
| corporateExpenseCardForm | 申请易商卡线下消费 | corporateExpenseCard | — | 1 | corporateExpenseCard |
| expenseDepartment | 费用承担部门 | ref | organization.Department | 1 | select |
| feeDatePeriod | 消费起止日期 | dateRange | — | 1 | dateRange |
| repaymentDate | 还款日期 | date | — | 1 | date |
| submitDate | 提交日期 | date | — | 1 | date |
| u_办结时间 | 办结时间 | date | — | 1 | date |
| u_财务资料 | 财务资料 | ref | basedata.Dimension.申请资料类型 | 1 | select |
| u_调整金额 | 调整金额 | money | — | 1 | money |
| u_发起时间 | 发起时间 | date | — | 1 | date |
| u_付款条件 | 付款条件 | text | — | 1 | text |
| u_购买方地址 |  购买方地址 | text | — | 1 | text |
| u_购买方电话 | 购买方电话 | text | — | 1 | text |
| u_购买方国籍 | 购买方国籍 | text | — | 1 | text |
| u_购买方类型 | 购买方类型 | ref | basedata.Dimension.购买方类型 | 1 | select |
| u_购买方证件号码 | 购买方证件号码 | text | — | 1 | text |
| u_购买方证件类型 | 购买方证件类型 | text | — | 1 | text |
| u_购买人名称 | 购买人名称 | text | — | 1 | text |
| u_关联先款流程 | 关联先款流程 | ref | datalink.DataLinkEntity.f115c692626825e38bc0 | 1 | dataLink |
| u_关联项目预算 | 关联项目预算 | ref | datalink.DataLinkEntity.c015c695f0dd406e0fc0 | 1 | dataLink |
| u_关联直线摊销 | 关联直线摊销 | ref | datalink.DataLinkEntity.e416248e37f157934fc0 | 1 | dataLink |
| u_合同编号 | 合同编号 | text | — | 1 | text |
| u_合同金额 | 合同金额 | money | — | 1 | money |
| u_合同类别 | 合同类别 | ref | basedata.Dimension.合同类别 | 1 | select |
| u_合同名称 | 合同名称 | text | — | 1 | text |
| u_结束时间 | 结束时间 | date | — | 1 | date |
| u_开户名称 | 开户名称 | text | — | 1 | text |
| u_开户主体 | 开户主体 | ref | basedata.Dimension.法人实体 | 1 | select |
| u_开票单据模板 | 开票单据模板 | ref | basedata.Dimension.单据模板 | 1 | select |
| u_开票方向 | 开票方向 | ref | basedata.Dimension.开票方向 | 1 | select |
| u_开始时间 | 开始时间 | date | — | 1 | date |
| u_联行号 | 联行号 | text | — | 1 | text |
| u_上游系统来源 | 上游系统来源 | text | — | 1 | text |
| u_上游系统审批状态 | 上游系统审批状态 | text | — | 1 | text |
| u_申请事由 | 申请事由 | text | — | 1 | text |
| u_申请资料类型 | 申请资料类型 | list | — | 1 | select |
| u_实际报销人成本中心 | 实际报销人成本中心 | ref | basedata.Dimension.成本中心 | 1 | select |
| u_使用权摊销明细 | 使用权摊销明细 | ref | datalink.DataLinkEntity.e816139ba5e1cd4ae3c0 | 1 | dataLink |
| u_是否采货侠 | 是否采货侠 | ref | basedata.Dimension.是否 | 1 | select |
| u_是否借款 | 是否借款 | ref | basedata.Dimension.是否 | 1 | select |
| u_摊销方式 |  摊销方式 | ref | basedata.Dimension.摊销方式 | 1 | select |
| u_跳转链接 | 跳转链接 | text | — | 1 | text |
| u_退票回单 | 退票回单 | list | — | 1 | attachments |
| u_退票日期 | 退票日期 | date | — | 1 | date |
| u_退票收款账号 | 退票收款账号 | text | — | 1 | text |
| u_项目名称 | 项目名称 | text | — | 1 | text |
| u_银行科目 | 银行科目 | ref | basedata.Dimension.开户银行科目 | 1 | select |
| u_银行账号 | 银行账号 | text | — | 1 | text |
| u_银行账号申请类型 | 银行账号申请类型 | ref | basedata.Dimension.银行账号申请类型 | 1 | select |
| u_预付费用类型 | 预付费用类型 | ref | basedata.Dimension.预付费用类型 | 1 | select |
| u_预付费用类型个数 | 预付费用类型个数 | money | — | 1 | money |
| u_预提归属日期 | 预提归属日期 | date | — | 1 | date |
| u_原付款单号 | 原付款单号 | text | — | 1 | text |
| u_账号简述 | 账号简述 | text | — | 1 | text |
| u_注销账户 | 注销账户 | ref | basedata.Dimension.调出银行账号 | 1 | select |
| u_注销主体 | 注销主体 | ref | basedata.Dimension.法人实体 | 1 | select |
| u_资料申请主体 | 资料申请主体 | list | — | 1 | select |
| u_总天数 | 总天数 | number | — | 1 | number |
| u_SRM发票类型 | SRM发票类型 | text | — | 1 | text |

---

> 本文统计均由该次响应实时计算；模板/控件数据随租户配置变化，重新抓取后可能不同。

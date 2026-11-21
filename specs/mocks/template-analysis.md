# 易快报单据模板分析（generated）

来源：`specificationGroups` 接口（corpId=`ID01PH4Q5CJboX`），原始响应见 [specificationGroups.raw.json](specificationGroups.raw.json)。
由 [analyze_specification.py](analyze_specification.py) 生成，用于评估「现有 nada-designer 能否做出同样的表单」。

## 总览

- 模板分组：4；单据模板：35（启用 28 / 停用 7）
- 控件实例：748；绑定业务字段的控件：697
- 含"费用明细"（details/requisitionDetails）的模板：25 个
- 控件可映射到 nada 现有组件的比例：617/748 = 82.5%
- 全部控件都能映射的模板：2 个

## 控件类型分布

| 控件 type | 实例数 |
|---|---|
| `select` | 276 (36.9%) |
| `text` | 168 (22.5%) |
| `date` | 46 (6.1%) |
| `textarea` | 41 (5.5%) |
| `attachments` | 40 (5.3%) |
| `money` | 40 (5.3%) |
| `dataLink` | 24 (3.2%) |
| `annotation` | 19 (2.5%) |
| `group` | 19 (2.5%) |
| `payeeInfo` | 17 (2.3%) |
| `details` | 14 (1.9%) |
| `separator` | 13 (1.7%) |
| `requisitionDetails` | 11 (1.5%) |
| `dateRange` | 7 (0.9%) |
| `city` | 6 (0.8%) |
| `switcher` | 5 (0.7%) |
| `number` | 1 (0.1%) |
| `corporateExpenseCard` | 1 (0.1%) |

## 默认值类型分布

| defaultValue.type | 数量 |
|---|---|
| `none` | 392 |
| `predefine` | 130 |
| `formula` | 93 |
| `constant` | 61 |
| `sum` | 21 |

## 控件动态配置 configs

| property | 数量 |
|---|---|
| `hide` | 55 |
| `optional` | 39 |
| `setip` | 4 |

## 模板级 configs（ability）

| ability | 数量 |
|---|---|
| `flow` | 35 |
| `print` | 35 |
| `code` | 35 |
| `voucherPreview` | 32 |
| `habExtend` | 32 |
| `pay` | 22 |
| `manualRepayment` | 17 |
| `writtenOff` | 14 |
| `expense` | 14 |
| `chargeAgainst` | 14 |
| `apply` | 14 |
| `requisition` | 14 |
| `erpVoucher` | 10 |
| `sourceFileTemplate` | 8 |
| `loan` | 5 |
| `publicExpansion` | 4 |
| `allowRepayment` | 2 |

## 控件类型 → nada 组件映射

| 控件 type | nada 组件 | 说明 |
|---|---|---|
| `text` | input | 单行文本 |
| `textarea` | textarea | 多行文本 |
| `number` | number | 数字 |
| `money` | number | 金额（需预设金额 props） |
| `date` | date | 日期 |
| `select` | select | 下拉；选项需数据源 |
| `switcher` | switch | 开关 |
| `attachments` | upload-file/upload-image | 附件上传 |
| `group` | ❌ 不支持 | 版式：分组标题（需布局组件） |
| `annotation` | ❌ 不支持 | 版式：说明文字（需布局组件） |
| `separator` | ❌ 不支持 | 版式：分隔线（需布局组件） |
| `dateRange` | ❌ 不支持 | 日期区间：无对应组件 |
| `city` | ❌ 不支持 | 城市选择：无对应组件 |
| `dataLink` | ❌ 不支持 | 业务对象选择器：无对应组件 |
| `payeeInfo` | ❌ 不支持 | 收款信息组合组件：无对应组件 |
| `details` | ❌ 不支持 | 费用明细表格：不支持明细 |
| `requisitionDetails` | ❌ 不支持 | 费用明细表格（申请单）：不支持明细 |
| `corporateExpenseCard` | ❌ 不支持 | 易商卡组件：无对应组件 |

## 不支持的控件实例

| 控件 type | 实例数 |
|---|---|
| `dataLink` | 24 |
| `annotation` | 19 |
| `group` | 19 |
| `payeeInfo` | 17 |
| `details` | 14 |
| `separator` | 13 |
| `requisitionDetails` | 11 |
| `dateRange` | 7 |
| `city` | 6 |
| `corporateExpenseCard` | 1 |

## 各模板控件数 / 可映射比例

| 模板 | 分组 | 类型 | 状态 | 控件数 | 可映射 | 比例 | 含明细 |
|---|---|---|---|---|---|---|---|
| 二手车销售统一发票「自动开票」 | 申请事项 | requisition | 启用 | 50 | 41 | 82.0% | 有 |
| 付款申请单（自动生成） | 部门费用 | expense | 启用 | 42 | 35 | 83.3% | 有 |
| 付款申请单（已有发票） | 部门费用 | expense | 启用 | 40 | 32 | 80.0% | 有 |
| 发票申请单「自动开票」 | 申请事项 | requisition | 启用 | 40 | 32 | 80.0% | 有 |
| 付款申请单（先款后票） | 部门费用 | expense | 启用 | 39 | 32 | 82.1% | 有 |
| 先款后票核销单 | 部门费用 | expense | 启用 | 35 | 27 | 77.1% | 有 |
| 个人费用报销单 | 个人费用 | expense | 启用 | 34 | 28 | 82.4% | 有 |
| 内部付款申请单 | 部门费用 | expense | 启用 | 34 | 27 | 79.4% | 有 |
| 个人费用报销单-测试 | 个人费用 | expense | 停用 | 30 | 25 | 83.3% | 有 |
| 差旅费和市内交通费快速报销单 | 个人费用 | expense | 启用 | 28 | 23 | 82.1% | 有 |
| 差旅费和市内交通费快速报销单「测试」 | 个人费用 | expense | 启用 | 27 | 22 | 81.5% | 有 |
| 个人借款单 | 个人费用 | loan | 启用 | 25 | 22 | 88.0% | — |
| 摊销明细确认单 | 预算调整（系统） | expense | 启用 | 20 | 13 | 65.0% | 有 |
| 待摊合同确认单 | 预算调整（系统） | requisition | 启用 | 20 | 17 | 85.0% | 有 |
| 支付退票申请单 | 部门费用 | expense | 启用 | 19 | 15 | 78.9% | 有 |
| 预提申请单 | 申请事项 | requisition | 启用 | 19 | 14 | 73.7% | 有 |
| 项目预算申请单 | 申请事项 | requisition | 启用 | 18 | 16 | 88.9% | 有 |
| 银行账号申请 | 申请事项 | requisition | 启用 | 18 | 17 | 94.4% | — |
| 资金调拨明细单（外币） | 部门费用 | payment | 启用 | 17 | 16 | 94.1% | — |
| 资金调拨明细单（自动生成） | 部门费用 | payment | 启用 | 17 | 16 | 94.1% | — |
| 快速报销单（自动生成）（暂弃） | 个人费用 | expense | 停用 | 16 | 12 | 75.0% | 有 |
| 资金调拨明细单（自动付款） | 部门费用 | payment | 启用 | 16 | 15 | 93.8% | — |
| 测试-项目预算申请单 | 申请事项 | requisition | 停用 | 16 | 14 | 87.5% | 有 |
| 差旅费和市内交通费快速报销单（暂弃） | 个人费用 | requisition | 停用 | 15 | 11 | 73.3% | 有 |
| 采购申请单（自动生成） | 申请事项 | requisition | 启用 | 15 | 13 | 86.7% | 有 |
| 财务资料申请单 | 申请事项 | requisition | 启用 | 14 | 14 | 100.0% | — |
| 发票申请单 | 申请事项 | requisition | 启用 | 11 | 9 | 81.8% | 有 |
| 备用金申请 | 申请事项 | loan | 停用 | 11 | 7 | 63.6% | — |
| 国际易商卡额度申请 | 申请事项 | requisition | 启用 | 10 | 8 | 80.0% | — |
| 激励码申请单 | 申请事项 | requisition | 启用 | 10 | 8 | 80.0% | 有 |
| 支付本地账号申请 | 申请事项 | requisition | 启用 | 10 | 9 | 90.0% | 有 |
| 资金调拨单「多币种」 | 部门费用 | expense | 停用 | 9 | 7 | 77.8% | 有 |
| 预算调整申请单 | 预算调整（系统） | custom | 启用 | 8 | 7 | 87.5% | — |
| 资金调拨单 | 部门费用 | expense | 启用 | 8 | 6 | 75.0% | 有 |
| 历史借款导入 | 个人费用 | loan | 停用 | 7 | 7 | 100.0% | — |

## 结论：现有设计器能否做出同样的表单？

**不能 1:1 复刻，但可以做出"静态字段表单"的骨架。** 具体差距：

### 已经能覆盖（v1 受控模式范围）
- `text` / `textarea` / `number` / `money` / `date` / `select` / `switcher` / `attachments`
- 必填、默认值（常量）、占位、隐藏/可编辑、长度与数值范围
- 表单项的纵向排列（form 根容器）

### 需要补齐才能接近
| 能力 | 现状 | 影响 |
|---|---|---|
| **费用明细表格**（details/requisitionDetails） | 不支持明细 | 25/35 个模板有明细，报销单核心区域 |
| **业务对象选择器**（dataLink） | 无对应组件 | 大量自定义字段依赖 |
| **日期区间 / 城市选择 / 收款信息 / 易商卡** | 无对应组件 | 差旅类字段 |
| **版式元素**（group/annotation/separator） | 缺分组标题/说明/分隔线组件 | 表单视觉结构 |
| **默认值：formula/sum** | 只支持常量 | 大量自动计算字段 |
| **动态规则**（configs: hide/optional） | 不支持 | 条件显隐/必填 |
| **联动与过滤**（dependence/filterId） | 不支持 | 选择器过滤、带出 |
| **权限可见性**（visibility/hideVisibility） | 不支持 | 按人/角色/部门控制 |
| **模板级配置**（流程/打印/编码/核销…） | 不属于设计器渲染层 | 平台能力 |

### 分阶段建议
1. **P1–P2（当前计划）**：静态字段表单 + 受控字段清单，可覆盖约 82% 的控件实例；
2. **P3**：补版式元素（分组标题/说明/分隔线）与 select 数据源；
3. **P4**：补明细表格（作为独立"明细区块"组件，绑定另一个业务对象/模板）；
4. **P5**：公式默认值、动态显隐/必填、联动过滤、权限可见性。

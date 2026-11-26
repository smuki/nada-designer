# 业务字段 Mock 数据

来源：易快报 propertySet 接口（corpId=`ID01PH4Q5CJboX`），原始响应见 [propertySet.raw.json](propertySet.raw.json)。
由 [build_mock.py](build_mock.py) 按规格书 `specs/controlled-mode.md` §6.3 精简生成。

## 文件

| 文件 | 说明 |
|---|---|
| `propertySet.raw.json` | 接口原始响应（未改动） |
| `field-meta.mock.json` | 全量精简后的 Property（含 skipped 明细与统计） |
| `field-meta.demo.json` | 报销单常用字段子集（约 30 个），用于快速验证 |
| `build_mock.py` | 字段转换脚本，可重跑 |
| `specificationGroups.raw.json` | 单据模板接口原始响应（35 个模板 / 748 个控件） |
| `template-analysis.md` | 模板分析：控件分布、能力映射、能否复刻的结论 |
| `template.demo.json` | 代表性模板「个人费用报销单」精简控件列表 |
| `template-map.json` | 控件 type → nada 组件映射与不支持清单 |
| `analyze_specification.py` | 模板分析脚本，可重跑 |
| `gen_static_form_fixture.py` | 为 35 个模板生成 examples 静态字段表单示例（菜单「例子」） |

## 转换规则

- 保留：`field`（= name）、`label`、`type`、`scale`、`unit`、`entity`、`group`（= ability，空则「其他」）、`active`
- 类型映射：`text / number / money / date / boolean / ref`；`list / dateRange / dynamic / 专用类型` 暂不支持，进入 `skipped`
- 字符集：按规格书要求只保留 `中文/字母/数字/下划线` 的字段名；含中划线、括号、空格等的字段进入 `skipped`
- 名称/标签做 trim

## 统计

- 原始字段：406
- 可用字段：361；跳过：45
- 分组数：24

### 类型分布

| 类型 | 数量 |
|---|---|
| `ref` | 142 |
| `text` | 108 |
| `money` | 51 |
| `date` | 29 |
| `number` | 18 |
| `boolean` | 13 |

### 跳过原因

| 原因 | 数量 |
|---|---|
| unsupported dataType | 44 |
| invalid charset (特殊字符/中划线等) | 1 |

### 分组 Top 20

| 分组 | 数量 |
|---|---|
| `自定义字段` | 225 |
| `系统字段` | 24 |
| `单据信息` | 19 |
| `支付信息` | 14 |
| `费用明细` | 11 |
| `摊销信息` | 8 |
| `打印信息` | 7 |
| `借款信息` | 6 |
| `申请信息` | 6 |
| `行程信息` | 6 |
| `合同结算` | 6 |
| `报销信息` | 5 |
| `预置维度` | 4 |
| `ERP 凭证` | 4 |
| `分摊信息` | 3 |
| `收款信息` | 2 |
| `业务对象` | 2 |
| `发票信息` | 2 |
| `预算信息` | 2 |
| `报账信息` | 1 |

> 注意：仅 1 个字段名（`u_借款统计(系统)`，含括号）不符合字符集规则被跳过；部分 label 含前导/尾随空格，已做 trim。
> 若业务要求保留括号等特殊字符，需要回头调整字符集规则（见规格书 §7.3）或由后端做字段名规范化。

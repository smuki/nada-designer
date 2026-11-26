"""
将易快报 propertySet 原始响应整理为 nada-designer 受控模式的 mock 数据。

输入：propertySet.raw.json（原始接口响应，已随仓库保存）
输出：
  property.mock.json   按规格书 6.3 精简后的 Property 列表（含统计与被跳过项）
  property.demo.json   用于快速验证设计器的一组报销单常用字段
  README.md              说明与统计

运行：python build_mock.py
"""
import json
import os
import re
import sys
from collections import Counter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BASE_DIR, "propertySet.raw.json")

# 规格书 7.3：中文/字母/数字/下划线；禁止中划线及其他特殊字符
FIELD_RE = re.compile(r"^[\u4e00-\u9fa5A-Za-z_][\u4e00-\u9fa5A-Za-z0-9_]*$")

SUPPORTED = {"text", "number", "money", "date", "boolean", "ref"}
TYPE_MAP = {
    "text": "text",
    "number": "number",
    "money": "money",
    "date": "date",
    "boolean": "boolean",
    "ref": "ref",
}

# 快速验证用：报销单常用字段（按 name 选取）
DEMO_NAMES = [
    "code", "title", "submitterId", "submitDate", "expenseDepartment",
    "expenseMoney", "expenseDate", "description", "consumptionReasons",
    "payMoney", "paymentChannel", "paymentAccountId", "payDate",
    "payerId", "payeeId", "writtenOffMoney", "settlementMoney",
    "receiptMoney", "reconciliationMoney", "taxRate", "taxAmount",
    "noTaxAmount", "法人实体", "项目", "品类", "u_合同金额",
    "u_合同编号", "u_总天数", "u_是否借款", "u_申请事由",
]

# ability → 中文分组名（参考易快报文档）
ABILITY_GROUP = {
    "flow": "单据信息",
    "feeDetail": "费用明细",
    "expense": "报销信息",
    "requisition": "申请信息",
    "loan": "借款信息",
    "loanInfo": "借款信息",
    "pay": "支付信息",
    "receipt": "收款信息",
    "settlement": "结算信息",
    "reconciliation": "对账信息",
    "writtenOff": "核销信息",
    "apportion": "分摊信息",
    "amortize": "摊销信息",
    "trip": "行程信息",
    "apply": "关联申请",
    "dataLink": "业务对象",
    "invoice": "发票信息",
    "contractSettle": "合同结算",
    "budget": "预算信息",
    "erpVoucher": "ERP 凭证",
    "print": "打印信息",
    "permit": "商旅订单",
    "splitCalculation": "拆分计算",
    "reimbursement": "报账信息",
}


def resolve_group(item):
    ability = (item.get("ability") or "").strip()
    if ability and ability in ABILITY_GROUP:
        return ABILITY_GROUP[ability]
    name = item.get("name") or ""
    if name.startswith("u_"):
        return "自定义字段"
    if name.startswith("AI_"):
        return "智能审批"
    if name.startswith("E_system_"):
        return "预置维度"
    if ability:
        return ability
    return "系统字段"



def load_raw():
    with open(RAW, "r", encoding="utf-8") as f:
        data = json.load(f)
    items = data.get("items")
    if not isinstance(items, list):
        sys.exit("raw 文件结构不是 { items: [...] }")
    return items


def convert(item):
    dt = item.get("dataType") or {}
    raw_type = dt.get("type")
    field = item.get("name") or ""
    label = (item.get("label") or "").strip()
    group = resolve_group(item)

    if raw_type not in SUPPORTED:
        return None, {"name": field, "label": label, "reason": f"unsupported dataType: {raw_type}"}
    if not FIELD_RE.match(field):
        return None, {"name": field, "label": label, "reason": "invalid charset (特殊字符/中划线等)"}

    out = {"field": field, "label": label, "type": TYPE_MAP[raw_type]}
    if dt.get("scale") is not None:
        out["scale"] = dt["scale"]
    if dt.get("unit"):
        out["unit"] = dt["unit"]
    if raw_type == "ref":
        if not dt.get("entity"):
            return None, {"name": field, "label": label, "reason": "ref 缺少 entity"}
        out["entity"] = dt["entity"]
    if item.get("active") is False:
        out["active"] = False
    out["group"] = group
    return out, None


def main():
    items = load_raw()
    properties, skipped = [], []
    for item in items:
        field, skip = convert(item)
        if field:
            properties.append(field)
        else:
            skipped.append(skip)

    type_counter = Counter(f["type"] for f in properties)
    group_counter = Counter(f["group"] for f in properties)

    mock = {
        "businessObject": "expense",
        "source": "https://app.ekuaibao.com/api/flow/v2/propertySet?corpId=ID01PH4Q5CJboX",
        "note": "由 build_mock.py 生成；businessObject 为占位值，可替换为真实业务对象标识",
        "stats": {
            "total": len(items),
            "supported": len(properties),
            "skipped": len(skipped),
            "byType": dict(sorted(type_counter.items(), key=lambda kv: -kv[1])),
        },
        "properties": properties,
        "skipped": skipped,
    }
    with open(os.path.join(BASE_DIR, "property.mock.json"), "w", encoding="utf-8") as f:
        json.dump(mock, f, ensure_ascii=False, indent=2)

    by_name = {f["field"]: f for f in properties}
    demo = [by_name[n] for n in DEMO_NAMES if n in by_name]
    with open(os.path.join(BASE_DIR, "property.demo.json"), "w", encoding="utf-8") as f:
        json.dump(
            {
                "businessObject": "expense",
                "note": "报销单常用字段子集，用于快速验证设计器拖拽/属性面板",
                "properties": demo,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )

    # 分组统计（前 20）
    group_lines = "\n".join(
        f"| `{g}` | {c} |" for g, c in group_counter.most_common(20)
    )
    type_lines = "\n".join(
        f"| `{t}` | {c} |" for t, c in type_counter.most_common()
    )
    skip_counter = Counter(s["reason"].split(":")[0] for s in skipped)
    skip_lines = "\n".join(f"| {r} | {c} |" for r, c in skip_counter.most_common())

    readme = f"""# 业务字段 Mock 数据

来源：易快报 propertySet 接口（corpId=`ID01PH4Q5CJboX`），原始响应见 [propertySet.raw.json](propertySet.raw.json)。
由 [build_mock.py](build_mock.py) 按规格书 `specs/controlled-mode.md` §6.3 精简生成。

## 文件

| 文件 | 说明 |
|---|---|
| `propertySet.raw.json` | 接口原始响应（未改动） |
| `property.mock.json` | 全量精简后的 Property（含 skipped 明细与统计） |
| `property.demo.json` | 报销单常用字段子集（约 {len(demo)} 个），用于快速验证 |
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

- 原始字段：{len(items)}
- 可用字段：{len(properties)}；跳过：{len(skipped)}
- 分组数：{len(group_counter)}

### 类型分布

| 类型 | 数量 |
|---|---|
{type_lines}

### 跳过原因

| 原因 | 数量 |
|---|---|
{skip_lines}

### 分组 Top 20

| 分组 | 数量 |
|---|---|
{group_lines}

> 注意：仅 1 个字段名（`u_借款统计(系统)`，含括号）不符合字符集规则被跳过；部分 label 含前导/尾随空格，已做 trim。
> 若业务要求保留括号等特殊字符，需要回头调整字符集规则（见规格书 §7.3）或由后端做字段名规范化。
"""
    with open(os.path.join(BASE_DIR, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme)

    print(json.dumps(mock["stats"], ensure_ascii=False, indent=2))
    print(f"skipped={len(skipped)} demo={len(demo)} groups={len(group_counter)}")


if __name__ == "__main__":
    main()

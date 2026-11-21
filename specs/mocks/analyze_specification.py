"""
分析易快报单据模板 specificationGroups 原始响应，生成：
  template-analysis.md   模板/控件统计 + 与 nada-designer 的能力对照 + 结论
  template.demo.json     一份代表性模板（个人费用报销单）的精简控件列表
  template-map.json      控件类型 -> nada 组件映射与不支持清单
运行：python analyze_specification.py
"""
import json
import os
from collections import Counter, defaultdict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BASE_DIR, "specificationGroups.raw.json")

# 易快报控件 type -> nada 设计器能力
# value: (nada 组件 type 或 None, 说明)
CONTROL_MAP = {
    "text": ("input", "单行文本"),
    "textarea": ("textarea", "多行文本"),
    "number": ("number", "数字"),
    "money": ("number", "金额（需预设金额 props）"),
    "date": ("date", "日期"),
    "select": ("select", "下拉；选项需数据源"),
    "switcher": ("switch", "开关"),
    "attachments": ("upload-file/upload-image", "附件上传"),
    "group": (None, "版式：分组标题（需布局组件）"),
    "annotation": (None, "版式：说明文字（需布局组件）"),
    "separator": (None, "版式：分隔线（需布局组件）"),
    "dateRange": (None, "日期区间：无对应组件"),
    "city": (None, "城市选择：无对应组件"),
    "dataLink": (None, "业务对象选择器：无对应组件"),
    "payeeInfo": (None, "收款信息组合组件：无对应组件"),
    "details": (None, "费用明细表格：不支持明细"),
    "requisitionDetails": (None, "费用明细表格（申请单）：不支持明细"),
    "corporateExpenseCard": (None, "易商卡组件：无对应组件"),
}


def main():
    with open(RAW, "r", encoding="utf-8") as f:
        data = json.load(f)

    groups = data.get("items") or []
    templates = []
    for g in groups:
        for s in g.get("specifications") or []:
            s["_groupName"] = g.get("name")
            templates.append(s)

    control_counter = Counter()
    default_counter = Counter()
    config_prop_counter = Counter()
    ability_counter = Counter()
    per_template = []
    field_bound = 0
    unsupported_instances = Counter()
    mappable_instances = 0
    total_instances = 0
    templates_with_details = 0
    fully_mappable = 0

    for t in templates:
        comps = t.get("components") or []
        total_instances += len(comps)
        local_types = Counter()
        local_map = 0
        has_details = False
        for c in comps:
            ctype = c.get("type")
            control_counter[ctype] += 1
            local_types[ctype] += 1
            dv = (c.get("defaultValue") or {}).get("type")
            if dv:
                default_counter[dv] += 1
            for cfg in c.get("configs") or []:
                config_prop_counter[cfg.get("property")] += 1
            if c.get("field"):
                field_bound += 1
            mapped, _ = CONTROL_MAP.get(ctype, (None, "未知控件"))
            if mapped:
                mappable_instances += 1
                local_map += 1
            else:
                unsupported_instances[ctype] += 1
            if ctype in ("details", "requisitionDetails"):
                has_details = True
        if has_details:
            templates_with_details += 1
        for cfg in t.get("configs") or []:
            ability_counter[cfg.get("ability")] += 1
        per_template.append(
            {
                "id": t.get("id"),
                "name": t.get("name"),
                "group": t.get("_groupName"),
                "type": t.get("type"),
                "active": t.get("active"),
                "state": t.get("state"),
                "componentCount": len(comps),
                "mappableCount": local_map,
                "mappableRate": round(local_map / len(comps) * 100, 1) if comps else 0,
                "hasDetails": has_details,
                "types": dict(local_types),
            }
        )
        if local_map == len(comps):
            fully_mappable += 1

    # 代表性模板：个人费用报销单
    demo_id = "ID01PIc4maYdaf"
    demo = next((t for t in templates if t.get("id") == demo_id), None)
    demo_out = None
    if demo:
        demo_comps = []
        for c in demo.get("components") or []:
            mapped, note = CONTROL_MAP.get(c.get("type"), (None, "未知控件"))
            dv = c.get("defaultValue") or {}
            demo_comps.append(
                {
                    "label": (c.get("label") or "").strip(),
                    "field": c.get("field"),
                    "type": c.get("type"),
                    "nadaComponent": mapped,
                    "note": note,
                    "optional": c.get("optional"),
                    "editable": c.get("editable"),
                    "hide": c.get("hide"),
                    "readonly": c.get("readonly"),
                    "placeholder": c.get("placeholder"),
                    "defaultValueType": dv.get("type"),
                    "defaultValue": dv.get("value") if dv.get("type") in ("constant", "predefine") else None,
                    "maxLength": c.get("maxLength"),
                    "min": c.get("min"),
                    "max": c.get("max"),
                    "multiple": c.get("multiple"),
                    "configs": [
                        {"property": x.get("property"), "formula": x.get("formula")}
                        for x in (c.get("configs") or [])
                    ],
                    "hasDependence": bool(c.get("dependence")),
                    "filterId": c.get("filterId"),
                }
            )
        demo_out = {
            "id": demo.get("id"),
            "name": demo.get("name"),
            "type": demo.get("type"),
            "active": demo.get("active"),
            "componentCount": len(demo_comps),
            "note": "代表性模板精简版；仅保留与设计器渲染/配置相关的字段",
            "components": demo_comps,
        }

    mapping_out = {
        "controlMap": {
            k: {"nadaComponent": v[0], "note": v[1]} for k, v in CONTROL_MAP.items()
        },
        "unsupportedInstances": dict(unsupported_instances),
    }

    with open(os.path.join(BASE_DIR, "template-map.json"), "w", encoding="utf-8") as f:
        json.dump(mapping_out, f, ensure_ascii=False, indent=2)
    if demo_out:
        with open(os.path.join(BASE_DIR, "template.demo.json"), "w", encoding="utf-8") as f:
            json.dump(demo_out, f, ensure_ascii=False, indent=2)

    # 统计输出
    def rows(counter, total=None):
        out = []
        for k, v in counter.most_common():
            pct = f" ({v / total * 100:.1f}%)" if total else ""
            out.append(f"| `{k}` | {v}{pct} |")
        return "\n".join(out)

    templates_sorted = sorted(per_template, key=lambda x: -x["componentCount"])
    template_rows = "\n".join(
        "| {name} | {group} | {type} | {active} | {n} | {m} | {rate}% | {d} |".format(
            name=t["name"],
            group=t["group"],
            type=t["type"],
            active="启用" if t["active"] else "停用",
            n=t["componentCount"],
            m=t["mappableCount"],
            rate=t["mappableRate"],
            d="有" if t["hasDetails"] else "—",
        )
        for t in templates_sorted
    )

    md = f"""# 易快报单据模板分析（generated）

来源：`specificationGroups` 接口（corpId=`ID01PH4Q5CJboX`），原始响应见 [specificationGroups.raw.json](specificationGroups.raw.json)。
由 [analyze_specification.py](analyze_specification.py) 生成，用于评估「现有 nada-designer 能否做出同样的表单」。

## 总览

- 模板分组：{len(groups)}；单据模板：{len(templates)}（启用 {sum(1 for t in templates if t.get('active'))} / 停用 {sum(1 for t in templates if not t.get('active'))}）
- 控件实例：{total_instances}；绑定业务字段的控件：{field_bound}
- 含"费用明细"（details/requisitionDetails）的模板：{templates_with_details} 个
- 控件可映射到 nada 现有组件的比例：{mappable_instances}/{total_instances} = {mappable_instances / total_instances * 100:.1f}%
- 全部控件都能映射的模板：{fully_mappable} 个

## 控件类型分布

| 控件 type | 实例数 |
|---|---|
{rows(control_counter, total_instances)}

## 默认值类型分布

| defaultValue.type | 数量 |
|---|---|
{rows(default_counter)}

## 控件动态配置 configs

| property | 数量 |
|---|---|
{rows(config_prop_counter)}

## 模板级 configs（ability）

| ability | 数量 |
|---|---|
{rows(ability_counter)}

## 控件类型 → nada 组件映射

| 控件 type | nada 组件 | 说明 |
|---|---|---|
""" + "\n".join(
        f"| `{k}` | {v[0] or '❌ 不支持'} | {v[1]} |" for k, v in CONTROL_MAP.items()
    ) + f"""

## 不支持的控件实例

| 控件 type | 实例数 |
|---|---|
{rows(unsupported_instances)}

## 各模板控件数 / 可映射比例

| 模板 | 分组 | 类型 | 状态 | 控件数 | 可映射 | 比例 | 含明细 |
|---|---|---|---|---|---|---|---|
{template_rows}

## 结论：现有设计器能否做出同样的表单？

**不能 1:1 复刻，但可以做出"静态字段表单"的骨架。** 具体差距：

### 已经能覆盖（v1 受控模式范围）
- `text` / `textarea` / `number` / `money` / `date` / `select` / `switcher` / `attachments`
- 必填、默认值（常量）、占位、隐藏/可编辑、长度与数值范围
- 表单项的纵向排列（form 根容器）

### 需要补齐才能接近
| 能力 | 现状 | 影响 |
|---|---|---|
| **费用明细表格**（details/requisitionDetails） | 不支持明细 | {templates_with_details}/{len(templates)} 个模板有明细，报销单核心区域 |
| **业务对象选择器**（dataLink） | 无对应组件 | 大量自定义字段依赖 |
| **日期区间 / 城市选择 / 收款信息 / 易商卡** | 无对应组件 | 差旅类字段 |
| **版式元素**（group/annotation/separator） | 缺分组标题/说明/分隔线组件 | 表单视觉结构 |
| **默认值：formula/sum** | 只支持常量 | 大量自动计算字段 |
| **动态规则**（configs: hide/optional） | 不支持 | 条件显隐/必填 |
| **联动与过滤**（dependence/filterId） | 不支持 | 选择器过滤、带出 |
| **权限可见性**（visibility/hideVisibility） | 不支持 | 按人/角色/部门控制 |
| **模板级配置**（流程/打印/编码/核销…） | 不属于设计器渲染层 | 平台能力 |

### 分阶段建议
1. **P1–P2（当前计划）**：静态字段表单 + 受控字段清单，可覆盖约 {mappable_instances / total_instances * 100:.0f}% 的控件实例；
2. **P3**：补版式元素（分组标题/说明/分隔线）与 select 数据源；
3. **P4**：补明细表格（作为独立"明细区块"组件，绑定另一个业务对象/模板）；
4. **P5**：公式默认值、动态显隐/必填、联动过滤、权限可见性。
"""
    with open(os.path.join(BASE_DIR, "template-analysis.md"), "w", encoding="utf-8") as f:
        f.write(md)

    print(f"groups={len(groups)} templates={len(templates)} components={total_instances}")
    print(f"mappable={mappable_instances}/{total_instances} ({mappable_instances / total_instances * 100:.1f}%) fully={fully_mappable}")
    print("control types:", dict(control_counter.most_common()))
    print("demo:", demo_out["name"] if demo_out else None, demo_out["componentCount"] if demo_out else 0)


if __name__ == "__main__":
    main()

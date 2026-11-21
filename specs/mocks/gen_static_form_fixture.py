"""
为「易快报」全部单据模板（35 个）生成静态字段表单示例。

输入：
  specs/mocks/specificationGroups.raw.json  模板原始数据
  specs/mocks/field-meta.mock.json          业务字段元数据（取 ref 的 entity）
输出：
  examples/src/views/examples/staticFieldForm/fixtures/*.ts   每个模板一个 fixture
  examples/src/views/examples/staticFieldForm/registry.ts     示例注册表（菜单/路由由它生成）

运行：python gen_static_form_fixture.py
"""
import json
import os
import re
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
OUT_DIR = os.path.join(
    REPO_ROOT, "examples", "src", "views", "examples", "staticFieldForm"
)
FIXTURE_DIR = os.path.join(OUT_DIR, "fixtures")
REGISTRY_FILE = os.path.join(OUT_DIR, "registry.ts")

TYPE_MAP = {
    "input": "input",
    "textarea": "textarea",
    "number": "number",
    "date": "date",
    "select": "select",
    "switch": "switch",
    "upload-file/upload-image": "upload-file",
}

# 易快报控件 type -> nada 能力（与 template-map.json 保持一致）
CONTROL_MAP = {
    "text": "input",
    "textarea": "textarea",
    "number": "number",
    "money": "number",
    "date": "date",
    "select": "select",
    "switcher": "switch",
    "attachments": "upload-file/upload-image",
}

# id 只允许 中文/字母/数字/下划线
ID_RE = re.compile(r"[^\u4e00-\u9fa5A-Za-z0-9_]")


def sanitize(value: str) -> str:
    return ID_RE.sub("_", value or "")


def demo_options(entity):
    if not entity:
        return [{"label": "选项A", "value": "a"}, {"label": "选项B", "value": "b"}]
    if entity.startswith("organization.Staff"):
        return [
            {"label": "张三", "value": "staff_1"},
            {"label": "李四", "value": "staff_2"},
            {"label": "王五", "value": "staff_3"},
        ]
    if entity.startswith("organization.Department"):
        return [
            {"label": "财务部", "value": "dept_1"},
            {"label": "市场部", "value": "dept_2"},
            {"label": "研发部", "value": "dept_3"},
        ]
    if "是否" in entity:
        return [
            {"label": "是", "value": "yes"},
            {"label": "否", "value": "no"},
        ]
    if entity.startswith("basedata.city"):
        return [
            {"label": "北京", "value": "北京"},
            {"label": "上海", "value": "上海"},
            {"label": "广州", "value": "广州"},
        ]
    if entity.startswith("pay.PaymentAccount"):
        return [
            {"label": "基本户", "value": "acc_1"},
            {"label": "一般户", "value": "acc_2"},
        ]
    if entity.startswith("pay.PayeeInfo"):
        return [
            {"label": "收款方A", "value": "payee_1"},
            {"label": "收款方B", "value": "payee_2"},
        ]
    if entity.startswith("basedata.Enum"):
        return [
            {"label": "枚举值A", "value": "enum_a"},
            {"label": "枚举值B", "value": "enum_b"},
        ]
    if entity.startswith("basedata.Dimension"):
        return [
            {"label": "维度值A", "value": "dim_a"},
            {"label": "维度值B", "value": "dim_b"},
        ]
    if entity.startswith("form.Specification"):
        return [
            {"label": "模板A", "value": "spec_a"},
            {"label": "模板B", "value": "spec_b"},
        ]
    return [
        {"label": "选项1", "value": "opt_1"},
        {"label": "选项2", "value": "opt_2"},
    ]


def to_number(value):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def build_node(component, entity, force_visible):
    label = (component.get("label") or "").strip()
    field = component.get("field") or ""
    nada = TYPE_MAP[component["nadaComponent"]]
    hidden = False if force_visible else bool(component.get("hide"))
    props = {}

    if component.get("placeholder"):
        props["placeholder"] = component["placeholder"]
    if nada == "textarea":
        props["rows"] = 3
    if nada == "select":
        props["options"] = demo_options(entity)
        props.setdefault("placeholder", f"请选择{label}")
    if component.get("maxLength") is not None:
        props["maxLength"] = component["maxLength"]
    if component.get("minLength") is not None:
        props["minLength"] = component["minLength"]
    if nada == "number":
        min_value = to_number(component.get("min"))
        max_value = to_number(component.get("max"))
        if min_value is not None:
            props["min"] = min_value
        if max_value is not None:
            props["max"] = max_value
        props.setdefault("placeholder", f"请输入{label}")
    if component.get("editable") is False:
        props["disabled"] = True
    if hidden:
        props["hidden"] = True

    node = {
        "field": field,
        "id": f"field_{sanitize(field)}",
        "input": True,
        "label": label,
        "type": nada,
        "props": props,
    }
    required = (
        component.get("optional") is False
        and component.get("editable") is not False
        and not hidden
    )
    if required:
        node["rules"] = [{"message": f"请填写{label}", "required": True}]
    return node


def build_page_schema(template, entities, force_visible):
    children = []
    for component in template.get("components") or []:
        if component.get("type") not in CONTROL_MAP:
            continue
        if not component.get("field"):
            continue
        component = dict(component)
        component["nadaComponent"] = CONTROL_MAP[component["type"]]
        children.append(
            build_node(component, entities.get(component["field"]), force_visible)
        )
    name = (template.get("name") or "").strip()
    return {
        "canvas": {"mode": "desktop"},
        "schemas": [
            {
                "children": children,
                "id": "root",
                "label": name,
                "props": {
                    "colon": True,
                    "labelAlign": "left",
                    "labelLayout": "fixed",
                    "labelPlacement": "top",
                    "labelWidth": 120,
                    "layout": "vertical",
                    "label-position": "top",
                    "name": "default",
                },
                "type": "form",
            }
        ],
        "script": "",
    }


def dump(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2)


def main():
    with open(
        os.path.join(BASE_DIR, "specificationGroups.raw.json"), "r", encoding="utf-8"
    ) as f:
        data = json.load(f)
    with open(os.path.join(BASE_DIR, "field-meta.mock.json"), "r", encoding="utf-8") as f:
        field_meta = json.load(f)

    entities = {item["field"]: item.get("entity") for item in field_meta["fields"]}

    templates = []
    for group in data.get("items") or []:
        for spec in group.get("specifications") or []:
            templates.append((group, spec))

    if os.path.isdir(FIXTURE_DIR):
        shutil.rmtree(FIXTURE_DIR)
    os.makedirs(FIXTURE_DIR, exist_ok=True)

    entries = []
    for index, (group, template) in enumerate(templates, start=1):
        key = f"example_{index:02d}"
        name = (template.get("name") or "").strip()
        components = template.get("components") or []
        mapped = [c for c in components if c.get("type") in CONTROL_MAP and c.get("field")]
        skipped_types = sorted(
            {c.get("type") for c in components if c.get("type") not in CONTROL_MAP}
        )
        visible_schema = build_page_schema(template, entities, False)
        all_schema = build_page_schema(template, entities, True)
        description = (
            f"易快报模板「{name}」（{group.get('name')} / {template.get('type')} / "
            f"{'启用' if template.get('active') else '停用'}）：共 {len(components)} 个控件，"
            f"其中 {len(mapped)} 个静态字段可渲染；已剔除 {len(components) - len(mapped)} 个当前不支持的控件"
            f"（{', '.join(skipped_types) if skipped_types else '无'}）。"
        )

        fixture = {
            "templateId": template.get("id"),
            "key": key,
            "name": name,
            "groupName": group.get("name"),
            "type": template.get("type"),
            "active": bool(template.get("active")),
            "componentCount": len(components),
            "mappedCount": len(mapped),
            "description": description,
            "visiblePageSchema": visible_schema,
            "allPageSchema": all_schema,
        }

        fixture_ts = f"""/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「{name}」（id: {template.get('id')}）
import type {{ StaticFormExample }} from '../types';

const example: StaticFormExample = {dump(fixture)};

export default example;
"""
        with open(os.path.join(FIXTURE_DIR, f"{key}.ts"), "w", encoding="utf-8") as f:
            f.write(fixture_ts)

        entries.append(
            {
                "key": key,
                "name": name,
                "groupName": group.get("name"),
                "type": template.get("type"),
                "active": bool(template.get("active")),
                "componentCount": len(components),
                "mappedCount": len(mapped),
            }
        )

    registry_ts = """// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
import type { StaticFormExample } from './types';

const modules = import.meta.glob<{ default: StaticFormExample }>('./fixtures/*.ts', {
  eager: true,
});

export const staticFormExamples: StaticFormExample[] = Object.entries(modules)
  .map(([, mod]) => mod.default)
  .sort((a, b) => a.key.localeCompare(b.key));

export function getStaticFormExample(key: string) {
  return staticFormExamples.find((item) => item.key === key);
}
"""
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        f.write(registry_ts)

    # 移除旧的单模板 fixture，避免残留
    legacy = os.path.join(OUT_DIR, "fixture.ts")
    if os.path.exists(legacy):
        os.remove(legacy)

    print(f"generated {len(entries)} fixtures -> {FIXTURE_DIR}")
    for entry in entries:
        print(
            entry["key"],
            "|",
            entry["name"],
            "|",
            entry["type"],
            "|",
            "active" if entry["active"] else "inactive",
            "| mapped",
            entry["mappedCount"],
            "/",
            entry["componentCount"],
        )


if __name__ == "__main__":
    main()

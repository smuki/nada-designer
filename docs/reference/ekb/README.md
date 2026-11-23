# 易快报单据模板配置 · 参考包

> 为「后续设计新的表单/流程系统」准备的**可长期检索**的参考资料：结构化 JSON + 设计要点 + 配套分析文档。
>
> 数据来源：`GET https://app.ekuaibao.com/api/form/v2/specificationGroups`（corpId=`ID01PH4Q5CJboX`，抓取于 2026-11-22）
> 规模：4 个模板分组、35 个单据模板、748 个控件、**84 个配置项**、18 种控件类型。

## 文件清单

| 文件 | 内容 | 适合谁 |
| --- | --- | --- |
| [config-options.json](config-options.json) | **84 个配置项**的机器可读字典：key、分类、含义、出现次数、适用控件、取值分布与样例 | 写 schema / 生成表单配置面板 / 做字段对照 |
| [widget-types.json](widget-types.json) | **18 种控件类型**的统计、绑定数据类型映射、典型字段、完整配置项、代表性样例 | 设计控件注册表 / 组件库映射 |
| [design-notes.md](design-notes.md) | 设计新系统时的模型分层、配置 schema 建议、运行时管线、必做能力清单 | 架构设计、技术方案评审 |
| [../../易快报单据模板字段配置项说明.md](../../易快报单据模板字段配置项说明.md) | 配置项的**可读版说明**（含逐项解释、示例与附录） | 需求/产品/新人阅读 |
| [../../易快报单据模板(specificationGroups)分析.md](../../易快报单据模板(specificationGroups)分析.md) | 模板数据结构、控件体系、字段映射的完整分析 | 了解数据来源与整体结构 |
| [../../易快报业务字段定义.md](../../易快报业务字段定义.md) | 406 个业务字段的字典（字段语义层） | 字段语义、报表维度、选项来源 |

## 快速参考

### 控件类型（18 种）

| 控件 `type` | 数量 | 绑定字段数 | 对应字段 `dataType`（实例数） | 典型字段 |
| --- | --- | --- | --- | --- |
| `select` | 276 | 276 | ref×273、list×3 | submitterId×35、法人实体×25、u_申请人部门×22、u_申请人成本中心×18、u_直接上级×15 |
| `text` | 168 | 168 | text×168 | title×23、u_OA文本×19、u_支出事由×13、u_摘要×12、u_内部备注×11 |
| `date` | 46 | 46 | date×46 | expenseDate×14、requisitionDate×14、u_预计付款日期×7、loanDate×3、u_开始时间×1 |
| `textarea` | 41 | 41 | text×41 | u_内部备注×18、title×12、u_支出事由×8、description×2、u_OA文本×1 |
| `money` | 40 | 40 | money×40 | u_付款金额×13、u_发票金额×6、loanMoney×5、payMoney×3、u_票和款差额×3 |
| `attachments` | 40 | 40 | list×40 | attachments×27、u_银行回单×12、u_退票回单×1 |
| `dataLink` | 24 | 24 | ref×24 | u_关联合同流程×10、u_关联供应商×8、u_开票台账×2、u_使用权摊销明细×1、u_关联直线摊销×1 |
| `group` | 19 | 0 | — | — |
| `annotation` | 19 | 0 | — | — |
| `payeeInfo` | 17 | 17 | ref×17 | payeeId×17 |
| `details` | 14 | 14 | list×14 | details×14 |
| `separator` | 13 | 0 | — | — |
| `requisitionDetails` | 11 | 11 | list×11 | details×11 |
| `dateRange` | 7 | 7 | dateRange×7 | u_受益期间×6、feeDatePeriod×1 |
| `city` | 6 | 6 | ref×6 | u_常驻地×6 |
| `switcher` | 5 | 5 | boolean×5 | u_合思提单判断×5 |
| `corporateExpenseCard` | 1 | 1 | corporateExpenseCard×1 | corporateExpenseCardForm×1 |
| `number` | 1 | 1 | number×1 | u_总天数×1 |

### 配置项（84 个，按出现次数 Top 20）

| 配置项 | 分类 | 出现次数 | 适用控件（Top3） |
| --- | --- | --- | --- |
| `cnLabel` | 基础标识 | 748 | select×276、text×168、date×46 等 |
| `enLabel` | 基础标识 | 748 | select×276、text×168、date×46 等 |
| `label` | 基础标识 | 748 | select×276、text×168、date×46 等 |
| `readonly` | 编辑、必填与复制 | 748 | select×276、text×168、date×46 等 |
| `showInDetails` | 显示与占位 | 748 | select×276、text×168、date×46 等 |
| `type` | 基础标识 | 748 | select×276、text×168、date×46 等 |
| `cnPlaceholder` | 显示与占位 | 697 | select×276、text×168、date×46 等 |
| `configs` | 默认值与动态配置 | 697 | select×276、text×168、date×46 等 |
| `copyable` | 编辑、必填与复制 | 697 | select×276、text×168、date×46 等 |
| `defaultField` | 编辑、必填与复制 | 697 | select×276、text×168、date×46 等 |
| `defaultValue` | 默认值与动态配置 | 697 | select×276、text×168、date×46 等 |
| `editable` | 编辑、必填与复制 | 697 | select×276、text×168、date×46 等 |
| `enPlaceholder` | 显示与占位 | 697 | select×276、text×168、date×46 等 |
| `field` | 基础标识 | 697 | select×276、text×168、date×46 等 |
| `hide` | 显隐与权限 | 697 | select×276、text×168、date×46 等 |
| `hideBlacklistVisibility` | 显隐与权限 | 697 | select×276、text×168、date×46 等 |
| `hideVisibility` | 显隐与权限 | 697 | select×276、text×168、date×46 等 |
| `optional` | 编辑、必填与复制 | 697 | select×276、text×168、date×46 等 |
| `placeholder` | 显示与占位 | 697 | select×276、text×168、date×46 等 |
| `priority` | 默认值与动态配置 | 672 | select×276、text×168、date×46 等 |

其余配置项见 [config-options.json](config-options.json) 的 `options` 数组；分类见 `categories`。

### JSON 结构说明

`config-options.json`：

```jsonc
{
  "meta": { "source": {...}, "scale": {...} },       // 数据来源与规模
  "categories": [ { "name": "...", "count": n, "options": ["key", ...] } ],
  "options": [
    {
      "key": "hide",                 // 配置项名（= components[].hide）
      "category": "显隐与权限",
      "meaning": "默认是否隐藏",
      "present": 697,                // 出现次数
      "presentRate": 0.932,          // 出现率（占 748 个控件）
      "widgets": { "select": 276, "text": 168, ... }, // 各控件类型下的次数
      "kinds": { "boolean": 697 },   // 值类型分布
      "observed": { "true": 280, "false": 417 }       // 取值分布/样例
    }
  ]
}
```

`widget-types.json`：

```jsonc
{
  "dataTypeToWidgets": { "ref": { "select": 273, "dataLink": 24, ... } }, // 数据类型 → 可用控件
  "widgetTypes": [
    {
      "type": "select",
      "count": 276,
      "fieldBound": 276,
      "dataTypes": { "ref": 273, "list": 3 },
      "typicalFields": ["submitterId×35", ...],
      "options": { "label": 276, ... },
      "example": { ... }            // 一个真实控件配置样例
    }
  ]
}
```

## 如何更新这份参考

1. 重新调用接口（token 需自行获取，不入库）：

```bash
curl "https://app.ekuaibao.com/api/form/v2/specificationGroups?orgId=&corpId=ID01PH4Q5CJboX&accessToken=<token>" -o spec-groups.json
curl "https://app.ekuaibao.com/api/flow/v2/propertySet?corpId=ID01PH4Q5CJboX&accessToken=<token>" -o property-set.json
```

2. 将 `spec-groups.json` 中的 `items` 展开为控件列表（分组 → specifications → components），按 `config-options.json` 的结构重新统计；
3. 同步更新本目录 JSON 与三份 Markdown 文档中的数字（模板数/控件数/次数）。

> 说明：配置项出现次数、默认值、样例均来自该租户的真实模板配置（含租户自定义字段），换租户后分布会不同，但**控件类型与配置项集合**基本一致。

## 使用建议（面向新系统设计）

- **不要照搬字段值**：`u_*` 自定义字段、业务 ID、模板 ID 都是租户相关的，只参考**结构**；
- **控件注册表**以 `widget-types.json` 为输入，逐项决定「是否支持、映射到哪个前端组件、支持哪些配置」；
- **配置面板**以 `config-options.json` 为输入，按 `category` 分组渲染，按 `kinds/observed` 决定控件形态（开关/输入框/选择器/JSON 编辑器）；
- **设计细节**（模型分层、求值顺序、必做能力）见 [design-notes.md](design-notes.md)。

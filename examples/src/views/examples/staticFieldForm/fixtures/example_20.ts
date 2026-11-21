/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「先款后票核销单」（id: ID01RU8tUYeHMP）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01RU8tUYeHMP",
  "key": "example_20",
  "name": "先款后票核销单",
  "groupName": "部门费用",
  "type": "expense",
  "active": true,
  "componentCount": 35,
  "mappedCount": 27,
  "description": "易快报模板「先款后票核销单」（部门费用 / expense / 启用）：共 35 个控件，其中 27 个静态字段可渲染；已剔除 8 个当前不支持的控件（annotation, dataLink, dateRange, details, group）。",
  "visiblePageSchema": {
    "canvas": {
      "mode": "desktop"
    },
    "schemas": [
      {
        "children": [
          {
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "标题",
            "type": "input",
            "props": {
              "placeholder": "请输入标题",
              "maxLength": 14,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "核销所属公司",
            "type": "select",
            "props": {
              "placeholder": "请选择所属公司",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_是否含纸质票据",
            "id": "field_u_是否含纸质票据",
            "input": true,
            "label": "是否含纸质票据",
            "type": "select",
            "props": {
              "placeholder": "请选择是否含纸质票据",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写是否含纸质票据",
                "required": true
              }
            ]
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "input",
            "props": {
              "placeholder": "请输入支出事由",
              "maxLength": 1000,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写支出事由",
                "required": true
              }
            ]
          },
          {
            "field": "u_内部备注",
            "id": "field_u_内部备注",
            "input": true,
            "label": "内部备注",
            "type": "input",
            "props": {
              "placeholder": "如核销事项与发票不匹配，则在此处填写真实用途",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_是否签署合同",
            "id": "field_u_是否签署合同",
            "input": true,
            "label": "是否签署合同",
            "type": "select",
            "props": {
              "placeholder": "请选择是否签署合同",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写是否签署合同",
                "required": true
              }
            ]
          },
          {
            "field": "u_供应商编码",
            "id": "field_u_供应商编码",
            "input": true,
            "label": "供应商编码",
            "type": "input",
            "props": {
              "placeholder": "请输入供应商编码",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_供应商名称",
            "id": "field_u_供应商名称",
            "input": true,
            "label": "供应商名称",
            "type": "input",
            "props": {
              "placeholder": "请输入供应商名称",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_发票金额",
            "id": "field_u_发票金额",
            "input": true,
            "label": "发票金额",
            "type": "number",
            "props": {
              "placeholder": "请输入发票金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_预付费用类型",
            "id": "field_u_预付费用类型",
            "input": true,
            "label": "预付费用类型",
            "type": "select",
            "props": {
              "placeholder": "请选择预付费用类型",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_付款金额",
            "id": "field_u_付款金额",
            "input": true,
            "label": "待核销金额",
            "type": "number",
            "props": {
              "placeholder": "请输入待核销金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "附件内容（非发票）",
            "type": "upload-file",
            "props": {}
          },
          {
            "field": "u_凭证摘要",
            "id": "field_u_凭证摘要",
            "input": true,
            "label": "凭证摘要",
            "type": "input",
            "props": {
              "placeholder": "请输入凭证摘要",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_票和款差额",
            "id": "field_u_票和款差额",
            "input": true,
            "label": "票和款差额",
            "type": "number",
            "props": {
              "placeholder": "请输入票和款差额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "submitterId",
            "id": "field_submitterId",
            "input": true,
            "label": "申请人",
            "type": "select",
            "props": {
              "placeholder": "请选择提交人",
              "options": [
                {
                  "label": "张三",
                  "value": "staff_1"
                },
                {
                  "label": "李四",
                  "value": "staff_2"
                },
                {
                  "label": "王五",
                  "value": "staff_3"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写申请人",
                "required": true
              }
            ]
          },
          {
            "field": "expenseDate",
            "id": "field_expenseDate",
            "input": true,
            "label": "申请日期",
            "type": "date",
            "props": {
              "disabled": true
            }
          },
          {
            "field": "u_申请人成本中心",
            "id": "field_u_申请人成本中心",
            "input": true,
            "label": "申请人成本中心",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人成本中心",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写申请人成本中心",
                "required": true
              }
            ]
          },
          {
            "field": "u_申请人部门",
            "id": "field_u_申请人部门",
            "input": true,
            "label": "申请人部门",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人部门",
              "options": [
                {
                  "label": "财务部",
                  "value": "dept_1"
                },
                {
                  "label": "市场部",
                  "value": "dept_2"
                },
                {
                  "label": "研发部",
                  "value": "dept_3"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_申请人归属公司",
            "id": "field_u_申请人归属公司",
            "input": true,
            "label": "申请人归属公司",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人归属公司",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "hidden": true
            }
          },
          {
            "field": "u_直接上级",
            "id": "field_u_直接上级",
            "input": true,
            "label": "直接上级",
            "type": "select",
            "props": {
              "placeholder": "请选择直接上级",
              "options": [
                {
                  "label": "张三",
                  "value": "staff_1"
                },
                {
                  "label": "李四",
                  "value": "staff_2"
                },
                {
                  "label": "王五",
                  "value": "staff_3"
                }
              ],
              "hidden": true
            }
          },
          {
            "field": "u_是否付款",
            "id": "field_u_是否付款",
            "input": true,
            "label": "是否付款",
            "type": "select",
            "props": {
              "placeholder": "请选择是否付款",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_系统来源",
            "id": "field_u_系统来源",
            "input": true,
            "label": "系统来源",
            "type": "select",
            "props": {
              "placeholder": "请选择系统来源",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_是否境外付款",
            "id": "field_u_是否境外付款",
            "input": true,
            "label": "是否境外付款",
            "type": "select",
            "props": {
              "placeholder": "请选择是否境外付款",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_OA文本",
            "id": "field_u_OA文本",
            "input": true,
            "label": "OA文本",
            "type": "input",
            "props": {
              "placeholder": "请输入OA文本",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_是否质检指定的成本中心",
            "id": "field_u_是否质检指定的成本中心",
            "input": true,
            "label": "是否质检指定的成本中心",
            "type": "select",
            "props": {
              "placeholder": "请选择是否质检指定的成本中心",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "hidden": true
            }
          },
          {
            "field": "legalEntityMultiCurrency",
            "id": "field_legalEntityMultiCurrency",
            "input": true,
            "label": "法人实体多币种",
            "type": "select",
            "props": {
              "placeholder": "请选择法人实体多币种",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_合同编码",
            "id": "field_u_合同编码",
            "input": true,
            "label": "合同编码",
            "type": "input",
            "props": {
              "placeholder": "请输入合同编码",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          }
        ],
        "id": "root",
        "label": "先款后票核销单",
        "props": {
          "colon": true,
          "labelAlign": "left",
          "labelLayout": "fixed",
          "labelPlacement": "top",
          "labelWidth": 120,
          "layout": "vertical",
          "label-position": "top",
          "name": "default"
        },
        "type": "form"
      }
    ],
    "script": ""
  },
  "allPageSchema": {
    "canvas": {
      "mode": "desktop"
    },
    "schemas": [
      {
        "children": [
          {
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "标题",
            "type": "input",
            "props": {
              "placeholder": "请输入标题",
              "maxLength": 14,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "核销所属公司",
            "type": "select",
            "props": {
              "placeholder": "请选择所属公司",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_是否含纸质票据",
            "id": "field_u_是否含纸质票据",
            "input": true,
            "label": "是否含纸质票据",
            "type": "select",
            "props": {
              "placeholder": "请选择是否含纸质票据",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写是否含纸质票据",
                "required": true
              }
            ]
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "input",
            "props": {
              "placeholder": "请输入支出事由",
              "maxLength": 1000,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写支出事由",
                "required": true
              }
            ]
          },
          {
            "field": "u_内部备注",
            "id": "field_u_内部备注",
            "input": true,
            "label": "内部备注",
            "type": "input",
            "props": {
              "placeholder": "如核销事项与发票不匹配，则在此处填写真实用途",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_是否签署合同",
            "id": "field_u_是否签署合同",
            "input": true,
            "label": "是否签署合同",
            "type": "select",
            "props": {
              "placeholder": "请选择是否签署合同",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写是否签署合同",
                "required": true
              }
            ]
          },
          {
            "field": "u_供应商编码",
            "id": "field_u_供应商编码",
            "input": true,
            "label": "供应商编码",
            "type": "input",
            "props": {
              "placeholder": "请输入供应商编码",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_供应商名称",
            "id": "field_u_供应商名称",
            "input": true,
            "label": "供应商名称",
            "type": "input",
            "props": {
              "placeholder": "请输入供应商名称",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_发票金额",
            "id": "field_u_发票金额",
            "input": true,
            "label": "发票金额",
            "type": "number",
            "props": {
              "placeholder": "请输入发票金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "u_预付费用类型",
            "id": "field_u_预付费用类型",
            "input": true,
            "label": "预付费用类型",
            "type": "select",
            "props": {
              "placeholder": "请选择预付费用类型",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_付款金额",
            "id": "field_u_付款金额",
            "input": true,
            "label": "待核销金额",
            "type": "number",
            "props": {
              "placeholder": "请输入待核销金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "附件内容（非发票）",
            "type": "upload-file",
            "props": {}
          },
          {
            "field": "u_凭证摘要",
            "id": "field_u_凭证摘要",
            "input": true,
            "label": "凭证摘要",
            "type": "input",
            "props": {
              "placeholder": "请输入凭证摘要",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_票和款差额",
            "id": "field_u_票和款差额",
            "input": true,
            "label": "票和款差额",
            "type": "number",
            "props": {
              "placeholder": "请输入票和款差额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "submitterId",
            "id": "field_submitterId",
            "input": true,
            "label": "申请人",
            "type": "select",
            "props": {
              "placeholder": "请选择提交人",
              "options": [
                {
                  "label": "张三",
                  "value": "staff_1"
                },
                {
                  "label": "李四",
                  "value": "staff_2"
                },
                {
                  "label": "王五",
                  "value": "staff_3"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写申请人",
                "required": true
              }
            ]
          },
          {
            "field": "expenseDate",
            "id": "field_expenseDate",
            "input": true,
            "label": "申请日期",
            "type": "date",
            "props": {
              "disabled": true
            }
          },
          {
            "field": "u_申请人成本中心",
            "id": "field_u_申请人成本中心",
            "input": true,
            "label": "申请人成本中心",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人成本中心",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写申请人成本中心",
                "required": true
              }
            ]
          },
          {
            "field": "u_申请人部门",
            "id": "field_u_申请人部门",
            "input": true,
            "label": "申请人部门",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人部门",
              "options": [
                {
                  "label": "财务部",
                  "value": "dept_1"
                },
                {
                  "label": "市场部",
                  "value": "dept_2"
                },
                {
                  "label": "研发部",
                  "value": "dept_3"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_申请人归属公司",
            "id": "field_u_申请人归属公司",
            "input": true,
            "label": "申请人归属公司",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人归属公司",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写申请人归属公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_直接上级",
            "id": "field_u_直接上级",
            "input": true,
            "label": "直接上级",
            "type": "select",
            "props": {
              "placeholder": "请选择直接上级",
              "options": [
                {
                  "label": "张三",
                  "value": "staff_1"
                },
                {
                  "label": "李四",
                  "value": "staff_2"
                },
                {
                  "label": "王五",
                  "value": "staff_3"
                }
              ]
            }
          },
          {
            "field": "u_是否付款",
            "id": "field_u_是否付款",
            "input": true,
            "label": "是否付款",
            "type": "select",
            "props": {
              "placeholder": "请选择是否付款",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_系统来源",
            "id": "field_u_系统来源",
            "input": true,
            "label": "系统来源",
            "type": "select",
            "props": {
              "placeholder": "请选择系统来源",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_是否境外付款",
            "id": "field_u_是否境外付款",
            "input": true,
            "label": "是否境外付款",
            "type": "select",
            "props": {
              "placeholder": "请选择是否境外付款",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_OA文本",
            "id": "field_u_OA文本",
            "input": true,
            "label": "OA文本",
            "type": "input",
            "props": {
              "placeholder": "请输入OA文本",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_是否质检指定的成本中心",
            "id": "field_u_是否质检指定的成本中心",
            "input": true,
            "label": "是否质检指定的成本中心",
            "type": "select",
            "props": {
              "placeholder": "请选择是否质检指定的成本中心",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            }
          },
          {
            "field": "legalEntityMultiCurrency",
            "id": "field_legalEntityMultiCurrency",
            "input": true,
            "label": "法人实体多币种",
            "type": "select",
            "props": {
              "placeholder": "请选择法人实体多币种",
              "options": [
                {
                  "label": "维度值A",
                  "value": "dim_a"
                },
                {
                  "label": "维度值B",
                  "value": "dim_b"
                }
              ],
              "disabled": true
            }
          },
          {
            "field": "u_合同编码",
            "id": "field_u_合同编码",
            "input": true,
            "label": "合同编码",
            "type": "input",
            "props": {
              "placeholder": "请输入合同编码",
              "maxLength": 140,
              "minLength": 0
            }
          }
        ],
        "id": "root",
        "label": "先款后票核销单",
        "props": {
          "colon": true,
          "labelAlign": "left",
          "labelLayout": "fixed",
          "labelPlacement": "top",
          "labelWidth": 120,
          "layout": "vertical",
          "label-position": "top",
          "name": "default"
        },
        "type": "form"
      }
    ],
    "script": ""
  }
};

export default example;

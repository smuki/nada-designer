/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「快速报销单（自动生成）（暂弃）」（id: ID01PIc4maYcTJ）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01PIc4maYcTJ",
  "key": "example_11",
  "name": "快速报销单（自动生成）（暂弃）",
  "groupName": "个人费用",
  "type": "expense",
  "active": false,
  "componentCount": 16,
  "mappedCount": 12,
  "description": "易快报模板「快速报销单（自动生成）（暂弃）」（个人费用 / expense / 停用）：共 16 个控件，其中 12 个静态字段可渲染；已剔除 4 个当前不支持的控件（annotation, city, details, payeeInfo）。",
  "visiblePageSchema": {
    "canvas": {
      "mode": "desktop"
    },
    "schemas": [
      {
        "children": [
          {
            "field": "expenseLink",
            "id": "field_expenseLink",
            "input": true,
            "label": "关联申请",
            "type": "select",
            "props": {
              "placeholder": "请选择关联申请",
              "options": [
                {
                  "label": "选项1",
                  "value": "opt_1"
                },
                {
                  "label": "选项2",
                  "value": "opt_2"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写关联申请",
                "required": true
              }
            ]
          },
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
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "textarea",
            "props": {
              "placeholder": "请输入支出事由",
              "rows": 3,
              "maxLength": 300,
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
            "type": "textarea",
            "props": {
              "placeholder": "如报销事项与发票不匹配，则在此处填写真实用途",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            }
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "付款公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择付款公司名称",
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
                "message": "请填写付款公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_付款金额",
            "id": "field_u_付款金额",
            "input": true,
            "label": "付款金额",
            "type": "number",
            "props": {
              "placeholder": "请输入付款金额",
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
            "label": "附件",
            "type": "upload-file",
            "props": {}
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
            "field": "u_实际报销人",
            "id": "field_u_实际报销人",
            "input": true,
            "label": "实际报销人",
            "type": "select",
            "props": {
              "placeholder": "请选择实际报销人",
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
              "disabled": true,
              "hidden": true
            }
          }
        ],
        "id": "root",
        "label": "快速报销单（自动生成）（暂弃）",
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
            "field": "expenseLink",
            "id": "field_expenseLink",
            "input": true,
            "label": "关联申请",
            "type": "select",
            "props": {
              "placeholder": "请选择关联申请",
              "options": [
                {
                  "label": "选项1",
                  "value": "opt_1"
                },
                {
                  "label": "选项2",
                  "value": "opt_2"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写关联申请",
                "required": true
              }
            ]
          },
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
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "textarea",
            "props": {
              "placeholder": "请输入支出事由",
              "rows": 3,
              "maxLength": 300,
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
            "type": "textarea",
            "props": {
              "placeholder": "如报销事项与发票不匹配，则在此处填写真实用途",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            }
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "付款公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择付款公司名称",
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
                "message": "请填写付款公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_付款金额",
            "id": "field_u_付款金额",
            "input": true,
            "label": "付款金额",
            "type": "number",
            "props": {
              "placeholder": "请输入付款金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "附件",
            "type": "upload-file",
            "props": {}
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
            "field": "u_实际报销人",
            "id": "field_u_实际报销人",
            "input": true,
            "label": "实际报销人",
            "type": "select",
            "props": {
              "placeholder": "请选择实际报销人",
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
              "disabled": true
            }
          }
        ],
        "id": "root",
        "label": "快速报销单（自动生成）（暂弃）",
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

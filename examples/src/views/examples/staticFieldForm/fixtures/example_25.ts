/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「国际易商卡额度申请」（id: ID01VXeCvJAHTh）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01VXeCvJAHTh",
  "key": "example_25",
  "name": "国际易商卡额度申请",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 10,
  "mappedCount": 8,
  "description": "易快报模板「国际易商卡额度申请」（申请事项 / requisition / 启用）：共 10 个控件，其中 8 个静态字段可渲染；已剔除 2 个当前不支持的控件（corporateExpenseCard, dateRange）。",
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
              "maxLength": 140,
              "minLength": 0,
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
              "placeholder": "请选择申请人",
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
            "field": "requisitionDate",
            "id": "field_requisitionDate",
            "input": true,
            "label": "申请日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写申请日期",
                "required": true
              }
            ]
          },
          {
            "field": "expenseDepartment",
            "id": "field_expenseDepartment",
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
              ]
            },
            "rules": [
              {
                "message": "请填写申请人部门",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择公司名称",
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
                "message": "请填写公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_申请事由",
            "id": "field_u_申请事由",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入申请事由",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写申请事由",
                "required": true
              }
            ]
          },
          {
            "field": "loanMoney",
            "id": "field_loanMoney",
            "input": true,
            "label": "借款金额",
            "type": "number",
            "props": {
              "placeholder": "请输入借款金额",
              "min": 0.01,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写借款金额",
                "required": true
              }
            ]
          },
          {
            "field": "requisitionMoney",
            "id": "field_requisitionMoney",
            "input": true,
            "label": "申请金额",
            "type": "number",
            "props": {
              "placeholder": "请输入申请金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true,
              "hidden": true
            }
          }
        ],
        "id": "root",
        "label": "国际易商卡额度申请",
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
              "maxLength": 140,
              "minLength": 0,
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
              "placeholder": "请选择申请人",
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
            "field": "requisitionDate",
            "id": "field_requisitionDate",
            "input": true,
            "label": "申请日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写申请日期",
                "required": true
              }
            ]
          },
          {
            "field": "expenseDepartment",
            "id": "field_expenseDepartment",
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
              ]
            },
            "rules": [
              {
                "message": "请填写申请人部门",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择公司名称",
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
                "message": "请填写公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_申请事由",
            "id": "field_u_申请事由",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入申请事由",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写申请事由",
                "required": true
              }
            ]
          },
          {
            "field": "loanMoney",
            "id": "field_loanMoney",
            "input": true,
            "label": "借款金额",
            "type": "number",
            "props": {
              "placeholder": "请输入借款金额",
              "min": 0.01,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写借款金额",
                "required": true
              }
            ]
          },
          {
            "field": "requisitionMoney",
            "id": "field_requisitionMoney",
            "input": true,
            "label": "申请金额",
            "type": "number",
            "props": {
              "placeholder": "请输入申请金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          }
        ],
        "id": "root",
        "label": "国际易商卡额度申请",
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

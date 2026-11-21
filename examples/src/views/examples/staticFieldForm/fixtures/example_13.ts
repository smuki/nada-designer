/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「资金调拨单「多币种」」（id: ID01Xlu0sxibkr）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01Xlu0sxibkr",
  "key": "example_13",
  "name": "资金调拨单「多币种」",
  "groupName": "部门费用",
  "type": "expense",
  "active": false,
  "componentCount": 9,
  "mappedCount": 7,
  "description": "易快报模板「资金调拨单「多币种」」（部门费用 / expense / 停用）：共 9 个控件，其中 7 个静态字段可渲染；已剔除 2 个当前不支持的控件（details, payeeInfo）。",
  "visiblePageSchema": {
    "canvas": {
      "mode": "desktop"
    },
    "schemas": [
      {
        "children": [
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
            "props": {},
            "rules": [
              {
                "message": "请填写申请日期",
                "required": true
              }
            ]
          },
          {
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入标题",
              "maxLength": 14,
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
            "field": "legalEntityMultiCurrency",
            "id": "field_legalEntityMultiCurrency",
            "input": true,
            "label": "法人实体",
            "type": "select",
            "props": {
              "placeholder": "请选择法人实体",
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
                "message": "请填写法人实体",
                "required": true
              }
            ]
          },
          {
            "field": "u_开户类型",
            "id": "field_u_开户类型",
            "input": true,
            "label": "收款账户类型",
            "type": "select",
            "props": {
              "placeholder": "请选择收款账户类型",
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
                "message": "请填写收款账户类型",
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
          }
        ],
        "id": "root",
        "label": "资金调拨单「多币种」",
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
            "props": {},
            "rules": [
              {
                "message": "请填写申请日期",
                "required": true
              }
            ]
          },
          {
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入标题",
              "maxLength": 14,
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
            "field": "legalEntityMultiCurrency",
            "id": "field_legalEntityMultiCurrency",
            "input": true,
            "label": "法人实体",
            "type": "select",
            "props": {
              "placeholder": "请选择法人实体",
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
                "message": "请填写法人实体",
                "required": true
              }
            ]
          },
          {
            "field": "u_开户类型",
            "id": "field_u_开户类型",
            "input": true,
            "label": "收款账户类型",
            "type": "select",
            "props": {
              "placeholder": "请选择收款账户类型",
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
                "message": "请填写收款账户类型",
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
          }
        ],
        "id": "root",
        "label": "资金调拨单「多币种」",
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

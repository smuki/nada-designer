/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「支付退票申请单」（id: ID01XltgiPKukv）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01XltgiPKukv",
  "key": "example_14",
  "name": "支付退票申请单",
  "groupName": "部门费用",
  "type": "expense",
  "active": true,
  "componentCount": 19,
  "mappedCount": 15,
  "description": "易快报模板「支付退票申请单」（部门费用 / expense / 启用）：共 19 个控件，其中 15 个静态字段可渲染；已剔除 4 个当前不支持的控件（annotation, dataLink, details, payeeInfo）。",
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
              "maxLength": 999,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_原付款单号",
            "id": "field_u_原付款单号",
            "input": true,
            "label": "原付款单号",
            "type": "input",
            "props": {
              "placeholder": "请输入原付款单号",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写原付款单号",
                "required": true
              }
            ]
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
            "field": "u_退票日期",
            "id": "field_u_退票日期",
            "input": true,
            "label": "退票日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写退票日期",
                "required": true
              }
            ]
          },
          {
            "field": "u_退票回单",
            "id": "field_u_退票回单",
            "input": true,
            "label": "退票回单",
            "type": "upload-file",
            "props": {}
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
            "field": "u_银行回单",
            "id": "field_u_银行回单",
            "input": true,
            "label": "再次付款银行回单（支付计划处或此处可查看银行回单文件）",
            "type": "upload-file",
            "props": {}
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "input",
            "props": {
              "placeholder": "请输入支出事由",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_内部备注",
            "id": "field_u_内部备注",
            "input": true,
            "label": "内部备注",
            "type": "input",
            "props": {
              "placeholder": "请输入内部备注",
              "maxLength": 140,
              "minLength": 0
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
            "field": "u_退票收款账号",
            "id": "field_u_退票收款账号",
            "input": true,
            "label": "退票收款账号",
            "type": "input",
            "props": {
              "placeholder": "请输入退票收款账号",
              "maxLength": 140,
              "minLength": 0
            }
          }
        ],
        "id": "root",
        "label": "支付退票申请单",
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
              "maxLength": 999,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写标题",
                "required": true
              }
            ]
          },
          {
            "field": "u_原付款单号",
            "id": "field_u_原付款单号",
            "input": true,
            "label": "原付款单号",
            "type": "input",
            "props": {
              "placeholder": "请输入原付款单号",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写原付款单号",
                "required": true
              }
            ]
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
            "field": "u_退票日期",
            "id": "field_u_退票日期",
            "input": true,
            "label": "退票日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写退票日期",
                "required": true
              }
            ]
          },
          {
            "field": "u_退票回单",
            "id": "field_u_退票回单",
            "input": true,
            "label": "退票回单",
            "type": "upload-file",
            "props": {}
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
            "field": "u_银行回单",
            "id": "field_u_银行回单",
            "input": true,
            "label": "再次付款银行回单（支付计划处或此处可查看银行回单文件）",
            "type": "upload-file",
            "props": {}
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "input",
            "props": {
              "placeholder": "请输入支出事由",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_内部备注",
            "id": "field_u_内部备注",
            "input": true,
            "label": "内部备注",
            "type": "input",
            "props": {
              "placeholder": "请输入内部备注",
              "maxLength": 140,
              "minLength": 0
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
            "field": "u_退票收款账号",
            "id": "field_u_退票收款账号",
            "input": true,
            "label": "退票收款账号",
            "type": "input",
            "props": {
              "placeholder": "请输入退票收款账号",
              "maxLength": 140,
              "minLength": 0
            }
          }
        ],
        "id": "root",
        "label": "支付退票申请单",
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

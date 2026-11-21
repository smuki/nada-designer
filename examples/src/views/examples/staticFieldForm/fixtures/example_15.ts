/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「资金调拨明细单（自动付款）」（id: ID01WCRy6izJvx）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01WCRy6izJvx",
  "key": "example_15",
  "name": "资金调拨明细单（自动付款）",
  "groupName": "部门费用",
  "type": "payment",
  "active": true,
  "componentCount": 16,
  "mappedCount": 15,
  "description": "易快报模板「资金调拨明细单（自动付款）」（部门费用 / payment / 启用）：共 16 个控件，其中 15 个静态字段可渲染；已剔除 1 个当前不支持的控件（payeeInfo）。",
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
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入申请事由",
              "maxLength": 14,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_资金用途",
            "id": "field_u_资金用途",
            "input": true,
            "label": "资金用途",
            "type": "select",
            "props": {
              "placeholder": "请选择资金用途",
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
            }
          },
          {
            "field": "u_摘要",
            "id": "field_u_摘要",
            "input": true,
            "label": "摘要",
            "type": "input",
            "props": {
              "placeholder": "请输入摘要",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "资金调出公司",
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
                "message": "请填写资金调出公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_调出银行账号",
            "id": "field_u_调出银行账号",
            "input": true,
            "label": "调出银行账号",
            "type": "select",
            "props": {
              "placeholder": "请选择调出银行账号",
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
                "message": "请填写调出银行账号",
                "required": true
              }
            ]
          },
          {
            "field": "payMoney",
            "id": "field_payMoney",
            "input": true,
            "label": "调拨金额",
            "type": "number",
            "props": {
              "placeholder": "请输入需调拨金额",
              "min": 0.0,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写调拨金额",
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
            "field": "u_资金调入公司",
            "id": "field_u_资金调入公司",
            "input": true,
            "label": "资金调入公司",
            "type": "select",
            "props": {
              "placeholder": "请选择资金调入公司",
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
                "message": "请填写资金调入公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_预计付款日期",
            "id": "field_u_预计付款日期",
            "input": true,
            "label": "预计付款日期",
            "type": "date",
            "props": {}
          },
          {
            "field": "u_内部备注",
            "id": "field_u_内部备注",
            "input": true,
            "label": "内部备注",
            "type": "textarea",
            "props": {
              "placeholder": "请输入内部备注",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
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
            "field": "u_资金调拨原始单号",
            "id": "field_u_资金调拨原始单号",
            "input": true,
            "label": "资金调拨原始单号",
            "type": "input",
            "props": {
              "placeholder": "请输入资金调拨原始单号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_银行回单",
            "id": "field_u_银行回单",
            "input": true,
            "label": "银行回单（支付计划处或此处可查看银行回单文件）",
            "type": "upload-file",
            "props": {}
          }
        ],
        "id": "root",
        "label": "资金调拨明细单（自动付款）",
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
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入申请事由",
              "maxLength": 14,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_资金用途",
            "id": "field_u_资金用途",
            "input": true,
            "label": "资金用途",
            "type": "select",
            "props": {
              "placeholder": "请选择资金用途",
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
            }
          },
          {
            "field": "u_摘要",
            "id": "field_u_摘要",
            "input": true,
            "label": "摘要",
            "type": "input",
            "props": {
              "placeholder": "请输入摘要",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "资金调出公司",
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
                "message": "请填写资金调出公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_调出银行账号",
            "id": "field_u_调出银行账号",
            "input": true,
            "label": "调出银行账号",
            "type": "select",
            "props": {
              "placeholder": "请选择调出银行账号",
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
                "message": "请填写调出银行账号",
                "required": true
              }
            ]
          },
          {
            "field": "payMoney",
            "id": "field_payMoney",
            "input": true,
            "label": "调拨金额",
            "type": "number",
            "props": {
              "placeholder": "请输入需调拨金额",
              "min": 0.0,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写调拨金额",
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
            "field": "u_资金调入公司",
            "id": "field_u_资金调入公司",
            "input": true,
            "label": "资金调入公司",
            "type": "select",
            "props": {
              "placeholder": "请选择资金调入公司",
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
                "message": "请填写资金调入公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_预计付款日期",
            "id": "field_u_预计付款日期",
            "input": true,
            "label": "预计付款日期",
            "type": "date",
            "props": {}
          },
          {
            "field": "u_内部备注",
            "id": "field_u_内部备注",
            "input": true,
            "label": "内部备注",
            "type": "textarea",
            "props": {
              "placeholder": "请输入内部备注",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
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
            "field": "u_资金调拨原始单号",
            "id": "field_u_资金调拨原始单号",
            "input": true,
            "label": "资金调拨原始单号",
            "type": "input",
            "props": {
              "placeholder": "请输入资金调拨原始单号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_银行回单",
            "id": "field_u_银行回单",
            "input": true,
            "label": "银行回单（支付计划处或此处可查看银行回单文件）",
            "type": "upload-file",
            "props": {}
          }
        ],
        "id": "root",
        "label": "资金调拨明细单（自动付款）",
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

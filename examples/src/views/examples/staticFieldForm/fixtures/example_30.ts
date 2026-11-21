/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「采购申请单（自动生成）」（id: ID01RUrV3EGRcj）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01RUrV3EGRcj",
  "key": "example_30",
  "name": "采购申请单（自动生成）",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 15,
  "mappedCount": 13,
  "description": "易快报模板「采购申请单（自动生成）」（申请事项 / requisition / 启用）：共 15 个控件，其中 13 个静态字段可渲染；已剔除 2 个当前不支持的控件（group, requisitionDetails）。",
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
            "type": "textarea",
            "props": {
              "placeholder": "请输入采购描述",
              "rows": 3,
              "maxLength": 1000,
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
            "field": "u_外部单据编号",
            "id": "field_u_外部单据编号",
            "input": true,
            "label": "外部单据编号",
            "type": "input",
            "props": {
              "placeholder": "请输入外部单据编号",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写外部单据编号",
                "required": true
              }
            ]
          },
          {
            "field": "u_上游系统来源",
            "id": "field_u_上游系统来源",
            "input": true,
            "label": "上游系统来源",
            "type": "input",
            "props": {
              "placeholder": "请输入上游系统来源",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_上游系统审批状态",
            "id": "field_u_上游系统审批状态",
            "input": true,
            "label": "上游系统审批状态",
            "type": "input",
            "props": {
              "placeholder": "请输入上游系统审批状态",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写上游系统审批状态",
                "required": true
              }
            ]
          },
          {
            "field": "u_成本中心",
            "id": "field_u_成本中心",
            "input": true,
            "label": "费用申请成本中心",
            "type": "select",
            "props": {
              "placeholder": "请选择成本中心",
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
                "message": "请填写费用申请成本中心",
                "required": true
              }
            ]
          },
          {
            "field": "u_发起时间",
            "id": "field_u_发起时间",
            "input": true,
            "label": "发起时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写发起时间",
                "required": true
              }
            ]
          },
          {
            "field": "u_办结时间",
            "id": "field_u_办结时间",
            "input": true,
            "label": "办结时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写办结时间",
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
              "placeholder": "请输入内部备注",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            }
          },
          {
            "field": "u_跳转链接",
            "id": "field_u_跳转链接",
            "input": true,
            "label": "跳转链接",
            "type": "input",
            "props": {
              "placeholder": "请输入跳转链接",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写跳转链接",
                "required": true
              }
            ]
          },
          {
            "field": "u_合思提单判断",
            "id": "field_u_合思提单判断",
            "input": true,
            "label": "合思提单判断",
            "type": "switch",
            "props": {
              "placeholder": "合思提单判断"
            },
            "rules": [
              {
                "message": "请填写合思提单判断",
                "required": true
              }
            ]
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
          }
        ],
        "id": "root",
        "label": "采购申请单（自动生成）",
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
            "type": "textarea",
            "props": {
              "placeholder": "请输入采购描述",
              "rows": 3,
              "maxLength": 1000,
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
            "field": "u_外部单据编号",
            "id": "field_u_外部单据编号",
            "input": true,
            "label": "外部单据编号",
            "type": "input",
            "props": {
              "placeholder": "请输入外部单据编号",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写外部单据编号",
                "required": true
              }
            ]
          },
          {
            "field": "u_上游系统来源",
            "id": "field_u_上游系统来源",
            "input": true,
            "label": "上游系统来源",
            "type": "input",
            "props": {
              "placeholder": "请输入上游系统来源",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_上游系统审批状态",
            "id": "field_u_上游系统审批状态",
            "input": true,
            "label": "上游系统审批状态",
            "type": "input",
            "props": {
              "placeholder": "请输入上游系统审批状态",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写上游系统审批状态",
                "required": true
              }
            ]
          },
          {
            "field": "u_成本中心",
            "id": "field_u_成本中心",
            "input": true,
            "label": "费用申请成本中心",
            "type": "select",
            "props": {
              "placeholder": "请选择成本中心",
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
                "message": "请填写费用申请成本中心",
                "required": true
              }
            ]
          },
          {
            "field": "u_发起时间",
            "id": "field_u_发起时间",
            "input": true,
            "label": "发起时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写发起时间",
                "required": true
              }
            ]
          },
          {
            "field": "u_办结时间",
            "id": "field_u_办结时间",
            "input": true,
            "label": "办结时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写办结时间",
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
              "placeholder": "请输入内部备注",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            }
          },
          {
            "field": "u_跳转链接",
            "id": "field_u_跳转链接",
            "input": true,
            "label": "跳转链接",
            "type": "input",
            "props": {
              "placeholder": "请输入跳转链接",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写跳转链接",
                "required": true
              }
            ]
          },
          {
            "field": "u_合思提单判断",
            "id": "field_u_合思提单判断",
            "input": true,
            "label": "合思提单判断",
            "type": "switch",
            "props": {
              "placeholder": "合思提单判断"
            },
            "rules": [
              {
                "message": "请填写合思提单判断",
                "required": true
              }
            ]
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
          }
        ],
        "id": "root",
        "label": "采购申请单（自动生成）",
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

/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「摊销明细确认单」（id: ID01TxgE3fhD6n）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01TxgE3fhD6n",
  "key": "example_01",
  "name": "摊销明细确认单",
  "groupName": "预算调整（系统）",
  "type": "expense",
  "active": true,
  "componentCount": 20,
  "mappedCount": 13,
  "description": "易快报模板「摊销明细确认单」（预算调整（系统） / expense / 启用）：共 20 个控件，其中 13 个静态字段可渲染；已剔除 7 个当前不支持的控件（annotation, dataLink, dateRange, details）。",
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
            "label": "我方签约公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择我方公司名称",
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
                "message": "请填写我方签约公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_供应商名称",
            "id": "field_u_供应商名称",
            "input": true,
            "label": "对方签约公司名称",
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
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "摊销费用名称",
            "type": "input",
            "props": {
              "placeholder": "请输入摊销费用名称",
              "maxLength": 1000,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写摊销费用名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_摊销方式",
            "id": "field_u_摊销方式",
            "input": true,
            "label": "摊销方式",
            "type": "select",
            "props": {
              "placeholder": "请选择 摊销方式",
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
                "message": "请填写摊销方式",
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
              "placeholder": "如付款事项与发票不匹配，则在此处填写真实用途",
              "maxLength": 140,
              "minLength": 0
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
              "hidden": true
            }
          }
        ],
        "id": "root",
        "label": "摊销明细确认单",
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
            "label": "我方签约公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择我方公司名称",
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
                "message": "请填写我方签约公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_供应商名称",
            "id": "field_u_供应商名称",
            "input": true,
            "label": "对方签约公司名称",
            "type": "input",
            "props": {
              "placeholder": "请输入供应商名称",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
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
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "摊销费用名称",
            "type": "input",
            "props": {
              "placeholder": "请输入摊销费用名称",
              "maxLength": 1000,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写摊销费用名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_摊销方式",
            "id": "field_u_摊销方式",
            "input": true,
            "label": "摊销方式",
            "type": "select",
            "props": {
              "placeholder": "请选择 摊销方式",
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
                "message": "请填写摊销方式",
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
              "placeholder": "如付款事项与发票不匹配，则在此处填写真实用途",
              "maxLength": 140,
              "minLength": 0
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
              ]
            }
          }
        ],
        "id": "root",
        "label": "摊销明细确认单",
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

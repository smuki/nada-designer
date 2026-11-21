/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「发票申请单」（id: ID01RUsa8zODVl）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01RUsa8zODVl",
  "key": "example_31",
  "name": "发票申请单",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 11,
  "mappedCount": 9,
  "description": "易快报模板「发票申请单」（申请事项 / requisition / 启用）：共 11 个控件，其中 9 个静态字段可渲染；已剔除 2 个当前不支持的控件（group, requisitionDetails）。",
  "visiblePageSchema": {
    "canvas": {
      "mode": "desktop"
    },
    "schemas": [
      {
        "children": [
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "我方公司主体",
            "type": "select",
            "props": {
              "placeholder": "请选择我方公司主体",
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
                "message": "请填写我方公司主体",
                "required": true
              }
            ]
          },
          {
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "标题",
            "type": "textarea",
            "props": {
              "placeholder": "请输入标题",
              "rows": 3,
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
            "label": "申请事由",
            "type": "textarea",
            "props": {
              "placeholder": "请输入申请事由",
              "rows": 3,
              "maxLength": 300,
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
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "对账文件",
            "type": "upload-file",
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
        "label": "发票申请单",
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
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "我方公司主体",
            "type": "select",
            "props": {
              "placeholder": "请选择我方公司主体",
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
                "message": "请填写我方公司主体",
                "required": true
              }
            ]
          },
          {
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "标题",
            "type": "textarea",
            "props": {
              "placeholder": "请输入标题",
              "rows": 3,
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "申请事由",
            "type": "textarea",
            "props": {
              "placeholder": "请输入申请事由",
              "rows": 3,
              "maxLength": 300,
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
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "对账文件",
            "type": "upload-file",
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
        "label": "发票申请单",
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

/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「备用金申请」（id: ID01PIc4maYdXN）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01PIc4maYdXN",
  "key": "example_35",
  "name": "备用金申请",
  "groupName": "申请事项",
  "type": "loan",
  "active": false,
  "componentCount": 11,
  "mappedCount": 7,
  "description": "易快报模板「备用金申请」（申请事项 / loan / 停用）：共 11 个控件，其中 7 个静态字段可渲染；已剔除 4 个当前不支持的控件（annotation, separator）。",
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
            "field": "submitterId",
            "id": "field_submitterId",
            "input": true,
            "label": "提交人",
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
                "message": "请填写提交人",
                "required": true
              }
            ]
          },
          {
            "field": "loanDepartment",
            "id": "field_loanDepartment",
            "input": true,
            "label": "申请部门",
            "type": "select",
            "props": {
              "placeholder": "请选择申请部门",
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
                "message": "请填写申请部门",
                "required": true
              }
            ]
          },
          {
            "field": "loanMoney",
            "id": "field_loanMoney",
            "input": true,
            "label": "申请金额",
            "type": "number",
            "props": {
              "placeholder": "请输入申请金额",
              "min": 0.01,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写申请金额",
                "required": true
              }
            ]
          },
          {
            "field": "loanDate",
            "id": "field_loanDate",
            "input": true,
            "label": "借款日期",
            "type": "date",
            "props": {
              "hidden": true
            }
          },
          {
            "field": "description",
            "id": "field_description",
            "input": true,
            "label": "描述",
            "type": "textarea",
            "props": {
              "placeholder": "请输入描述",
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
          }
        ],
        "id": "root",
        "label": "备用金申请",
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
            "field": "submitterId",
            "id": "field_submitterId",
            "input": true,
            "label": "提交人",
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
                "message": "请填写提交人",
                "required": true
              }
            ]
          },
          {
            "field": "loanDepartment",
            "id": "field_loanDepartment",
            "input": true,
            "label": "申请部门",
            "type": "select",
            "props": {
              "placeholder": "请选择申请部门",
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
                "message": "请填写申请部门",
                "required": true
              }
            ]
          },
          {
            "field": "loanMoney",
            "id": "field_loanMoney",
            "input": true,
            "label": "申请金额",
            "type": "number",
            "props": {
              "placeholder": "请输入申请金额",
              "min": 0.01,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写申请金额",
                "required": true
              }
            ]
          },
          {
            "field": "loanDate",
            "id": "field_loanDate",
            "input": true,
            "label": "借款日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写借款日期",
                "required": true
              }
            ]
          },
          {
            "field": "description",
            "id": "field_description",
            "input": true,
            "label": "描述",
            "type": "textarea",
            "props": {
              "placeholder": "请输入描述",
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
          }
        ],
        "id": "root",
        "label": "备用金申请",
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

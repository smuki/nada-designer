/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「预算调整申请单」（id: ID01PH4Q5CJboX:system:预算调整申请单）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01PH4Q5CJboX:system:预算调整申请单",
  "key": "example_03",
  "name": "预算调整申请单",
  "groupName": "预算调整（系统）",
  "type": "custom",
  "active": true,
  "componentCount": 8,
  "mappedCount": 7,
  "description": "易快报模板「预算调整申请单」（预算调整（系统） / custom / 启用）：共 8 个控件，其中 7 个静态字段可渲染；已剔除 1 个当前不支持的控件（separator）。",
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
            "label": "预算名称",
            "type": "input",
            "props": {
              "placeholder": "请输入预算名称",
              "maxLength": 32,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写预算名称",
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
            "field": "submitDate",
            "id": "field_submitDate",
            "input": true,
            "label": "提交日期",
            "type": "date",
            "props": {
              "disabled": true
            }
          },
          {
            "field": "beforeAdjustAmount",
            "id": "field_beforeAdjustAmount",
            "input": true,
            "label": "调整前总金额",
            "type": "number",
            "props": {
              "placeholder": "请输入调整前总金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "afterAdjustAmount",
            "id": "field_afterAdjustAmount",
            "input": true,
            "label": "调整后总金额",
            "type": "number",
            "props": {
              "placeholder": "请输入调整后总金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
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
            "field": "budgetAdjustDetails",
            "id": "field_budgetAdjustDetails",
            "input": true,
            "label": "预算调整详情",
            "type": "select",
            "props": {
              "placeholder": "预算调整详情",
              "options": [
                {
                  "label": "选项A",
                  "value": "a"
                },
                {
                  "label": "选项B",
                  "value": "b"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写预算调整详情",
                "required": true
              }
            ]
          }
        ],
        "id": "root",
        "label": "预算调整申请单",
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
            "label": "预算名称",
            "type": "input",
            "props": {
              "placeholder": "请输入预算名称",
              "maxLength": 32,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写预算名称",
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
            "field": "submitDate",
            "id": "field_submitDate",
            "input": true,
            "label": "提交日期",
            "type": "date",
            "props": {
              "disabled": true
            }
          },
          {
            "field": "beforeAdjustAmount",
            "id": "field_beforeAdjustAmount",
            "input": true,
            "label": "调整前总金额",
            "type": "number",
            "props": {
              "placeholder": "请输入调整前总金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "afterAdjustAmount",
            "id": "field_afterAdjustAmount",
            "input": true,
            "label": "调整后总金额",
            "type": "number",
            "props": {
              "placeholder": "请输入调整后总金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
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
            "field": "budgetAdjustDetails",
            "id": "field_budgetAdjustDetails",
            "input": true,
            "label": "预算调整详情",
            "type": "select",
            "props": {
              "placeholder": "预算调整详情",
              "options": [
                {
                  "label": "选项A",
                  "value": "a"
                },
                {
                  "label": "选项B",
                  "value": "b"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写预算调整详情",
                "required": true
              }
            ]
          }
        ],
        "id": "root",
        "label": "预算调整申请单",
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

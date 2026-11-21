/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「历史借款导入」（id: ID01VIkJABdTUr）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01VIkJABdTUr",
  "key": "example_05",
  "name": "历史借款导入",
  "groupName": "个人费用",
  "type": "loan",
  "active": false,
  "componentCount": 7,
  "mappedCount": 7,
  "description": "易快报模板「历史借款导入」（个人费用 / loan / 停用）：共 7 个控件，其中 7 个静态字段可渲染；已剔除 0 个当前不支持的控件（无）。",
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
            "label": "借款事由",
            "type": "input",
            "props": {
              "placeholder": "请输入标题",
              "maxLength": 14,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写借款事由",
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
            "label": "借款部门",
            "type": "select",
            "props": {
              "placeholder": "请选择借款部门",
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
                "message": "请填写借款部门",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
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
            "field": "u_借款类型",
            "id": "field_u_借款类型",
            "input": true,
            "label": "借款类型",
            "type": "select",
            "props": {
              "placeholder": "请选择借款类型",
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
                "message": "请填写借款类型",
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
          }
        ],
        "id": "root",
        "label": "历史借款导入",
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
            "label": "借款事由",
            "type": "input",
            "props": {
              "placeholder": "请输入标题",
              "maxLength": 14,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写借款事由",
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
            "label": "借款部门",
            "type": "select",
            "props": {
              "placeholder": "请选择借款部门",
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
                "message": "请填写借款部门",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
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
            "field": "u_借款类型",
            "id": "field_u_借款类型",
            "input": true,
            "label": "借款类型",
            "type": "select",
            "props": {
              "placeholder": "请选择借款类型",
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
                "message": "请填写借款类型",
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
          }
        ],
        "id": "root",
        "label": "历史借款导入",
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

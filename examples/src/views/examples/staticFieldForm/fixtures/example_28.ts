/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「预提申请单」（id: ID01RW7SgAdEVp）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01RW7SgAdEVp",
  "key": "example_28",
  "name": "预提申请单",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 19,
  "mappedCount": 14,
  "description": "易快报模板「预提申请单」（申请事项 / requisition / 启用）：共 19 个控件，其中 14 个静态字段可渲染；已剔除 5 个当前不支持的控件（dataLink, group, requisitionDetails）。",
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
            "label": "预提申请说明",
            "type": "textarea",
            "props": {
              "placeholder": "请输入标题",
              "rows": 3,
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写预提申请说明",
                "required": true
              }
            ]
          },
          {
            "field": "u_预提归属日期",
            "id": "field_u_预提归属日期",
            "input": true,
            "label": "预提归属日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写预提归属日期",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "预提所属公司",
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
                "message": "请填写预提所属公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_成本中心",
            "id": "field_u_成本中心",
            "input": true,
            "label": "预提所属成本中心",
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
                "message": "请填写预提所属成本中心",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否签署合同",
            "id": "field_u_是否签署合同",
            "input": true,
            "label": "是否签署合同",
            "type": "select",
            "props": {
              "placeholder": "请选择是否签署合同",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写是否签署合同",
                "required": true
              }
            ]
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
            "field": "u_合同编码",
            "id": "field_u_合同编码",
            "input": true,
            "label": "合同编码",
            "type": "input",
            "props": {
              "placeholder": "请输入合同编码",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          }
        ],
        "id": "root",
        "label": "预提申请单",
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
            "label": "预提申请说明",
            "type": "textarea",
            "props": {
              "placeholder": "请输入标题",
              "rows": 3,
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写预提申请说明",
                "required": true
              }
            ]
          },
          {
            "field": "u_预提归属日期",
            "id": "field_u_预提归属日期",
            "input": true,
            "label": "预提归属日期",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写预提归属日期",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "预提所属公司",
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
                "message": "请填写预提所属公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_成本中心",
            "id": "field_u_成本中心",
            "input": true,
            "label": "预提所属成本中心",
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
                "message": "请填写预提所属成本中心",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否签署合同",
            "id": "field_u_是否签署合同",
            "input": true,
            "label": "是否签署合同",
            "type": "select",
            "props": {
              "placeholder": "请选择是否签署合同",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ]
            },
            "rules": [
              {
                "message": "请填写是否签署合同",
                "required": true
              }
            ]
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
            "field": "u_合同编码",
            "id": "field_u_合同编码",
            "input": true,
            "label": "合同编码",
            "type": "input",
            "props": {
              "placeholder": "请输入合同编码",
              "maxLength": 140,
              "minLength": 0
            }
          }
        ],
        "id": "root",
        "label": "预提申请单",
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

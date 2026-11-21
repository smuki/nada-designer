/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「待摊合同确认单」（id: ID01TsEGrzAcdF）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01TsEGrzAcdF",
  "key": "example_02",
  "name": "待摊合同确认单",
  "groupName": "预算调整（系统）",
  "type": "requisition",
  "active": true,
  "componentCount": 20,
  "mappedCount": 17,
  "description": "易快报模板「待摊合同确认单」（预算调整（系统） / requisition / 启用）：共 20 个控件，其中 17 个静态字段可渲染；已剔除 3 个当前不支持的控件（dataLink, group, requisitionDetails）。",
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
              "placeholder": "请输入合同名称",
              "rows": 3,
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_合同名称",
            "id": "field_u_合同名称",
            "input": true,
            "label": "合同名称",
            "type": "input",
            "props": {
              "placeholder": "请输入合同名称",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写合同名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_合同编号",
            "id": "field_u_合同编号",
            "input": true,
            "label": "合同编号",
            "type": "input",
            "props": {
              "placeholder": "请输入合同编号",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写合同编号",
                "required": true
              }
            ]
          },
          {
            "field": "u_合同类别",
            "id": "field_u_合同类别",
            "input": true,
            "label": "合同类别",
            "type": "select",
            "props": {
              "placeholder": "请选择合同类别",
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
                "message": "请填写合同类别",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "我方签约主体",
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
                "message": "请填写我方签约主体",
                "required": true
              }
            ]
          },
          {
            "field": "u_合同金额",
            "id": "field_u_合同金额",
            "input": true,
            "label": "合同金额",
            "type": "number",
            "props": {
              "placeholder": "请输入合同金额",
              "min": 0.01,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写合同金额",
                "required": true
              }
            ]
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
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写供应商名称",
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
              "minLength": 0
            }
          },
          {
            "field": "u_开始时间",
            "id": "field_u_开始时间",
            "input": true,
            "label": "开始时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写开始时间",
                "required": true
              }
            ]
          },
          {
            "field": "u_结束时间",
            "id": "field_u_结束时间",
            "input": true,
            "label": "结束时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写结束时间",
                "required": true
              }
            ]
          },
          {
            "field": "u_总天数",
            "id": "field_u_总天数",
            "input": true,
            "label": "总天数",
            "type": "number",
            "props": {
              "placeholder": "请输入总天数",
              "min": -1000000000.0,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "u_银行账号币种",
            "id": "field_u_银行账号币种",
            "input": true,
            "label": "币种",
            "type": "select",
            "props": {
              "placeholder": "请选择银行账号币种",
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
                "message": "请填写币种",
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
        "label": "待摊合同确认单",
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
              "placeholder": "请输入合同名称",
              "rows": 3,
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_合同名称",
            "id": "field_u_合同名称",
            "input": true,
            "label": "合同名称",
            "type": "input",
            "props": {
              "placeholder": "请输入合同名称",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写合同名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_合同编号",
            "id": "field_u_合同编号",
            "input": true,
            "label": "合同编号",
            "type": "input",
            "props": {
              "placeholder": "请输入合同编号",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写合同编号",
                "required": true
              }
            ]
          },
          {
            "field": "u_合同类别",
            "id": "field_u_合同类别",
            "input": true,
            "label": "合同类别",
            "type": "select",
            "props": {
              "placeholder": "请选择合同类别",
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
                "message": "请填写合同类别",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "我方签约主体",
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
                "message": "请填写我方签约主体",
                "required": true
              }
            ]
          },
          {
            "field": "u_合同金额",
            "id": "field_u_合同金额",
            "input": true,
            "label": "合同金额",
            "type": "number",
            "props": {
              "placeholder": "请输入合同金额",
              "min": 0.01,
              "max": 10000000000.0
            },
            "rules": [
              {
                "message": "请填写合同金额",
                "required": true
              }
            ]
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
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写供应商名称",
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
              "minLength": 0
            }
          },
          {
            "field": "u_开始时间",
            "id": "field_u_开始时间",
            "input": true,
            "label": "开始时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写开始时间",
                "required": true
              }
            ]
          },
          {
            "field": "u_结束时间",
            "id": "field_u_结束时间",
            "input": true,
            "label": "结束时间",
            "type": "date",
            "props": {},
            "rules": [
              {
                "message": "请填写结束时间",
                "required": true
              }
            ]
          },
          {
            "field": "u_总天数",
            "id": "field_u_总天数",
            "input": true,
            "label": "总天数",
            "type": "number",
            "props": {
              "placeholder": "请输入总天数",
              "min": -1000000000.0,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "u_银行账号币种",
            "id": "field_u_银行账号币种",
            "input": true,
            "label": "币种",
            "type": "select",
            "props": {
              "placeholder": "请选择银行账号币种",
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
                "message": "请填写币种",
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
        "label": "待摊合同确认单",
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

/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「银行账号申请」（id: ID01PH4Q5CJboX:PRESET_REQUISITION_TEAM_BUILDING）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01PH4Q5CJboX:PRESET_REQUISITION_TEAM_BUILDING",
  "key": "example_34",
  "name": "银行账号申请",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 18,
  "mappedCount": 17,
  "description": "易快报模板「银行账号申请」（申请事项 / requisition / 启用）：共 18 个控件，其中 17 个静态字段可渲染；已剔除 1 个当前不支持的控件（annotation）。",
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
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入申请事由",
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
            "field": "u_银行账号申请类型",
            "id": "field_u_银行账号申请类型",
            "input": true,
            "label": "申请类型",
            "type": "select",
            "props": {
              "placeholder": "请选择银行账号申请类型",
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
                "message": "请填写申请类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_开户主体",
            "id": "field_u_开户主体",
            "input": true,
            "label": "开户主体",
            "type": "select",
            "props": {
              "placeholder": "请选择开户主体",
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
          },
          {
            "field": "u_开户类型",
            "id": "field_u_开户类型",
            "input": true,
            "label": "开户类型",
            "type": "select",
            "props": {
              "placeholder": "请选择开户类型",
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
          },
          {
            "field": "u_注销主体",
            "id": "field_u_注销主体",
            "input": true,
            "label": "注销主体",
            "type": "select",
            "props": {
              "placeholder": "请选择注销主体",
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
          },
          {
            "field": "u_注销账户",
            "id": "field_u_注销账户",
            "input": true,
            "label": "注销账户",
            "type": "select",
            "props": {
              "placeholder": "请选择注销账户",
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
          },
          {
            "field": "u_开户名称",
            "id": "field_u_开户名称",
            "input": true,
            "label": "开户名称",
            "type": "input",
            "props": {
              "placeholder": "请输入开户名称",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_银行账号",
            "id": "field_u_银行账号",
            "input": true,
            "label": "银行账号",
            "type": "input",
            "props": {
              "placeholder": "请输入银行账号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_银行账号币种",
            "id": "field_u_银行账号币种",
            "input": true,
            "label": "银行账号币种",
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
              ],
              "hidden": true
            }
          },
          {
            "field": "u_联行号",
            "id": "field_u_联行号",
            "input": true,
            "label": "联行号",
            "type": "input",
            "props": {
              "placeholder": "请输入联行号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_账号简述",
            "id": "field_u_账号简述",
            "input": true,
            "label": "账号简述",
            "type": "input",
            "props": {
              "placeholder": "输入便于记忆和区分的文字，如：招行+尾号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_银行科目",
            "id": "field_u_银行科目",
            "input": true,
            "label": "银行科目",
            "type": "select",
            "props": {
              "placeholder": "请选择银行科目",
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
          },
          {
            "field": "requisitionMoney",
            "id": "field_requisitionMoney",
            "input": true,
            "label": "申请金额",
            "type": "number",
            "props": {
              "placeholder": "请输入申请金额",
              "min": 0.0,
              "max": 10000000000.0,
              "hidden": true
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
        "label": "银行账号申请",
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
            "field": "title",
            "id": "field_title",
            "input": true,
            "label": "申请事由",
            "type": "input",
            "props": {
              "placeholder": "请输入申请事由",
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
            "field": "u_银行账号申请类型",
            "id": "field_u_银行账号申请类型",
            "input": true,
            "label": "申请类型",
            "type": "select",
            "props": {
              "placeholder": "请选择银行账号申请类型",
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
                "message": "请填写申请类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_开户主体",
            "id": "field_u_开户主体",
            "input": true,
            "label": "开户主体",
            "type": "select",
            "props": {
              "placeholder": "请选择开户主体",
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
                "message": "请填写开户主体",
                "required": true
              }
            ]
          },
          {
            "field": "u_开户类型",
            "id": "field_u_开户类型",
            "input": true,
            "label": "开户类型",
            "type": "select",
            "props": {
              "placeholder": "请选择开户类型",
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
                "message": "请填写开户类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_注销主体",
            "id": "field_u_注销主体",
            "input": true,
            "label": "注销主体",
            "type": "select",
            "props": {
              "placeholder": "请选择注销主体",
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
                "message": "请填写注销主体",
                "required": true
              }
            ]
          },
          {
            "field": "u_注销账户",
            "id": "field_u_注销账户",
            "input": true,
            "label": "注销账户",
            "type": "select",
            "props": {
              "placeholder": "请选择注销账户",
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
                "message": "请填写注销账户",
                "required": true
              }
            ]
          },
          {
            "field": "u_开户名称",
            "id": "field_u_开户名称",
            "input": true,
            "label": "开户名称",
            "type": "input",
            "props": {
              "placeholder": "请输入开户名称",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
          },
          {
            "field": "u_银行账号",
            "id": "field_u_银行账号",
            "input": true,
            "label": "银行账号",
            "type": "input",
            "props": {
              "placeholder": "请输入银行账号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_银行账号币种",
            "id": "field_u_银行账号币种",
            "input": true,
            "label": "银行账号币种",
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
            }
          },
          {
            "field": "u_联行号",
            "id": "field_u_联行号",
            "input": true,
            "label": "联行号",
            "type": "input",
            "props": {
              "placeholder": "请输入联行号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_账号简述",
            "id": "field_u_账号简述",
            "input": true,
            "label": "账号简述",
            "type": "input",
            "props": {
              "placeholder": "输入便于记忆和区分的文字，如：招行+尾号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_银行科目",
            "id": "field_u_银行科目",
            "input": true,
            "label": "银行科目",
            "type": "select",
            "props": {
              "placeholder": "请选择银行科目",
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
            "field": "requisitionMoney",
            "id": "field_requisitionMoney",
            "input": true,
            "label": "申请金额",
            "type": "number",
            "props": {
              "placeholder": "请输入申请金额",
              "min": 0.0,
              "max": 10000000000.0
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
        "label": "银行账号申请",
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

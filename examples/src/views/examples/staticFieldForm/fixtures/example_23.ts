/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「二手车销售统一发票「自动开票」」（id: ID01WyHYmqTXj1）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01WyHYmqTXj1",
  "key": "example_23",
  "name": "二手车销售统一发票「自动开票」",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 50,
  "mappedCount": 41,
  "description": "易快报模板「二手车销售统一发票「自动开票」」（申请事项 / requisition / 启用）：共 50 个控件，其中 41 个静态字段可渲染；已剔除 9 个当前不支持的控件（dataLink, group, requisitionDetails, separator）。",
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
            "field": "u_开票方向",
            "id": "field_u_开票方向",
            "input": true,
            "label": "开票方向",
            "type": "select",
            "props": {
              "placeholder": "请选择开票方向",
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
                "message": "请填写开票方向",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否红冲",
            "id": "field_u_是否红冲",
            "input": true,
            "label": "是否红冲",
            "type": "select",
            "props": {
              "placeholder": "请选择是否红冲",
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
                "message": "请填写是否红冲",
                "required": true
              }
            ]
          },
          {
            "field": "u_红冲类型",
            "id": "field_u_红冲类型",
            "input": true,
            "label": "红冲类型",
            "type": "select",
            "props": {
              "placeholder": "请选择红冲类型",
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
            "field": "u_红冲原因",
            "id": "field_u_红冲原因",
            "input": true,
            "label": "红冲原因",
            "type": "select",
            "props": {
              "placeholder": "请选择红冲原因",
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
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "开票公司主体名称",
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
                "message": "请填写开票公司主体名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_开票公司名称",
            "id": "field_u_开票公司名称",
            "input": true,
            "label": "开票公司名称",
            "type": "input",
            "props": {
              "placeholder": "请输入开票公司名称",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_开票方税号",
            "id": "field_u_开票方税号",
            "input": true,
            "label": "开票方税号",
            "type": "input",
            "props": {
              "placeholder": "请输入开票方税号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_地址",
            "id": "field_u_地址",
            "input": true,
            "label": "地址",
            "type": "input",
            "props": {
              "placeholder": "请输入地址",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_电话",
            "id": "field_u_电话",
            "input": true,
            "label": "电话",
            "type": "input",
            "props": {
              "placeholder": "请输入电话",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_开户行",
            "id": "field_u_开户行",
            "input": true,
            "label": "开户行",
            "type": "input",
            "props": {
              "placeholder": "请输入开户行",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_账号",
            "id": "field_u_账号",
            "input": true,
            "label": "账号",
            "type": "input",
            "props": {
              "placeholder": "请输入账号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_开票类型",
            "id": "field_u_开票类型",
            "input": true,
            "label": "开票类型",
            "type": "select",
            "props": {
              "placeholder": "请选择开票类型",
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
            "field": "u_购买方类型",
            "id": "field_u_购买方类型",
            "input": true,
            "label": "购买方类型",
            "type": "select",
            "props": {
              "placeholder": "请选择购买方类型",
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
                "message": "请填写购买方类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否涉及集团内部公司",
            "id": "field_u_是否涉及集团内部公司",
            "input": true,
            "label": "是否涉及集团内部公司",
            "type": "select",
            "props": {
              "placeholder": "请选择是否涉及集团内部公司",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "hidden": true
            }
          },
          {
            "field": "u_收票方主体名称",
            "id": "field_u_收票方主体名称",
            "input": true,
            "label": "收票方主体名称",
            "type": "select",
            "props": {
              "placeholder": "请选择收票方主体名称",
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
            "field": "u_收票方名称",
            "id": "field_u_收票方名称",
            "input": true,
            "label": "收票方名称",
            "type": "input",
            "props": {
              "placeholder": "请输入收票方名称",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_收票方税号",
            "id": "field_u_收票方税号",
            "input": true,
            "label": "收票方税号",
            "type": "input",
            "props": {
              "placeholder": "收票方名称为企业（非自然人）时，收票方税号为必填项；收票方为个人时可不填",
              "maxLength": 18,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_收票方开户行",
            "id": "field_u_收票方开户行",
            "input": true,
            "label": "收票方开户行",
            "type": "input",
            "props": {
              "placeholder": "请输入收票方开户行",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_收票方银行账号",
            "id": "field_u_收票方银行账号",
            "input": true,
            "label": "收票方银行账号",
            "type": "input",
            "props": {
              "placeholder": "请输入收票方银行账号",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_收票方地址",
            "id": "field_u_收票方地址",
            "input": true,
            "label": "收票方地址",
            "type": "input",
            "props": {
              "placeholder": "请输入 收票方地址",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_收票方电话",
            "id": "field_u_收票方电话",
            "input": true,
            "label": "收票方电话",
            "type": "input",
            "props": {
              "placeholder": "请输入 收票方电话",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_购买方证件类型",
            "id": "field_u_购买方证件类型",
            "input": true,
            "label": "购买方证件类型",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方证件类型",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_购买人名称",
            "id": "field_u_购买人名称",
            "input": true,
            "label": "购买人名称",
            "type": "input",
            "props": {
              "placeholder": "请输入购买人名称",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_购买方证件号码",
            "id": "field_u_购买方证件号码",
            "input": true,
            "label": "购买方证件号码",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方证件号码",
              "maxLength": 18,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_购买方国籍",
            "id": "field_u_购买方国籍",
            "input": true,
            "label": "购买方国籍",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方国籍",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_购买方地址",
            "id": "field_u_购买方地址",
            "input": true,
            "label": "购买方地址",
            "type": "input",
            "props": {
              "placeholder": "请输入 购买方地址",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_购买方电话",
            "id": "field_u_购买方电话",
            "input": true,
            "label": "购买方电话",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方电话",
              "maxLength": 140,
              "minLength": 0,
              "hidden": true
            }
          },
          {
            "field": "u_原开票申请流程号",
            "id": "field_u_原开票申请流程号",
            "input": true,
            "label": "原开票申请流程号",
            "type": "input",
            "props": {
              "placeholder": "请输入原开票申请流程号",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
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
            "field": "u_发票备注栏",
            "id": "field_u_发票备注栏",
            "input": true,
            "label": "发票备注栏",
            "type": "input",
            "props": {
              "placeholder": "请输入发票备注栏",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_收票邮箱",
            "id": "field_u_收票邮箱",
            "input": true,
            "label": "收票邮箱",
            "type": "input",
            "props": {
              "placeholder": "请输入收票邮箱",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写收票邮箱",
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
          },
          {
            "field": "u_开票公司主体名称",
            "id": "field_u_开票公司主体名称",
            "input": true,
            "label": "开票公司主体名称",
            "type": "select",
            "props": {
              "placeholder": "请选择开票公司主体名称",
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
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_是否线下开票",
            "id": "field_u_是否线下开票",
            "input": true,
            "label": "是否自动开票",
            "type": "select",
            "props": {
              "placeholder": "请选择是否自动开票",
              "options": [
                {
                  "label": "是",
                  "value": "yes"
                },
                {
                  "label": "否",
                  "value": "no"
                }
              ],
              "hidden": true
            }
          },
          {
            "field": "u_开票单据模板",
            "id": "field_u_开票单据模板",
            "input": true,
            "label": "开票单据模板",
            "type": "select",
            "props": {
              "placeholder": "请选择开票单据模板",
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
              "disabled": true,
              "hidden": true
            }
          }
        ],
        "id": "root",
        "label": "二手车销售统一发票「自动开票」",
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
            "field": "u_开票方向",
            "id": "field_u_开票方向",
            "input": true,
            "label": "开票方向",
            "type": "select",
            "props": {
              "placeholder": "请选择开票方向",
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
                "message": "请填写开票方向",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否红冲",
            "id": "field_u_是否红冲",
            "input": true,
            "label": "是否红冲",
            "type": "select",
            "props": {
              "placeholder": "请选择是否红冲",
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
                "message": "请填写是否红冲",
                "required": true
              }
            ]
          },
          {
            "field": "u_红冲类型",
            "id": "field_u_红冲类型",
            "input": true,
            "label": "红冲类型",
            "type": "select",
            "props": {
              "placeholder": "请选择红冲类型",
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
                "message": "请填写红冲类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_红冲原因",
            "id": "field_u_红冲原因",
            "input": true,
            "label": "红冲原因",
            "type": "select",
            "props": {
              "placeholder": "请选择红冲原因",
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
                "message": "请填写红冲原因",
                "required": true
              }
            ]
          },
          {
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "开票公司主体名称",
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
                "message": "请填写开票公司主体名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_开票公司名称",
            "id": "field_u_开票公司名称",
            "input": true,
            "label": "开票公司名称",
            "type": "input",
            "props": {
              "placeholder": "请输入开票公司名称",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_开票方税号",
            "id": "field_u_开票方税号",
            "input": true,
            "label": "开票方税号",
            "type": "input",
            "props": {
              "placeholder": "请输入开票方税号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_地址",
            "id": "field_u_地址",
            "input": true,
            "label": "地址",
            "type": "input",
            "props": {
              "placeholder": "请输入地址",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_电话",
            "id": "field_u_电话",
            "input": true,
            "label": "电话",
            "type": "input",
            "props": {
              "placeholder": "请输入电话",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_开户行",
            "id": "field_u_开户行",
            "input": true,
            "label": "开户行",
            "type": "input",
            "props": {
              "placeholder": "请输入开户行",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_账号",
            "id": "field_u_账号",
            "input": true,
            "label": "账号",
            "type": "input",
            "props": {
              "placeholder": "请输入账号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_开票类型",
            "id": "field_u_开票类型",
            "input": true,
            "label": "开票类型",
            "type": "select",
            "props": {
              "placeholder": "请选择开票类型",
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
                "message": "请填写开票类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_购买方类型",
            "id": "field_u_购买方类型",
            "input": true,
            "label": "购买方类型",
            "type": "select",
            "props": {
              "placeholder": "请选择购买方类型",
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
                "message": "请填写购买方类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否涉及集团内部公司",
            "id": "field_u_是否涉及集团内部公司",
            "input": true,
            "label": "是否涉及集团内部公司",
            "type": "select",
            "props": {
              "placeholder": "请选择是否涉及集团内部公司",
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
                "message": "请填写是否涉及集团内部公司",
                "required": true
              }
            ]
          },
          {
            "field": "u_收票方主体名称",
            "id": "field_u_收票方主体名称",
            "input": true,
            "label": "收票方主体名称",
            "type": "select",
            "props": {
              "placeholder": "请选择收票方主体名称",
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
                "message": "请填写收票方主体名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_收票方名称",
            "id": "field_u_收票方名称",
            "input": true,
            "label": "收票方名称",
            "type": "input",
            "props": {
              "placeholder": "请输入收票方名称",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写收票方名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_收票方税号",
            "id": "field_u_收票方税号",
            "input": true,
            "label": "收票方税号",
            "type": "input",
            "props": {
              "placeholder": "收票方名称为企业（非自然人）时，收票方税号为必填项；收票方为个人时可不填",
              "maxLength": 18,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写收票方税号",
                "required": true
              }
            ]
          },
          {
            "field": "u_收票方开户行",
            "id": "field_u_收票方开户行",
            "input": true,
            "label": "收票方开户行",
            "type": "input",
            "props": {
              "placeholder": "请输入收票方开户行",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_收票方银行账号",
            "id": "field_u_收票方银行账号",
            "input": true,
            "label": "收票方银行账号",
            "type": "input",
            "props": {
              "placeholder": "请输入收票方银行账号",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_收票方地址",
            "id": "field_u_收票方地址",
            "input": true,
            "label": "收票方地址",
            "type": "input",
            "props": {
              "placeholder": "请输入 收票方地址",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_收票方电话",
            "id": "field_u_收票方电话",
            "input": true,
            "label": "收票方电话",
            "type": "input",
            "props": {
              "placeholder": "请输入 收票方电话",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_购买方证件类型",
            "id": "field_u_购买方证件类型",
            "input": true,
            "label": "购买方证件类型",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方证件类型",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写购买方证件类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_购买人名称",
            "id": "field_u_购买人名称",
            "input": true,
            "label": "购买人名称",
            "type": "input",
            "props": {
              "placeholder": "请输入购买人名称",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写购买人名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_购买方证件号码",
            "id": "field_u_购买方证件号码",
            "input": true,
            "label": "购买方证件号码",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方证件号码",
              "maxLength": 18,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写购买方证件号码",
                "required": true
              }
            ]
          },
          {
            "field": "u_购买方国籍",
            "id": "field_u_购买方国籍",
            "input": true,
            "label": "购买方国籍",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方国籍",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写购买方国籍",
                "required": true
              }
            ]
          },
          {
            "field": "u_购买方地址",
            "id": "field_u_购买方地址",
            "input": true,
            "label": "购买方地址",
            "type": "input",
            "props": {
              "placeholder": "请输入 购买方地址",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写购买方地址",
                "required": true
              }
            ]
          },
          {
            "field": "u_购买方电话",
            "id": "field_u_购买方电话",
            "input": true,
            "label": "购买方电话",
            "type": "input",
            "props": {
              "placeholder": "请输入购买方电话",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写购买方电话",
                "required": true
              }
            ]
          },
          {
            "field": "u_原开票申请流程号",
            "id": "field_u_原开票申请流程号",
            "input": true,
            "label": "原开票申请流程号",
            "type": "input",
            "props": {
              "placeholder": "请输入原开票申请流程号",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
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
            "field": "u_发票备注栏",
            "id": "field_u_发票备注栏",
            "input": true,
            "label": "发票备注栏",
            "type": "input",
            "props": {
              "placeholder": "请输入发票备注栏",
              "maxLength": 140,
              "minLength": 0
            }
          },
          {
            "field": "u_收票邮箱",
            "id": "field_u_收票邮箱",
            "input": true,
            "label": "收票邮箱",
            "type": "input",
            "props": {
              "placeholder": "请输入收票邮箱",
              "maxLength": 140,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写收票邮箱",
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
          },
          {
            "field": "u_开票公司主体名称",
            "id": "field_u_开票公司主体名称",
            "input": true,
            "label": "开票公司主体名称",
            "type": "select",
            "props": {
              "placeholder": "请选择开票公司主体名称",
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
              "disabled": true
            }
          },
          {
            "field": "u_是否线下开票",
            "id": "field_u_是否线下开票",
            "input": true,
            "label": "是否自动开票",
            "type": "select",
            "props": {
              "placeholder": "请选择是否自动开票",
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
                "message": "请填写是否自动开票",
                "required": true
              }
            ]
          },
          {
            "field": "u_开票单据模板",
            "id": "field_u_开票单据模板",
            "input": true,
            "label": "开票单据模板",
            "type": "select",
            "props": {
              "placeholder": "请选择开票单据模板",
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
              "disabled": true
            }
          }
        ],
        "id": "root",
        "label": "二手车销售统一发票「自动开票」",
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

/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「财务资料申请单」（id: ID01PH4Q5CJboX:PRESET_REQUISITION_TRIP）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01PH4Q5CJboX:PRESET_REQUISITION_TRIP",
  "key": "example_33",
  "name": "财务资料申请单",
  "groupName": "申请事项",
  "type": "requisition",
  "active": true,
  "componentCount": 14,
  "mappedCount": 14,
  "description": "易快报模板「财务资料申请单」（申请事项 / requisition / 启用）：共 14 个控件，其中 14 个静态字段可渲染；已剔除 0 个当前不支持的控件（无）。",
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
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "公司主体",
            "type": "select",
            "props": {
              "placeholder": "请选择资料申请主体",
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
            "field": "u_资料申请主体",
            "id": "field_u_资料申请主体",
            "input": true,
            "label": "公司主体",
            "type": "select",
            "props": {
              "placeholder": "请选择资料申请主体",
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
                "message": "请填写公司主体",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否采货侠",
            "id": "field_u_是否采货侠",
            "input": true,
            "label": "是否采货侠",
            "type": "select",
            "props": {
              "placeholder": "请选择是否采货侠",
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
                "message": "请填写是否采货侠",
                "required": true
              }
            ]
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "申请事由及详细资料说明",
            "type": "textarea",
            "props": {
              "placeholder": "请详细说明您所需资料的情况，如所需资料的时间范围、数据范围、内容范围以及特殊注意事项等",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写申请事由及详细资料说明",
                "required": true
              }
            ]
          },
          {
            "field": "u_财务资料",
            "id": "field_u_财务资料",
            "input": true,
            "label": "申请资料类型",
            "type": "select",
            "props": {
              "placeholder": "请选择财务资料",
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
                "message": "请填写申请资料类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_申请资料类型",
            "id": "field_u_申请资料类型",
            "input": true,
            "label": "申请资料类型",
            "type": "select",
            "props": {
              "placeholder": "请选择申请资料类型",
              "options": [
                {
                  "label": "选项A",
                  "value": "a"
                },
                {
                  "label": "选项B",
                  "value": "b"
                }
              ],
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
          }
        ],
        "id": "root",
        "label": "财务资料申请单",
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
            "field": "法人实体",
            "id": "field_法人实体",
            "input": true,
            "label": "公司主体",
            "type": "select",
            "props": {
              "placeholder": "请选择资料申请主体",
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
            "field": "u_资料申请主体",
            "id": "field_u_资料申请主体",
            "input": true,
            "label": "公司主体",
            "type": "select",
            "props": {
              "placeholder": "请选择资料申请主体",
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
                "message": "请填写公司主体",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否采货侠",
            "id": "field_u_是否采货侠",
            "input": true,
            "label": "是否采货侠",
            "type": "select",
            "props": {
              "placeholder": "请选择是否采货侠",
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
                "message": "请填写是否采货侠",
                "required": true
              }
            ]
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "申请事由及详细资料说明",
            "type": "textarea",
            "props": {
              "placeholder": "请详细说明您所需资料的情况，如所需资料的时间范围、数据范围、内容范围以及特殊注意事项等",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写申请事由及详细资料说明",
                "required": true
              }
            ]
          },
          {
            "field": "u_财务资料",
            "id": "field_u_财务资料",
            "input": true,
            "label": "申请资料类型",
            "type": "select",
            "props": {
              "placeholder": "请选择财务资料",
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
                "message": "请填写申请资料类型",
                "required": true
              }
            ]
          },
          {
            "field": "u_申请资料类型",
            "id": "field_u_申请资料类型",
            "input": true,
            "label": "申请资料类型",
            "type": "select",
            "props": {
              "placeholder": "请选择申请资料类型",
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
          }
        ],
        "id": "root",
        "label": "财务资料申请单",
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

/* eslint-disable */
// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
// 来源：易快报模板「个人费用报销单-测试」（id: ID01T3K2IwTdVB）
import type { StaticFormExample } from '../types';

const example: StaticFormExample = {
  "templateId": "ID01T3K2IwTdVB",
  "key": "example_06",
  "name": "个人费用报销单-测试",
  "groupName": "个人费用",
  "type": "expense",
  "active": false,
  "componentCount": 30,
  "mappedCount": 25,
  "description": "易快报模板「个人费用报销单-测试」（个人费用 / expense / 停用）：共 30 个控件，其中 25 个静态字段可渲染；已剔除 5 个当前不支持的控件（annotation, city, details, payeeInfo）。",
  "visiblePageSchema": {
    "canvas": {
      "mode": "desktop"
    },
    "schemas": [
      {
        "children": [
          {
            "field": "expenseLink",
            "id": "field_expenseLink",
            "input": true,
            "label": "关联申请",
            "type": "select",
            "props": {
              "placeholder": "请选择关联申请",
              "options": [
                {
                  "label": "选项1",
                  "value": "opt_1"
                },
                {
                  "label": "选项2",
                  "value": "opt_2"
                }
              ]
            }
          },
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
            "label": "付款公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择付款公司名称",
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
                "message": "请填写付款公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否含纸质票据",
            "id": "field_u_是否含纸质票据",
            "input": true,
            "label": "是否含纸质票据",
            "type": "select",
            "props": {
              "placeholder": "请选择是否含纸质票据",
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
                "message": "请填写是否含纸质票据",
                "required": true
              }
            ]
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "textarea",
            "props": {
              "placeholder": "请输入支出事由",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写支出事由",
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
              "placeholder": "如报销事项与发票不匹配，则在此处填写真实用途",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            }
          },
          {
            "field": "u_是否代报销",
            "id": "field_u_是否代报销",
            "input": true,
            "label": "是否代报销",
            "type": "select",
            "props": {
              "placeholder": "请选择是否代报销",
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
                "message": "请填写是否代报销",
                "required": true
              }
            ]
          },
          {
            "field": "u_实际报销人",
            "id": "field_u_实际报销人",
            "input": true,
            "label": "实际报销人",
            "type": "select",
            "props": {
              "placeholder": "请选择实际报销人",
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
            "field": "u_实际报销人部门",
            "id": "field_u_实际报销人部门",
            "input": true,
            "label": "实际报销部门",
            "type": "select",
            "props": {
              "placeholder": "请选择实际报销部门",
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
              "hidden": true
            }
          },
          {
            "field": "u_是否境外付款",
            "id": "field_u_是否境外付款",
            "input": true,
            "label": "是否境外付款",
            "type": "select",
            "props": {
              "placeholder": "请选择是否境外付款",
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
                "message": "请填写是否境外付款",
                "required": true
              }
            ]
          },
          {
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "附件（非发票）",
            "type": "upload-file",
            "props": {}
          },
          {
            "field": "u_付款金额",
            "id": "field_u_付款金额",
            "input": true,
            "label": "付款金额",
            "type": "number",
            "props": {
              "placeholder": "请输入付款金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_发票金额",
            "id": "field_u_发票金额",
            "input": true,
            "label": "发票金额",
            "type": "number",
            "props": {
              "placeholder": "请输入发票金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "u_摘要",
            "id": "field_u_摘要",
            "input": true,
            "label": "银行摘要",
            "type": "input",
            "props": {
              "placeholder": "请输入摘要",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true,
              "hidden": true
            }
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
            "field": "u_申请人归属公司",
            "id": "field_u_申请人归属公司",
            "input": true,
            "label": "申请人归属公司",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人归属公司",
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
            "field": "u_二级领导",
            "id": "field_u_二级领导",
            "input": true,
            "label": "二级上级",
            "type": "select",
            "props": {
              "placeholder": "请选择二级上级",
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
            "field": "u_是否必须有票",
            "id": "field_u_是否必须有票",
            "input": true,
            "label": "是否必须有票",
            "type": "select",
            "props": {
              "placeholder": "请选择是否必须有票",
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
              "disabled": true,
              "hidden": true
            }
          },
          {
            "field": "legalEntityMultiCurrency",
            "id": "field_legalEntityMultiCurrency",
            "input": true,
            "label": "法人实体多币种",
            "type": "select",
            "props": {
              "placeholder": "请选择法人实体多币种",
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
        "label": "个人费用报销单-测试",
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
            "field": "expenseLink",
            "id": "field_expenseLink",
            "input": true,
            "label": "关联申请",
            "type": "select",
            "props": {
              "placeholder": "请选择关联申请",
              "options": [
                {
                  "label": "选项1",
                  "value": "opt_1"
                },
                {
                  "label": "选项2",
                  "value": "opt_2"
                }
              ]
            }
          },
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
            "label": "付款公司名称",
            "type": "select",
            "props": {
              "placeholder": "请选择付款公司名称",
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
                "message": "请填写付款公司名称",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否含纸质票据",
            "id": "field_u_是否含纸质票据",
            "input": true,
            "label": "是否含纸质票据",
            "type": "select",
            "props": {
              "placeholder": "请选择是否含纸质票据",
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
                "message": "请填写是否含纸质票据",
                "required": true
              }
            ]
          },
          {
            "field": "u_支出事由",
            "id": "field_u_支出事由",
            "input": true,
            "label": "支出事由",
            "type": "textarea",
            "props": {
              "placeholder": "请输入支出事由",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            },
            "rules": [
              {
                "message": "请填写支出事由",
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
              "placeholder": "如报销事项与发票不匹配，则在此处填写真实用途",
              "rows": 3,
              "maxLength": 300,
              "minLength": 0
            }
          },
          {
            "field": "u_是否代报销",
            "id": "field_u_是否代报销",
            "input": true,
            "label": "是否代报销",
            "type": "select",
            "props": {
              "placeholder": "请选择是否代报销",
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
                "message": "请填写是否代报销",
                "required": true
              }
            ]
          },
          {
            "field": "u_实际报销人",
            "id": "field_u_实际报销人",
            "input": true,
            "label": "实际报销人",
            "type": "select",
            "props": {
              "placeholder": "请选择实际报销人",
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
                "message": "请填写实际报销人",
                "required": true
              }
            ]
          },
          {
            "field": "u_实际报销人部门",
            "id": "field_u_实际报销人部门",
            "input": true,
            "label": "实际报销部门",
            "type": "select",
            "props": {
              "placeholder": "请选择实际报销部门",
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
                "message": "请填写实际报销部门",
                "required": true
              }
            ]
          },
          {
            "field": "u_是否境外付款",
            "id": "field_u_是否境外付款",
            "input": true,
            "label": "是否境外付款",
            "type": "select",
            "props": {
              "placeholder": "请选择是否境外付款",
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
                "message": "请填写是否境外付款",
                "required": true
              }
            ]
          },
          {
            "field": "attachments",
            "id": "field_attachments",
            "input": true,
            "label": "附件（非发票）",
            "type": "upload-file",
            "props": {}
          },
          {
            "field": "u_付款金额",
            "id": "field_u_付款金额",
            "input": true,
            "label": "付款金额",
            "type": "number",
            "props": {
              "placeholder": "请输入付款金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "u_发票金额",
            "id": "field_u_发票金额",
            "input": true,
            "label": "发票金额",
            "type": "number",
            "props": {
              "placeholder": "请输入发票金额",
              "min": 0.01,
              "max": 10000000000.0,
              "disabled": true
            }
          },
          {
            "field": "u_摘要",
            "id": "field_u_摘要",
            "input": true,
            "label": "银行摘要",
            "type": "input",
            "props": {
              "placeholder": "请输入摘要",
              "maxLength": 140,
              "minLength": 0,
              "disabled": true
            }
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
            "field": "u_申请人归属公司",
            "id": "field_u_申请人归属公司",
            "input": true,
            "label": "申请人归属公司",
            "type": "select",
            "props": {
              "placeholder": "请选择申请人归属公司",
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
                "message": "请填写申请人归属公司",
                "required": true
              }
            ]
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
            "field": "u_二级领导",
            "id": "field_u_二级领导",
            "input": true,
            "label": "二级上级",
            "type": "select",
            "props": {
              "placeholder": "请选择二级上级",
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
            "field": "u_是否必须有票",
            "id": "field_u_是否必须有票",
            "input": true,
            "label": "是否必须有票",
            "type": "select",
            "props": {
              "placeholder": "请选择是否必须有票",
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
              "disabled": true
            }
          },
          {
            "field": "legalEntityMultiCurrency",
            "id": "field_legalEntityMultiCurrency",
            "input": true,
            "label": "法人实体多币种",
            "type": "select",
            "props": {
              "placeholder": "请选择法人实体多币种",
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
        "label": "个人费用报销单-测试",
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

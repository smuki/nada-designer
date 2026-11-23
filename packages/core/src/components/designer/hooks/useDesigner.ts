import type {
  ComponentSchema,
  DesignerState,
  PageSchema,
} from '@nada-designer/types';

import { reactive, ref, watchEffect } from 'vue';

import { useClipboard } from '@nada-designer/hooks';
import {
  createPageManager,
  pluginManager,
  useRevoke,
} from '@nada-designer/manager';
import {
  deepClone,
  deepCompareAndModify,
  deepEqual,
  findSchemaById,
  findSchemaInfoById,
  findSchemas,
  getMatchedById,
} from '@nada-designer/utils';

/** 默认页面脚本 */
const DEFAULT_SCRIPT = `const { defineExpose, find } = nada;

function test (){
    console.log('test')
}

// 通过defineExpose暴露的函数或者属性
defineExpose({
 test
})`;

/**
 * 创建自由模式的 page 根节点
 */
function createPageRoot(): ComponentSchema {
  return {
    id: 'root',
    label: '页面',
    props: {},
    type: 'page',
    children: [],
  };
}

/**
 * 创建受控模式的 form 根节点
 * @description 深拷贝当前 UI 库 form 的 defaultSchema，覆盖 id / name / children（规格 D38）
 */
function createControlledFormRoot(): ComponentSchema {
  const formConfig = pluginManager.component.getComponentConfigByType('form');
  const base = formConfig?.defaultSchema
    ? deepClone(formConfig.defaultSchema)
    : createPageRoot();

  return {
    ...base,
    id: 'root',
    label: base.label ?? '表单',
    props: { ...base.props, name: 'default' },
    type: 'form',
    children: [],
  };
}

export function useDesigner(
  props,
  emit,
  designMode: 'controlled' | 'free' = 'free',
) {
  const ready = ref<boolean>(false);
  const pageManager = createPageManager();
  const pageSchema = pageManager.pageSchema;

  /** 默认页面数据（实例级，避免多实例互相污染） */
  let innerDefaultSchema: PageSchema =
    props.defaultSchema ??
    (designMode === 'controlled'
      ? {
          businessObject: props.businessObject,
          schemas: [createControlledFormRoot()],
          script: DEFAULT_SCRIPT,
        }
      : { schemas: [createPageRoot()], script: DEFAULT_SCRIPT });

  const state = reactive<DesignerState>({
    disabledHover: false,
    hoverNode: null,
    matched: [],
    selectedNode: null,
  });
  /** 选中动作版本号：同一节点被再次选中时也能触发属性面板展示 */
  const selectionVersion = ref(0);
  const revoke = useRevoke(pageSchema, state, setSelectedNode);

  // 使用封装的clipboard hook（受控模式整体禁止复制/剪切/粘贴）
  const { duplicate } = useClipboard(
    pageSchema,
    setSelectedNode,
    (message) => revoke.push(message),
    { canMutate: () => designMode === 'free' },
  );

  const canvasConfigs = {
    desktop: {},
    mobile: {
      mode: 'mobile',
      width: '390px',
    },
    tablet: {
      mode: 'tablet',
      width: '780px',
    },
  };

  // 更新初始化数据
  watchEffect(() => {
    if (designMode !== 'controlled') {
      // 如果props.defaultSchema有值，则优先使用props.defaultSchema
      if (props.defaultSchema) {
        innerDefaultSchema = props.defaultSchema;
      } else if (props.formMode) {
        // 切换表单模式默认schema数据
        innerDefaultSchema.schemas = pluginManager.designer.formSchema;
        pluginManager.component.hide('form');
      }
      if (!props.formMode) {
        pluginManager.component.show('form');
      }
    }
    const canvasMode = props.canvasMode ?? 'desktop';
    // 根据canvasMode设置对应的画布属性
    pageSchema.canvas = {
      mode: canvasMode,
      ...canvasConfigs[canvasMode],
      ...innerDefaultSchema.canvas,
    };
    updateFormName();
    // 记录默认组件id
    pageManager.setDefaultComponentIds(innerDefaultSchema.schemas);
  });

  // 设计模式
  pageManager.setDesignMode();

  /**
   * 表单模式下通过数据表更新表单name
   */
  function updateFormName() {
    if (!props.formMode || !props.tableJson) return;

    const dataTable = props.tableJson.find(
      (item) => item.tableType === 'parent',
    );
    if (!dataTable) return;

    const formSchemas = findSchemas(
      pageSchema.schemas,
      (schema) => schema.type === 'form',
    ) as ComponentSchema[];

    if (formSchemas.length === 1) {
      formSchemas[0].props.name = dataTable.tableName;
    }
  }

  /**
   * 复制并立即粘贴节点（复制当前节点）
   */
  function handleDuplicate() {
    return duplicate(state.selectedNode?.id);
  }

  /**
   * 删除元素
   */
  function handleDelete() {
    // 如果未选中节点或选中的是根节点则不执行删除
    if (
      !state.selectedNode?.id ||
      state.selectedNode.id === pageSchema.schemas[0].id
    ) {
      return;
    }

    const data = findSchemaInfoById(pageSchema.schemas, state.selectedNode.id);
    if (!data) return false;

    let { index, list } = data;
    list.splice(index, 1);

    if (index === list.length) {
      index--;
    }

    setSelectedNode(list[index]);
    revoke.push('删除组件');
  }

  /**
   * 选中节点
   * @param schema 要选中的组件
   */
  function setSelectedNode(schema?: ComponentSchema) {
    selectionVersion.value += 1;

    if (!schema) {
      schema = pageSchema.schemas[0];
    }
    // 如果选中的节点是锁定的，则不执行选中操作
    if (isComponentLocked(schema)) {
      const matched = getMatchedById(
        pageManager.pageSchema.schemas,
        schema?.id || '',
      );
      // 排除最后一个节点
      const lastIndex = matched.length - 2;

      // 倒序查找符合条件的节点，排除最后一个节点
      for (let i = lastIndex; i >= 0; i--) {
        if (!isComponentLocked(matched[i])) {
          schema = matched[i];
          break;
        }
      }
    }

    // 通过ID查找该组件在页面结构中是否存在
    const selectedSchema = findSchemaById(pageSchema.schemas, schema?.id || '');

    // 获取从根节点到当前节点的路径匹配数组
    state.matched = getMatchedById(
      pageSchema.schemas,
      selectedSchema?.id || '',
    );
    // 更新选中节点状态
    state.selectedNode = selectedSchema;
  }

  /**
   * 检查组件是否锁定
   * @param schema
   */
  function isComponentLocked(schema: ComponentSchema) {
    // 判断组件是否锁定
    return (
      schema.status?.lock || pluginManager.component.getLocked(schema.type)
    );
  }

  /**
   * 设置悬停节点
   * @param schema 悬停的组件模式
   */
  function setHoverNode(schema: ComponentSchema | null = null) {
    if (!schema || state.disabledHover) {
      state.hoverNode = null;
      return false;
    }
    // 如果选中的节点是锁定的，则不执行选中操作
    if (isComponentLocked(schema)) {
      const matched = getMatchedById(
        pageManager.pageSchema.schemas,
        schema?.id || '',
      );
      // 排除最后一个节点
      const lastIndex = matched.length - 2;

      // 倒序查找符合条件的节点，排除最后一个节点
      for (let i = lastIndex; i >= 0; i--) {
        if (!isComponentLocked(matched[i])) {
          schema = matched[i];
          break;
        }
      }
    }

    if (schema?.id === state.hoverNode?.id) {
      return false;
    }

    state.hoverNode = schema;
  }

  /**
   * 解析当前业务对象：schema 优先 → defaultSchema → prop
   * @param schemaBusinessObject 页面 schema 中的业务对象
   */
  function resolveBusinessObject(
    schemaBusinessObject?: string,
  ): string | undefined {
    return (
      schemaBusinessObject ??
      props.defaultSchema?.businessObject ??
      props.businessObject ??
      undefined
    );
  }

  /**
   * 回填 businessObject
   * @description setData / 导入走 deepCompareAndModify（默认删除缺失键），之后必须回填（规格 §11.1）
   * @param schemaBusinessObject 页面 schema 中的业务对象
   */
  function applyBusinessObject(schemaBusinessObject?: string) {
    pageSchema.businessObject = resolveBusinessObject(schemaBusinessObject);
  }

  /**
   * 重置页面数据为默认数据
   */
  function reset() {
    // 判断数据是否已修改，如果未修改，则取消重置操作
    if (
      deepEqual(pageSchema.schemas, innerDefaultSchema.schemas) &&
      pageSchema.script === innerDefaultSchema.script
    )
      return;

    // 调用 deepCompareAndModify 函数比较并修改
    deepCompareAndModify(pageSchema.schemas, innerDefaultSchema.schemas);
    // 更新 script
    pageSchema.script = innerDefaultSchema.script;
    // 选中根节点
    setSelectedNode(pageSchema.schemas[0]);
    revoke.push('重置操作', true);

    emit('reset', pageSchema);
  }

  /**
   * 初始化页面数据
   */
  function init() {
    // 初始化默认节点
    pageSchema.schemas = deepClone(innerDefaultSchema.schemas);
    // 记录业务对象归属
    pageSchema.businessObject = resolveBusinessObject();
    // 选中根节点
    setSelectedNode(pageSchema.schemas[0]);
    // 初始化必须立即入栈：否则 200ms 内的第一次编辑会与之合并，导致首个操作无法撤销
    revoke.push('初始化', true);
  }

  init();

  return {
    applyBusinessObject,
    handleDelete,
    handleDuplicate,
    pageManager,
    pageSchema,
    ready,
    reset,
    revoke,
    selectionVersion,
    setHoverNode,
    setSelectedNode,
    state,
  };
}

import type { ComponentSchema } from '@nada-designer/types';

import { ref } from 'vue';

import {
  deepClone,
  findSchemaInfoById,
  generateNewSchema,
} from '@nada-designer/utils';

export interface UseClipboardOptions {
  /** 是否允许变更（受控模式返回 false 时整体静默禁止）；默认允许 */
  canMutate?: () => boolean;
}

/**
 * 提供组件复制粘贴功能的Hook
 * @param pageSchema 页面Schema数据
 * @param setSelectedNode 设置选中节点的函数
 * @param revokePush 撤销栈推送函数
 * @param options 额外限制：例如受控模式下整体禁止复制/剪切/粘贴
 */
export function useClipboard(
  pageSchema: any,
  setSelectedNode: (schema?: ComponentSchema) => void,
  revokePush: (message: string) => void,
  options: UseClipboardOptions = {},
) {
  // 剪贴板节点
  const clipboardNode = ref<ComponentSchema | null>(null);

  /**
   * 是否允许变更（默认允许）
   */
  function canMutate(): boolean {
    return options.canMutate ? options.canMutate() : true;
  }

  /**
   * 复制选中节点到剪贴板
   * @param selectedNode 当前选中的节点
   */
  function copy(selectedNode: ComponentSchema | null): boolean {
    if (!canMutate() || !selectedNode?.id) return false;
    clipboardNode.value = deepClone(selectedNode);
    return true;
  }

  /**
   * 粘贴剪贴板中的节点
   * @param selectedNodeId 当前选中节点ID
   */
  function paste(selectedNodeId: null | string | undefined): boolean {
    if (!canMutate() || !clipboardNode.value) return false;

    const data = findSchemaInfoById(
      pageSchema.schemas,
      selectedNodeId ?? 'root',
    );
    if (!data) return false;

    const { index, list } = data;
    const node = generateNewSchema(clipboardNode.value);
    list.splice(index + 1, 0, node);
    setSelectedNode(node);

    revokePush('粘贴组件');
    return true;
  }

  /**
   * 复制并立即粘贴节点（复制当前节点）
   * @param selectedNodeId 当前选中节点ID
   */
  function duplicate(selectedNodeId: null | string | undefined): boolean {
    if (!canMutate()) return false;
    const data = findSchemaInfoById(
      pageSchema.schemas,
      selectedNodeId ?? 'root',
    );
    if (!data) return false;

    const { index, schema, list } = data;
    const node = generateNewSchema(schema);
    list.splice(index + 1, 0, node);
    setSelectedNode(node);

    revokePush('复制组件');
    return true;
  }

  /**
   * 剪切选中节点到剪贴板
   * @param selectedNode 当前选中的节点
   */
  function cut(selectedNode: ComponentSchema | null): boolean {
    if (!canMutate() || !selectedNode?.id) return false;

    // 复制节点到剪贴板
    clipboardNode.value = deepClone(selectedNode);

    // 查找并删除原节点
    const data = findSchemaInfoById(pageSchema.schemas, selectedNode.id);
    if (!data) return false;

    const { index, list } = data;
    list.splice(index, 1);

    // 如果删除的是列表中最后一个元素，选中前一个元素
    if (index === list.length) {
      setSelectedNode(list[index - 1]);
    } else {
      setSelectedNode(list[index]);
    }

    revokePush('剪切组件');
    return true;
  }

  return {
    clipboardNode,
    copy,
    cut,
    duplicate,
    paste,
  };
}

import type { Revoke } from '@nada-designer/manager/src/revoke';
import type { DesignerProps, PageSchema } from '@nada-designer/types';

import type { InjectionKey, Ref } from 'vue';

import type { BusinessFieldsContext } from './useBusinessFields';

import { inject } from 'vue';

export interface DesignerContext {
  /** 业务字段元数据状态（受控模式） */
  businessFields: BusinessFieldsContext;
  /** 冻结的设计模式快照（受控模式禁止切换） */
  designMode: 'controlled' | 'free';
  handleDelete: () => void;
  handleDuplicate: () => void;
  handleImported: (data: PageSchema) => void;
  handleToggleDeviceMode: (mode: string) => void;
  /** 导入页面数据：受控模式先校验并加载元数据，失败不应用 */
  importSchema: (data: PageSchema) => Promise<boolean>;
  pageSchema: PageSchema;
  preview: () => void;
  props: DesignerProps;
  reset: () => void;
  revoke: Revoke;
  save: () => void;
  /** 选中动作版本号（同一节点再次选中也会 +1） */
  selectionVersion: Ref<number>;
  setDisabledHover: (disabledHover: boolean) => void;
  setHoverNode: (schema: any) => void;
  setSelectedNode: (schema: any) => void;
  state: {
    disabledHover: boolean;
    hoverNode: any;
    matched: any[];
    selectedNode: any;
  };
}

export const DESIGNER_CONTEXT_KEY: InjectionKey<DesignerContext> =
  Symbol('designerContext');

export function useDesignerContext() {
  const designerContext = inject<DesignerContext>(DESIGNER_CONTEXT_KEY);

  if (!designerContext) {
    throw new Error(
      'useDesignerContext must be used within a Designer component',
    );
  }
  return designerContext;
}

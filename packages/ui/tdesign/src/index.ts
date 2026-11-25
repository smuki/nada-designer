import type { PluginManager } from '@nada-designer/manager';
import type { SetupConfig } from '@nada-designer/types';

// 注册 tdesign-vue-next ui
import { pluginManager as pManager } from '@nada-designer/manager';
import { MessagePlugin } from 'tdesign-vue-next';

import Button from './button';
import Card from './card';
import Checkbox from './checkbox';
import Col from './col';
import DatePicker from './date-picker';
import Form from './form';
import FormItem from './form-item';
import Input from './input';
import InputNumber from './input-number';
import Modal from './modal';
import Radio from './radio';
import Row from './row';
import Select from './select';
import Slider from './slider';
import Switch from './switch';
import Textarea from './textarea';

// TDesign 基础样式变量（组件级样式由 tdesign 组件自身按需引入）
import 'tdesign-vue-next/es/style/index.css';
// 引入样式
import './index.less';

export function setupTDesign(
  pluginManager: PluginManager = pManager,
  config: SetupConfig = {},
): void {
  // 预留：上传组件接入后在此覆盖默认上传地址，与其它适配包保持一致
  void config;

  // 设计器外壳与属性面板会按固定 type 查找的基础组件
  pluginManager.component.add(
    'FormItem',
    async () => (await import('tdesign-vue-next')).FormItem,
  );

  const componentArray = [
    Form,
    FormItem,
    Input,
    Textarea,
    InputNumber,
    Radio,
    Checkbox,
    Select,
    Slider,
    Switch,
    DatePicker,
    Button,
    Card,
    Row,
    Col,
    Modal,
  ];

  componentArray.forEach((item) => {
    pluginManager.component.register(item);
    pluginManager.component.addBaseComponentType(item.defaultSchema.type);
  });

  // 注册全局提示函数
  pluginManager.global.$message = {
    error: MessagePlugin.error,
    info: MessagePlugin.info,
    success: MessagePlugin.success,
    warning: MessagePlugin.warning,
  };

  // ui初始化完成。
  pluginManager.designer.setInitialized(true);
}

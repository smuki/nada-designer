import type { PluginManager } from '@nada-designer/manager';
import type { SetupConfig } from '@nada-designer/types';

import { watchEffect } from 'vue';

// 注册 tdesign-vue-next ui
import { pluginManager as pManager } from '@nada-designer/manager';
import { MessagePlugin } from 'tdesign-vue-next';

import Button from './button';
import Card from './card';
import Cascader from './cascader';
import Checkbox from './checkbox';
import Col from './col';
import Collapse from './collapse';
import CollapseItem from './collapse-item';
import ColorPicker from './color-picker';
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
import TabPane from './tab-pane';
import Tabs from './tabs';
import Textarea from './textarea';
import TimePicker from './time-picker';
import UploadFile from './upload-file';
import UploadImage from './upload-image';

// TDesign 基础样式变量（组件级样式由 tdesign 组件自身按需引入）
import 'tdesign-vue-next/es/style/index.css';
// 引入样式
import './index.less';

export function setupTDesign(
  pluginManager: PluginManager = pManager,
  config: SetupConfig = {},
): void {
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
    DatePicker,
    Select,
    Switch,
    ColorPicker,
    Cascader,
    Slider,
    UploadFile,
    UploadImage,
    TimePicker,
    Button,
    Card,
    Row,
    Col,
    Collapse,
    CollapseItem,
    Modal,
    Tabs,
    TabPane,
  ];

  const { uploadFile, uploadImage } = config;
  // 若配置了图片上传地址，则覆盖上传组件的默认接口地址
  if (uploadImage) {
    UploadImage.defaultSchema.props = {
      ...UploadImage.defaultSchema.props,
      action: uploadImage,
    };
  }
  // 若配置了文件上传地址，则覆盖上传组件的默认接口地址
  if (uploadFile) {
    UploadFile.defaultSchema.props = {
      ...UploadFile.defaultSchema.props,
      action: uploadFile,
    };
  }

  // 更新默认上传地址相关配置：全局配置优先，命中时移除属性面板里的请求地址项
  watchEffect(() => {
    if (pluginManager.global.uploadImage) {
      UploadImage.config.attribute = UploadImage.config.attribute?.filter(
        (item) => item.field !== 'props.action',
      );
    }
    if (pluginManager.global.uploadFile) {
      UploadFile.config.attribute = UploadFile.config.attribute?.filter(
        (item) => item.field !== 'props.action',
      );
    }
  });

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

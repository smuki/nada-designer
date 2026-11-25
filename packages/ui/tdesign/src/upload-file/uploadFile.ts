import type { ComponentSchema } from '@nada-designer/types';
import type { UploadFile, UploadProps } from 'tdesign-vue-next';

import type { PropType } from 'vue';

import { computed, defineComponent, h, ref, watch } from 'vue';

import { pluginManager } from '@nada-designer/manager';
import { getFileNameByUrl } from '@nada-designer/utils';
import { MessagePlugin, Upload as TUpload } from 'tdesign-vue-next';

import { normalizeSize, sanitizeAttrs } from '../utils/attrs';

/**
 * 上传文件组件
 *
 * 设计器保存的值为逗号拼接的 url 字符串，TDesign 的组件模型为 UploadFile[]，
 * 这里负责两种形态之间的互相转换。
 */
export default defineComponent({
  emits: ['update:modelValue', 'change'],
  inheritAttrs: false,
  props: {
    componentSchema: {
      default: () => ({}),
      required: true,
      type: Object as PropType<ComponentSchema>,
    },
    modelValue: {
      default: '',
      type: String,
    },
  },
  setup(props, { attrs, emit }) {
    // TDesign 的文件列表
    const fileList = ref<UploadFile[]>([]);
    // 最近一次同步给设计器的值，用于避免双向同步的回环
    let urlString = '';

    // 文件列表 -> 逗号拼接的 url 字符串，仅保留上传成功的文件
    const toUrlString = (files: UploadFile[]): string => {
      const urls: string[] = [];
      files.forEach((file) => {
        if (file.status === 'success' && file.url) {
          urls.push(file.url);
        }
      });
      return urls.join(',');
    };

    // 逗号拼接的 url 字符串 -> TDesign 文件列表
    const toFileList = (value: string): UploadFile[] =>
      value
        .split(',')
        .filter(Boolean)
        .map((url) => ({
          name: getFileNameByUrl(url),
          status: 'success' as const,
          url,
        }));

    // 同步给设计器
    const syncValue = (files: UploadFile[]): void => {
      urlString = toUrlString(files);
      emit('update:modelValue', urlString);
      emit('change', urlString);
    };

    // 处理传递进来的值
    watch(
      () => props.modelValue,
      (modelValue) => {
        // urlString 等于传入值时不处理，避免与 emit 互相触发
        if (urlString === modelValue) return;
        fileList.value = modelValue ? toFileList(modelValue) : [];
      },
      { immediate: true },
    );

    // TDesign 文件列表变化后同步给设计器
    const handleChange: UploadProps['onChange'] = (value) => {
      fileList.value = value;
      syncValue(value);
    };

    // 适配后端返回结构：{ data: { url } } 或 { data: 'url' }
    const formatResponse: UploadProps['formatResponse'] = (response) => {
      const data = response?.data;
      const url = data?.url ?? data;

      if (typeof url === 'string' && url !== '') {
        return { status: 'success', url };
      }

      return {
        error: response?.message ?? '上传失败',
        status: 'fail',
      };
    };

    const handleFail: UploadProps['onFail'] = () => {
      MessagePlugin.error('上传失败');
    };

    const getUploadProps = computed<UploadProps>(() => {
      const uploadProps = {
        ...sanitizeAttrs(
          TUpload,
          normalizeSize(attrs as Record<string, unknown>),
        ),
        action: pluginManager.global.uploadFile ?? attrs.action,
        formatResponse,
        headers: pluginManager.global.axiosConfig?.headers,
        modelValue: fileList.value,
        onChange: handleChange,
        onFail: handleFail,
        theme: 'file',
      };

      return uploadProps as UploadProps;
    });

    return () => h(TUpload, getUploadProps.value);
  },
});

<script lang="ts" setup>
import { useTheme } from '@nada-designer/hooks';
import {
  ConfigProvider,
  Layout,
  LayoutContent,
  LayoutSider,
  theme,
} from 'ant-design-vue';

import EHeader from './components/Header/index.vue';
import Main from './components/Main/index.vue';
import EMenu from './components/Menu/index.vue';

const { isDark } = useTheme();
</script>
<template>
  <ConfigProvider
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }"
  >
    <Layout class="maximize ep-scoped ep-demo-layout">
      <EHeader />
      <Layout class="ep-demo-body">
        <LayoutSider>
          <div class="ep-demo-menu h-full">
            <EMenu />
          </div>
        </LayoutSider>
        <LayoutContent class="ep-demo-content">
          <Main />
        </LayoutContent>
      </Layout>
    </Layout>
  </ConfigProvider>
</template>

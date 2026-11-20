<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';

import type { RouteRecordRaw } from 'vue-router';

import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { frameworkRoutes } from '@/router';
import { Button, Menu } from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

const items = traverseRoutes(frameworkRoutes);

const routeName = computed(() => {
  return route.name as string;
});

/** 全部分组 key（设计器 / 生成器 / 场景验证） */
const groupKeys = computed(() =>
  items
    .filter((item: any) => item.children?.length)
    .map((item: any) => item.key as string),
);

/**
 * 当前展开的分组
 * 受控状态：用户点分组标题或「全部展开/收起」按钮都能切换
 * （此前直接由 route.matched 计算，导致分组永远锁死展开、点击无法收起）
 * 默认全部展开，方便一次性看到所有入口
 */
const openKeys = ref<string[]>([...groupKeys.value]);

// 进入页面 / 切换路由时，自动展开当前路由所属分组，同时保留用户手动展开的其它分组
watch(
  () => route.matched,
  (matched) => {
    const routeKeys = matched
      .map((item) => item.name as string)
      .filter((name): name is string => Boolean(name));
    openKeys.value = [...new Set([...openKeys.value, ...routeKeys])];
  },
  { immediate: true },
);

/** 是否所有分组都已展开 */
const allOpened = computed(() =>
  groupKeys.value.every((key) => openKeys.value.includes(key)),
);

/** 一键展开 / 收起所有分组 */
function toggleAll() {
  openKeys.value = allOpened.value ? [] : [...groupKeys.value];
}

// 修改后的递归函数用于遍历树形结构并修改数据
function traverseRoutes(routes: RouteRecordRaw[]) {
  return routes.map((route) => {
    // 创建一个新的对象来存储修改后的节点信息
    const modifiedRoute: any = {
      key: route.name,
      label: route.meta?.title,
      // 在这里您可以根据需要修改其他属性
    };

    // 如果节点有子节点，则递归调用遍历子节点
    // 注意：不能设置 type: 'group'，那是「静态分组」（不可折叠）；
    // 只保留 key/label/children，antd-vue 才会渲染成可展开的 SubMenu
    if (route.children) {
      modifiedRoute.children = traverseRoutes(route.children);
    }

    return modifiedRoute;
  });
}

const handleClick: MenuProps['onClick'] = (e) => {
  // router.push({ path: '/' + route.path.split('/')[1] + '/' + e.key })
  router.push({ name: e.key as string });
};
</script>
<template>
  <div class="flex h-full flex-col">
    <div class="ep-menu-tools flex shrink-0 items-center justify-between px-3">
      <span class="scenario-menu-title text-12px">菜单</span>
      <Button size="small" type="link" @click="toggleAll">
        {{ allOpened ? '全部收起' : '全部展开' }}
      </Button>
    </div>
    <Menu
      v-model:openKeys="openKeys"
      class="min-h-0 flex-1 overflow-auto"
      :items="items"
      :selected-keys="[routeName]"
      mode="inline"
      @click="handleClick"
    />
  </div>
</template>

<style scoped>
/* 顶部工具条：需要自己上背景色，否则会露出 LayoutSider 的默认深色底 */
.ep-menu-tools {
  height: 40px;
  background: #fff;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}

:global(.dark) .ep-menu-tools {
  background: #141414;
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

.scenario-menu-title {
  color: var(--ep-text-helper, #6b7280);
}
</style>

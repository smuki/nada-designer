# 右侧边栏扩展

:::warning 位置变更（v1.1.18）
属性 / 样式 / 事件已合并为**左侧单一「属性」面板**（底部页签切换），右侧边栏容器不再渲染；`registerRightSidebar` API 保留以兼容已有注册代码，但当前版本不会显示。
:::

:::tip 右侧边栏扩展
`pluginManager` 提供了registerRightSidebar方法扩展右侧边栏功能模块
:::

参考demo仓库： [https://github.com/smuki/nada-designer](https://github.com/smuki/nada-designer)

## 右侧边栏扩展示例

在src目录下新建designer-extensions 文件目录，下面是一个简单扩展示例

### 新建 designer-extensions/sidebar/index.vue

```vue
<template>
    <div>
        我是一个扩展模块
    </div>
</template>
```

### 新建designer-extensions/index.ts(扩展函数)
```ts
import { pluginManager } from "nada-designer";

// 安装扩展
export function setupDesignerExtensions(): void {
  // 添加右侧模块
  pluginManager.panel.registerRightSidebar({
    id: "test_view",
    title: "扩展",
    component: async () => await import("./sidebar/index.vue"),
  });
}
```
### main.ts 添加执行扩展函数

```ts
import { setupDesignerExtensions } from "./designer-extensions";

// 执行扩展函数
setupDesignerExtensions();
```



## xxxxxxxxxx import { setupDesignerExtensions } from "./designer-extensions";​// 执行扩展函数setupDesignerExtensions();ts

在扩展组件时，需要传入的配置id是唯一的，如果id一样则后注册组件会替换原来的组件，所以我们可以通过设置id来覆盖原来右侧边栏模块

| 模块名 | id             |
| ------ | -------------- |
| 属性   | attribute_view |
| 样式   | style_view     |
| 事件   | event_view     |


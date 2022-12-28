# 基于 VUE 的可拖拽流程图

- **基础流程图框架：**
  基于 [vue-super-flow](https://caohuatao.github.io) 开发，由于需求的流程图不存在分支，是单向流动的，所以在此基础上，将节点都固定在一条线上，并且节点之间的间距为固定值。
- **可增加新节点**
- **增加新节点后默认连线：**
  添加 node 的时候，就是将新的 node 默认 push 到一个 nodeList 的尾部，因为我们的流程图没有分支，只要是在 nodeList 里的元素按照在数组里的顺序进行连线。

- **点击模块可编辑：**
  利用一个弹出的 dialog 窗口实现，窗口使用 v-show 指令控制窗口的显示与隐藏，修改节点属性（名称和描述）使用 v-model 控制。
- **模块可拖拽**
- **拖拽后自动调整顺序：**
  读取鼠标事件，获取鼠标的坐标（应该只需要 X 坐标），事先定义若干个取值区间，落在哪个区间就把它插在数组的哪个位置，连线就根据数组元素顺序进行连线。

## vue-super-flow Installation

```npm

npm install vue-super-flow

yarn add vue-super-flow

```

```js
import SuperFlow from "vue-super-flow";
import "vue-super-flow/lib/index.css";

Vue.use(SuperFlow);
```

## Attributes

| 属性                            | 类型       | 默认值       | 描述                       |
| ------------------------------- | ---------- | ------------ | -------------------------- |
| draggable                       | `Boolean`  | `true`       | 是否开启节点拖拽           |
| linkAddable                     | `Boolean`  | `true`       | 是否开启快捷创建 `link`    |
| linkEditable                    | `Boolean`  | `true`       | `link` 是否可编辑          |
| hasMarkLine                     | `Boolean`  | `true`       | 是否开启拖拽辅助线         |
| markLineColor                   | `String`   | `#55abfc`    | 辅助线颜色                 |
| origin                          | `Array`    | `[0, 0]`     | `graph` 的二维坐标系原点   |
| nodeList                        | `Array`    | `[]`         | 初始化节点列表             |
| linkList                        | `Array`    | `[]`         | 初始化连线列表             |
| graphMenu                       | `Array`    | `[]`         | `graph` 的右键菜单列表配置 |
| nodeMenu                        | `Array`    | `[]`         | `node` 右键菜单列表配置    |
| linkMenu                        | `Array`    | `[]`         | `link` 右键菜单配置        |
| enterIntercept                  | `Function` | `() => true` | 创建连线进入节点限制       |
| outputIntercept                 | `Function` | `() => true` | 节点生成连线限制函数       |
| [linkDesc](#linkdesc)           | `Function` | `null`       | 生成 `link` 定制描述文字   |
| [linkStyle](#linkstyle)         | `Function` | `null`       | 根据 `link` 定制样式       |
| [linkBaseStyle](#linkbasestyle) | `Object`   | `{}`         | 连线默认样式配置           |

### linkDesc

```js
function linkDesc(link) {
  /**
     根据 link 对象的属性判断定制连线描述
   */
  return link.meta ? link.meta.info : "";
}
```

### linkBaseStyle

```json5
/**
// 内置默认样式配置
{
   hover: '#FF0000',        // 连线 hover 时颜色
   color: '#666666',        // 连线颜色
   textColor: '#666666',    // 连线描述文字颜色
   textHover: '#FF0000',    // 连线 hover 时描述文字颜色
   font: '14px Arial',      // 连线 描述文字 font 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/font
   dotted: false,           // 连线 是否是虚线
   lineDash: [4, 4],        // 为虚线时 虚线参数  参考：https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash
   background: 'rgba(255,255,255,0.6)'  // 描述文字背景  
}
*/

{
  // ... 可选属性 参考内置默认样式 用来覆盖连线样式的默认值
}
```

### linkStyle

```js
function linkStyle(link) {
  /**
     根据 link 对象的属性判断定制连线样式
   */
  return {
    // ... 可选属性 参考：[linkBaseStyle](#linkBaseStyle)
  };
}
```

## Methods

| 方法名             | 说明                                | 参数             |
| ------------------ | ----------------------------------- | ---------------- |
| selectAll          | 选中所有进行拖拽修改 `origin`       | ----             |
| toJSON             | 将 `graph` 对象转为普通 json 对象   | ----             |
| getMouseCoordinate | 获取当前鼠标在 `graph` 坐标系的坐标 | clientX, clientY |
| addNode            | 添加节点                            | options          |

## Example

![示例](https://raw.githubusercontent.com/azhaYOLO/vue-super-flow/master/demo.gif)

## Special Thanks to vue-super-flow

想要了解更多样的流程图？请移步[vue-super-flow](https://caohuatao.github.io)😊

<template>
  <div
    class="super-flow"
    ref="flow-canvas"
    @contextmenu.prevent.stop="contextmenu"
  >
    <graph-line
      v-if="temEdgeConf.visible"
      :padding="linkPadding"
      :graph="graph"
      :link="temEdgeConf.link"
      :link-base-style="linkBaseStyle"
      :link-desc="linkDesc"
      :link-style="linkStyle"
    />

    <graph-line
      v-for="(edge, idx) in graph.linkList"
      :index="idx"
      :padding="linkPadding"
      :graph="graph"
      :link="edge"
      :key="edge.key"
      :link-base-style="linkBaseStyle"
      :link-desc="linkDesc"
      :link-style="linkStyle"
    />

    <mark-line
      v-if="moveNodeConf.isMove && hasMarkLine"
      :width="clientWidth"
      :height="clientHeight"
      :mark-color="markLineColor"
      :markLine="moveNodeConf.markLine"
    />

    <graph-node
      v-for="(node, idx) in graph.nodeList"
      :index="idx"
      :node="node"
      :graph="graph"
      :key="node.key"
      :is-move="node === moveNodeConf.node"
      :is-tem-edge="temEdgeConf.visible"
      :node-intercept="nodeIntercept(node)"
      :line-drop="linkAddable"
      :node-drop="draggable"
      @node-mousedown="nodeMousedown"
      @node-mouseenter="nodeMouseenter"
      @node-mouseleave="nodeMouseleave"
      @node-mouseup="nodeMouseup"
      @side-mousedown="sideMousedown"
      @node-contextmenu="nodeContextmenu"
    >
      <template v-slot="{ meta }">
        <slot name="node" :meta="meta"> </slot>
      </template>
    </graph-node>

    <graph-menu
      :visible.sync="menuConf.visible"
      :graph="graph"
      :position="menuConf.position"
      :list="menuConf.list"
      :source="menuConf.source"
    >
      <template v-slot="{ item }">
        <slot name="menuItem" :item="item"> </slot>
      </template>
    </graph-menu>

    <div
      class="select-all__mask"
      ref="selectAllMask"
      tabindex="-1"
      :style="maskStyle"
      @blur="graph.graphSelected = false"
      v-show="graph.graphSelected"
      @mousedown="selectAllMaskMouseDown"
      @contextmenu.prevent.stop
    ></div>
  </div>
</template>

<script>
import Graph from "./Graph";
import GraphMenu from "./menu";
import GraphNode from "./node";
import GraphLine from "./link";
import MarkLine from "./markLine";

import {
  getOffset,
  isIntersect,
  isBool,
  isFun,
  vector,
  debounce,
  arrayReplace,
} from "./utils";

export default {
  name: "super-flow",
  props: {
    relationMark: {
      type: String,
      default: "id",
    },
    startMark: {
      type: String,
      default: "startId",
    },
    endMark: {
      type: String,
      default: "endId",
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    linkAddable: {
      type: Boolean,
      default: true,
    },
    linkEditable: {
      type: Boolean,
      default: true,
    },
    hasMarkLine: {
      type: Boolean,
      // default: true
      default: false,
    },
    linkDesc: {
      type: [Function, null],
      default: null,
    },
    linkStyle: {
      type: [Function, null],
      default: null,
    },
    linkBaseStyle: {
      type: Object,
      default: () => ({}),
    },
    markLineColor: {
      type: String,
      default: "#55abfc",
    },
    origin: {
      type: Array,
      default: () => [0, 0],
    },
    nodeList: {
      type: Array,
      default: () => [],
    },
    linkList: {
      type: Array,
      default: () => [],
    },
    graphMenu: {
      type: Array,
      default: () => [],
    },
    nodeMenu: {
      type: Array,
      default: () => [],
    },
    linkMenu: {
      type: Array,
      default: () => [],
    },
    linkPadding: {
      type: Number,
      default: 50,
    },
    enterIntercept: {
      type: Function,
      default: () => true,
    },
    outputIntercept: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      graph: new Graph({
        relationMark: this.relationMark,
        startMark: this.startMark,
        endMark: this.endMark,
        origin: this.origin,
      }),
      menuConf: {
        visible: false,
        position: [0, 0],
        source: null,
        list: [],
      },
      moveNodeConf: {
        isMove: false,
        node: null,
        offset: null,
        verticalList: [],
        horizontalList: [],
        markLine: [],
      },
      moveAllConf: {
        isMove: false,
        downPosition: [0, 0],
      },
      temEdgeConf: {
        visible: false,
        link: null,
      },
      loaded: false,
      clientWidth: 0,
      clientHeight: 0,
    };
  },
  components: {
    GraphMenu,
    GraphNode,
    GraphLine,
    MarkLine,
  },
  computed: {
    maskStyle() {
      const { top, right, bottom, left } = this.graph.maskBoundingClientRect;
      return {
        width: `${right - left}px`,
        height: `${bottom - top}px`,
        top: `${top + this.graph.origin[1]}px`,
        left: `${left + this.graph.origin[0]}px`,
      };
    },
  },
  mounted() {
    document.addEventListener("mouseup", this.docMouseup);
    document.addEventListener("mousemove", this.docMousemove);
    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener("mouseup", this.docMouseup);
      document.removeEventListener("mousemove", this.docMousemove);
    });
    this.$nextTick(() => {
      this.graph.initNode(this.nodeList);
      this.graph.initLink(this.linkList);
    });
  },
  methods: {
    // 初始化菜单
    initMenu(menu, source) {
      return menu
        .map((subList) =>
          subList
            .map((item) => {
              let disable;
              let hidden;

              if (isFun(item.disable)) {
                disable = item.disable(source);
              } else if (isBool(item.disable)) {
                disable = item.disable;
              } else {
                disable = Boolean(item.disable);
              }

              if (isFun(item.hidden)) {
                hidden = item.hidden(source);
              } else if (isBool(item.hidden)) {
                hidden = item.hidden;
              } else {
                hidden = Boolean(item.hidden);
              }

              return {
                ...item,
                disable,
                hidden,
              };
            })
            .filter((item) => !item.hidden)
        )
        .filter((sublist) => sublist.length);
    },

    showContextMenu(position, list, source) {
      if (!list.length) return;
      this.$set(this.menuConf, "position", position);
      this.$set(this.menuConf, "list", list);
      this.$set(this.menuConf, "source", source);
      this.menuConf.visible = true;
    },

    // 设置松开鼠标按键事件发生时执行的方法
    docMouseup(evt) {
      // if (this.moveNodeConf.isMove) {
      //   evt.stopPropagation();
      //   evt.preventDefault();
      // }
      // 移动节点时
      if (this.moveNodeConf.isMove) {
        // 获取选中节点的属性
        const conf = this.moveNodeConf;
        // 设置节点位置，判断其落在哪个区间内，默认每200为一个区间
        const posIdx = Math.round(this.moveNodeConf.node.coordinate[0] / 200);
        // const posIdx = Math.floor(this.moveNodeConf.node.coordinate[0] / 200);
        // const posIdx = this.moveNodeConf.node.coordinate[0] / 200;
        // 在画布中过滤出所选节点的id，存到tarNode中
        const tarNode = this.graph.nodeList.filter((node) => {
          return node.id === conf.node.id;
        })[0];
        // 获取选中节点在画布节点列表中的下标
        const idx = this.graph.nodeList.indexOf(tarNode);
        // 替换操作
        // 删除选中的节点
        this.graph.nodeList.splice(idx, 1);
        // 在区间所属位置插入tarNode
        this.graph.nodeList.splice(posIdx, 0, tarNode);
        // 画布列表中的所有节点，重新设置坐标
        this.graph.nodeList.forEach((node, idxg) => {
          node.coordinate = [idxg * 200, 0];
        });

        // 重新连线
        let lL = [];
        for (let i = 0; i <= this.graph.nodeList.length - 2; i++) {
          let lk = this.graph.addLink({
            start: this.graph.nodeList[i],
            end: this.graph.nodeList[i + 1],
            startAt: [100, 40],
            endAt: [0, 40],
            meta: null,
          });
          lL.push(lk);
        }
        // 替换原来的连线列表
        arrayReplace(this.graph.linkList, lL);

        evt.stopPropagation();
        evt.preventDefault();
      }

      // 禁止移动
      this.moveNodeConf.isMove = false;

      // 清空
      this.moveNodeConf.node = null;
      this.moveNodeConf.offset = null;
      arrayReplace(this.moveNodeConf.markLine, []);

      // 还原缓存变量
      this.temEdgeConf.visible = false;
      this.temEdgeConf.link = null;

      // 禁止全选移动
      this.moveAllConf.isMove = false;
    },

    // 设置移动鼠标事件发生时执行的方法
    docMousemove(evt) {
      // 判断移动对象，选择对应的方法
      if (this.moveNodeConf.isMove) {
        this.moveNode(evt);
      } else if (this.temEdgeConf.visible) {
        this.moveTemEdge(evt);
      } else if (this.graph.graphSelected) {
        this.moveWhole(evt);
      } else if (this.linkEditable) {
        this.graph.dispatch(
          {
            type: "mousemove",
            evt: evt,
          },
          true
        );
      }
    },

    // 移动节点的方法
    moveNode(evt) {
      const distance = 10;
      const conf = this.moveNodeConf;
      const origin = this.graph.origin;
      const position = vector(conf.offset)
        .differ(getOffset(evt, this.$el))
        .minus(origin)
        .add([conf.node.width / 2, conf.node.height / 2]).end;

      if (this.hasMarkLine) {
        const resultList = [];
        conf.verticalList.some((vertical) => {
          const x = position[0];
          const result = vertical - distance < x && vertical + distance > x;

          if (result) {
            position[0] = vertical;
            vertical = Math.floor(vertical);
            vertical += origin[0];
            vertical += vertical % 1 === 0 ? 0.5 : 0;
            resultList.push([
              [vertical, 0],
              [vertical, this.clientHeight],
            ]);
          }
          return result;
        });
        conf.horizontalList.some((horizontal) => {
          const y = position[1];
          const result = horizontal - distance < y && horizontal + distance > y;
          if (result) {
            position[1] = horizontal;
            horizontal = Math.floor(horizontal);
            horizontal += origin[1];
            horizontal += horizontal % 1 === 0 ? 0.5 : 0;
            resultList.push([
              [0, horizontal],
              [this.clientWidth, horizontal],
            ]);
          }
          return result;
        });

        arrayReplace(conf.markLine, resultList);
      }

      // conf.node.center = position; //拖拽节点可跟随鼠标
      conf.node.center = [position[0], conf.node.height / 2]; //拖拽节点，Y坐标锁定
    },

    moveTemEdge(evt) {
      this.temEdgeConf.link.movePosition = getOffset(evt, this.$el);
    },

    // 移动所有
    moveWhole(evt) {
      if (this.moveAllConf.isMove) {
        const offset = vector(this.moveAllConf.downPosition).differ([
          evt.clientX,
          evt.clientY,
        ]).end;
        arrayReplace(
          this.graph.origin,
          vector(this.moveAllConf.origin).add(offset).end
        );
      }
    },

    // 设置菜单事件
    contextmenu(evt) {
      const mouseOnLink = this.graph.mouseOnLink;
      const position = getOffset(evt);
      let list, source;

      if (mouseOnLink && mouseOnLink.isPointInLink(position)) {
        list = this.initMenu(this.linkMenu, mouseOnLink);
        source = mouseOnLink;
      } else {
        if (mouseOnLink) this.graph.mouseOnLink = null;
        list = this.initMenu(this.graphMenu, this.graph);
        source = this.graph;
      }

      this.showContextMenu(position, list, source);
    },

    // 设置按下鼠标事件发生时执行的方法
    nodeMousedown(node, offset) {
      if (this.draggable) {
        this.clientWidth = this.$el.clientWidth;
        this.clientHeight = this.$el.clientHeight;

        const verticalList = this.moveNodeConf.verticalList;
        const horizontalList = this.moveNodeConf.horizontalList;

        const centerList = this.graph.nodeList
          .filter((item) => item !== node)
          .map((node) => node.center);

        arrayReplace(
          verticalList,
          [...new Set(centerList.map((center) => center[0]))].sort(
            (prev, next) => prev - next
          )
        );

        arrayReplace(
          horizontalList,
          [...new Set(centerList.map((center) => center[1]))].sort(
            (prev, next) => prev - next
          )
        );

        this.moveNodeConf.isMove = true;
        this.moveNodeConf.node = node;
        this.moveNodeConf.offset = offset;
      }
    },

    nodeMouseenter(evt, node, offset) {
      const link = this.temEdgeConf.link;
      if (this.enterIntercept(link.start, node, this.graph)) {
        link.end = node;
        link.endAt = offset;
      }
    },

    nodeMouseleave() {
      this.temEdgeConf.link.end = null;
    },

    nodeMouseup() {
      this.graph.addLink(this.temEdgeConf.link);
    },

    nodeContextmenu(evt, node) {
      const list = this.initMenu(this.nodeMenu, node);
      if (!list.length) return;
      this.$set(this.menuConf, "position", getOffset(evt, this.$el));
      this.$set(this.menuConf, "list", list);
      this.$set(this.menuConf, "source", node);
      this.menuConf.visible = true;
    },

    sideMousedown(evt, node, startAt) {
      if (this.linkAddable) {
        const link = this.graph.createLink({
          start: node,
          startAt,
        });
        link.movePosition = getOffset(evt, this.$el);
        this.$set(this.temEdgeConf, "link", link);
        this.temEdgeConf.visible = true;
      }
    },

    nodeIntercept(node) {
      return () => this.outputIntercept(node, this.graph);
    },

    menuItemSelect() {
      this.menuConf.visible = false;
    },

    selectAllMaskMouseDown(evt) {
      this.moveAllConf.isMove = true;
      this.moveAllConf.origin = [...this.graph.origin];
      this.moveAllConf.downPosition = [evt.clientX, evt.clientY];
    },

    selectedAll() {
      this.graph.selectAll();
    },

    toJSON() {
      return this.graph.toJSON();
    },

    getMouseCoordinate(clientX, clientY) {
      const offset = getOffset({ clientX, clientY }, this.$el);
      return vector(offset).minus(this.graph.origin).end;
    },

    addNode(options) {
      return this.graph.addNode(options);
    },
  },
  watch: {
    "graph.graphSelected"() {
      if (this.graph.graphSelected) {
        this.$nextTick(() => {
          this.$refs.selectAllMask.focus();
        });
      }
    },
    "graph.mouseOnLink"() {
      if (this.graph.mouseOnLink) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "";
      }
    },
    origin() {
      this.graph.origin = this.origin || [];
    },
    nodeList() {
      this.graph.initNode(this.nodeList);
    },
    linkList() {
      this.graph.initLink(this.linkList);
    },
  },
  install(Vue) {
    Vue.component(this.name, this);
  },
};
</script>

<style lang="less">
.super-flow {
  font-family: Apple System, "SF Pro SC", "SF Pro Display", "Helvetica Neue",
    Arial, "PingFang SC", "Hiragino Sans GB", STHeiti, "Microsoft YaHei",
    "Microsoft JhengHei", "Source Han Sans SC", "Noto Sans CJK SC",
    "Source Han Sans CN", sans-serif;

  position: relative;
  background-color: transparent;
  width: 100%;
  height: 100%;
  overflow: hidden;

  > .select-all__mask {
    position: absolute;
    background-color: rgba(85, 175, 255, 0.1);
    z-index: 20;
    border: 1px dashed #55abfc;
    cursor: move;
    outline: none;
  }
}
</style>

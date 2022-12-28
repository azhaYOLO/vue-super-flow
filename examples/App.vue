<template>
  <div class="super-flow-base-demo">
    <super-flow
      ref="superFlow"
      :node-list="nodeList"
      :link-list="linkList"
      :origin="origin"
      :graph-menu="graphMenuList"
      :node-menu="nodeMenuList"
      :link-menu="linkMenuList"
      :enter-intercept="enterIntercept"
      :output-intercept="outputIntercept"
      :link-desc="linkDesc"
    >
      <template v-slot:node="{ meta }">
        <div :class="`flow-node flow-node-${meta.prop}`">
          <header class="ellipsis">
            {{ meta.name }}
          </header>
          <section>
            {{ meta.desc }}
          </section>
        </div>
      </template>
    </super-flow>

    <!-- 对话框 -->
    <el-dialog
      :title="drawerConf.title"
      :visible.sync="drawerConf.visible"
      :close-on-click-modal="false"
      width="500px"
    >
      <!-- 编辑节点 表单 -->
      <el-form
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
        v-show="drawerConf.type === drawerType.node"
        ref="nodeSetting"
        :model="nodeSetting"
      >
        <el-form-item label="节点名称" prop="name">
          <el-input
            v-model="nodeSetting.name"
            placeholder="请输入节点名称"
            maxlength="30"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="节点描述" prop="desc">
          <el-input
            v-model="nodeSetting.desc"
            placeholder="请输入节点描述"
            maxlength="30"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 编辑连线 表单 更换节点位置会被刷新 需考虑取舍-->
      <el-form
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
        v-show="drawerConf.type === drawerType.link"
        ref="linkSetting"
        :model="linkSetting"
      >
        <el-form-item label="连线描述" prop="desc">
          <el-input v-model="linkSetting.desc" placeholder="请输入连线描述">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawerConf.cancel"> 取 消 </el-button>
        <el-button type="primary" @click="settingSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const drawerType = {
  node: 0,
  link: 1,
};

export default {
  data() {
    return {
      drawerType,
      drawerConf: {
        title: "",
        visible: false,
        type: null,
        info: null,
        open: (type, info) => {
          const conf = this.drawerConf;
          conf.visible = true;
          conf.type = type;
          conf.info = info;
          if (conf.type === drawerType.node) {
            conf.title = "节点";
            if (this.$refs.nodeSetting) this.$refs.nodeSetting.resetFields();
            this.$set(this.nodeSetting, "name", info.meta.name);
            this.$set(this.nodeSetting, "desc", info.meta.desc);
          } else {
            conf.title = "连线";
            if (this.$refs.linkSetting) this.$refs.linkSetting.resetFields();
            this.$set(
              this.linkSetting,
              "desc",
              info.meta ? info.meta.desc : ""
            );
          }
        },
        cancel: () => {
          this.drawerConf.visible = false;
          if (this.drawerConf.type === drawerType.node) {
            this.$refs.nodeSetting.clearValidate();
          } else {
            this.$refs.linkSetting.clearValidate();
          }
        },
      },
      linkSetting: {
        desc: "",
      },
      nodeSetting: {
        name: "",
        desc: "",
      },

      // 设置画布的相对原点
      origin: [100, 300],
      nodeList: [],
      linkList: [],

      // 画布菜单列表
      graphMenuList: [
        [
          {
            label: "开始节点",
            disable(graph) {
              return !!graph.nodeList.find(
                (node) => node.meta.prop === "start"
              );
            },
            selected: (graph, coordinate) => {
              const start = graph.nodeList.find(
                (node) => node.meta.prop === "start"
              );
              if (!start) {
                graph.addNode({
                  width: 120,
                  height: 100,
                  coordinate: coordinate,
                  meta: {
                    prop: "start",
                    name: "开始节点",
                  },
                });
              }
            },
          },
          {
            label: "条件节点",
            disable: false,
            selected: (graph, coordinate) => {
              graph.addNode({
                // 设置固定长宽值
                width: 120,
                height: 100,
                // 设置坐标为固定间距
                coordinate: [200 * graph.nodeList.length, 0],
                meta: {
                  prop: "condition",
                  name: "条件节点",
                },
              });
              // 添加连线,相邻两节点默认连线
              graph.addLink({
                start: graph.nodeList[graph.nodeList.length - 2],
                end: graph.nodeList[graph.nodeList.length - 1],
                startAt: [100, 40],
                endAt: [0, 40],
                meta: null,
              });
            },
          },
          {
            label: "审批节点",
            disable: false,
            selected: (graph, coordinate) => {
              graph.addNode({
                width: 120,
                height: 100,
                coordinate: [200 * graph.nodeList.length, 0],
                meta: {
                  prop: "approval",
                  name: "审批节点",
                },
              });
              graph.addLink({
                start: graph.nodeList[graph.nodeList.length - 2],
                end: graph.nodeList[graph.nodeList.length - 1],
                startAt: [100, 40],
                endAt: [0, 40],
                meta: null,
              });
            },
          },
          {
            label: "抄送节点",
            disable: false,
            selected: (graph, coordinate) => {
              graph.addNode({
                width: 120,
                height: 100,
                coordinate: [200 * graph.nodeList.length, 0],
                meta: {
                  prop: "cc",
                  name: "抄送节点",
                },
              });
              graph.addLink({
                start: graph.nodeList[graph.nodeList.length - 2],
                end: graph.nodeList[graph.nodeList.length - 1],
                startAt: [100, 40],
                endAt: [0, 40],
                meta: null,
              });
            },
          },
          {
            label: "结束节点",
            disable(graph) {
              return !!graph.nodeList.find(
                (point) => point.meta.prop === "end"
              );
            },
            selected: (graph, coordinate) => {
              graph.addNode({
                width: 120,
                height: 100,
                coordinate: [200 * graph.nodeList.length, 0],
                meta: {
                  prop: "end",
                  name: "结束节点",
                },
              });
              graph.addLink({
                start: graph.nodeList[graph.nodeList.length - 2],
                end: graph.nodeList[graph.nodeList.length - 1],
                startAt: [100, 40],
                endAt: [0, 40],
                meta: null,
              });
            },
          },
        ],
        [
          {
            label: "打印数据",
            selected: (graph, coordinate) => {
              console.log(JSON.stringify(graph.toJSON(), null, 2));
            },
          },
          {
            label: "全选",
            selected: (graph, coordinate) => {
              graph.selectAll();
            },
          },
        ],
      ],
      // 节点菜单列表
      nodeMenuList: [
        // 节点删除操作
        [
          {
            label: "删除",
            disable: false,
            hidden(node) {
              return node.meta.prop === "start";
            },
            selected(node, coordinate) {
              node.remove();
            },
          },
        ],
        // 节点编辑操作
        [
          {
            label: "编辑",
            selected: (node, coordinate) => {
              this.drawerConf.open(drawerType.node, node);
            },
          },
        ],
      ],
      // 连线菜单列表
      linkMenuList: [
        // 连线删除操作
        [
          {
            label: "删除",
            disable: false,
            selected: (link, coordinate) => {
              link.remove();
            },
          },
        ],
        // 连线编辑操作
        [
          {
            label: "编辑",
            disable: false,
            selected: (link, coordinate) => {
              this.drawerConf.open(drawerType.link, link);
            },
          },
        ],
      ],
    };
  },
  // 画布生成时,先初始化一些节点
  created() {
    const nodeList = [
      {
        id: "nodeS3WgFnzCI15X58Qw",
        width: 120,
        height: 100,
        coordinate: [0, 0],
        meta: {
          prop: "start",
          name: "开始节点",
          desc: "START",
        },
      },
      {
        id: "node7WXbwOR6kSFD53Hf",
        width: 120,
        height: 100,
        coordinate: [200, 0],
        meta: {
          prop: "condition",
          name: "条件节点",
          desc: "CONDITION I",
        },
      },
      {
        id: "nodefHsy9uJObPtdHZv1",
        width: 120,
        height: 100,
        coordinate: [400, 0],
        meta: {
          prop: "approval",
          name: "审批节点",
          desc: "APPROVAL I",
        },
      },
    ];
    const linkList = [
      {
        id: "linknL75dQV0AWZA85sq",
        startId: "nodeS3WgFnzCI15X58Qw",
        endId: "node7WXbwOR6kSFD53Hf",
        startAt: [100, 40],
        endAt: [0, 40],
        meta: null,
      },
      {
        id: "link52SczSXHmuyKDzRU",
        startId: "node7WXbwOR6kSFD53Hf",
        endId: "nodefHsy9uJObPtdHZv1",
        startAt: [100, 40],
        endAt: [0, 40],
        meta: null,
      },
    ];

    setTimeout(() => {
      this.nodeList = nodeList;
      this.linkList = linkList;
    }, 100);
  },
  methods: {
    enterIntercept(formNode, toNode, graph) {
      const formType = formNode.meta.prop;
      switch (toNode.meta.prop) {
        case "start":
          return false;
        case "approval":
          return ["start", "approval", "condition", "cc"].includes(formType);
        case "condition":
          return ["start", "approval", "condition", "cc"].includes(formType);
        case "end":
          return ["approval", "cc"].includes(formType);
        default:
          return true;
      }
    },
    outputIntercept(node, graph) {
      return !(node.meta.prop === "end");
    },
    linkDesc(link) {
      return link.meta ? link.meta.desc : "";
    },
    settingSubmit() {
      const conf = this.drawerConf;
      if (this.drawerConf.type === drawerType.node) {
        if (!conf.info.meta) conf.info.meta = {};
        Object.keys(this.nodeSetting).forEach((key) => {
          this.$set(conf.info.meta, key, this.nodeSetting[key]);
        });
        this.$refs.nodeSetting.resetFields();
      } else {
        if (!conf.info.meta) conf.info.meta = {};
        Object.keys(this.linkSetting).forEach((key) => {
          this.$set(conf.info.meta, key, this.linkSetting[key]);
        });
        this.$refs.linkSetting.resetFields();
      }
      conf.visible = false;
    },
  },
};
</script>

<style lang="less">
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
}

.super-flow-base-demo {
  width: 100%;
  height: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;

  .super-flow__node {
    .flow-node {
      > header {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        color: #ffffff;
      }

      > section {
        text-align: center;
        line-height: 20px;
        overflow: hidden;
        padding: 6px 12px;
        word-break: break-all;
      }

      &.flow-node-start {
        > header {
          background-color: #55abfc;
        }
      }

      &.flow-node-condition {
        > header {
          background-color: #bc1d16;
        }
      }

      &.flow-node-approval {
        > header {
          background-color: rgba(188, 181, 58, 0.76);
        }
      }

      &.flow-node-cc {
        > header {
          background-color: #30b95c;
        }
      }

      &.flow-node-end {
        > header {
          height: 50px;
          line-height: 50px;
          background-color: rgb(0, 0, 0);
        }
      }
    }
  }
}
</style>

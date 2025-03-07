/*
 * @Author: 阿扎
 * @Date:   2022-10-17 16:20:14
 * @Last Modified by:   Azha
 * @Last Modified time: 2022-10-17 16:59:52
 */

import GraphEvent from "./GraphEvent";
import GraphNode from "./GraphNode";
import GraphLink from "./GraphLink";

import { mark, arrayReplace } from "./utils";

class Graph extends GraphEvent {
  constructor(options) {
    const {
      relationMark,
      startMark,
      endMark,
      nodeList = [],
      linkList = [],
      origin,
    } = options;

    super();

    Object.assign(mark, {
      relationMark,
      startMark,
      endMark,
    });

    this.nodeList = [];
    this.linkList = [];

    this.origin = origin;

    this.mouseOnLink = null;
    this.mouseonNode = null;

    this.graphSelected = false;
    this.maskBoundingClientRect = {};

    this.initNode(nodeList);
    this.initLink(linkList);
  }

  pointMap() {
    const map = {};
    this.nodeList.forEach((point) => {
      map[point[mark.relationMark]] = point;
    });
    return map;
  }

  initNode(nodeList) {
    arrayReplace(
      this.nodeList,
      nodeList.map((node) => this.createNode(node))
    );
    return this.nodeList;
  }

  initLink(linkList) {
    const list = [];

    linkList.forEach((link) => {
      const { startAt = [0, 0], endAt = [0, 0], meta = null } = link;

      const startId = link[mark.startMark] || "";
      const endId = link[mark.endMark] || "";
      const pointMap = this.pointMap();
      // console.log(startId, endId);
      const start = pointMap[startId];
      const end = pointMap[endId];
      if (start && end) {
        list.push(
          this.createLink({
            start,
            end,
            meta,
            startAt,
            endAt,
          })
        );
      }
    });

    arrayReplace(this.linkList, list);

    return this.linkList;
  }

  createNode(options) {
    return new GraphNode(options, this);
  }

  createLink(options) {
    return new GraphLink(options, this);
  }

  addNode(options) {
    const node =
      options.constructor === GraphNode ? options : this.createNode(options);

    this.nodeList.push(node);
    // console.log(this.nodeList);
    return node;
  }

  addLink(options) {
    const newLink =
      options.constructor === GraphLink ? options : this.createLink(options);

    const currentLink = this.linkList.find((item) => {
      return item.start === newLink.start && item.end === newLink.end;
    });

    if (currentLink) {
      currentLink.startAt = newLink.startAt;
      currentLink.endAt = newLink.endAt;
    } else if (newLink.start && newLink.end) {
      this.linkList.push(newLink);
    }

    return newLink;
  }

  removeNode(node) {
    const idx = this.nodeList.indexOf(node);
    this.linkList
      .filter((link) => {
        return link.start === node || link.end === node;
      })
      .forEach((link) => {
        this.removeLink(link);
      });

    this.nodeList.splice(idx, 1);
    this.nodeList.forEach((node, idxg) => {
      node.coordinate = [idxg * 200, 0];
    });

    let lL = [];
    for (let i = 0; i <= this.nodeList.length - 2; i++) {
      let lk = this.addLink({
        start: this.nodeList[i],
        end: this.nodeList[i + 1],
        startAt: [100, 40],
        endAt: [0, 40],
        meta: null,
      });
      lL.push(lk);
    }
    arrayReplace(this.linkList, lL);

    return node;
  }

  removeLink(link) {
    const idx = this.linkList.indexOf(link);
    this.linkList.splice(idx, 1);
    if (this.mouseOnLink === link) {
      this.mouseOnLink = null;
    }
    return link;
  }

  toLastNode(idx) {
    const nodeList = this.nodeList;
    nodeList.splice(nodeList.length - 1, 0, ...nodeList.splice(idx, 1));
  }

  toLastLink(idx) {
    const linkList = this.linkList;
    linkList.splice(linkList.length - 1, 0, ...linkList.splice(idx, 1));
  }

  toJSON() {
    return {
      origin: this.origin,
      nodeList: this.nodeList.map((node) => node.toJSON()),
      linkList: this.linkList.map((link) => link.toJSON()),
    };
  }

  selectAll() {
    const nodeList = this.nodeList;
    const margin = 20;

    this.maskBoundingClientRect = {
      top:
        Math.min(...nodeList.map((node) => node.center[1] - node.height / 2)) -
        margin,

      right:
        Math.max(...nodeList.map((node) => node.center[0] + node.width / 2)) +
        margin,

      bottom:
        Math.max(...nodeList.map((node) => node.center[1] + node.height / 2)) +
        margin,

      left:
        Math.min(...nodeList.map((node) => node.center[0] - node.width / 2)) -
        margin,
    };

    this.graphSelected = true;
  }
}

export default Graph;

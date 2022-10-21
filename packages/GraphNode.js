/*
 * @Author: 阿扎
 * @Date:   2022-10-17 16:20:14
 * @Last Modified by:   Azha
 * @Last Modified time: 2022-10-21 14:43:00
 */

import { minus, uuid, vector, mark } from "./utils";

import { direction, directionVector } from "./types";

export default class GraphNode {
  //设置节点基本属性
  constructor(props, graph) {
    const {
      width = 100,
      height = 100,
      coordinate = [0, 0],
      meta = null,
    } = props;

    this.$options = props;

    const id = props[mark.relationMark] || uuid("node");

    this.key = uuid("node");
    this.graph = graph;

    this[mark.relationMark] = id;
    this.coordinate = [...coordinate];
    this.meta = meta;

    this.width = width;
    this.height = height;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [获取节点位置]
   * @return {[type]} [description]
   */
  get position() {
    return vector(this.coordinate).add(this.graph.origin).end;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [设置节点位置]
   * @param  {[type]} position   [description]
   * @return {[type]}            [description]
   */
  set position(position) {
    this.coordinate = vector(position).minus(this.graph.origin).end;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [获取节点中心点]
   * @return {[type]} [description]
   */
  get center() {
    return vector(this.coordinate).add([this.width / 2, this.height / 2]).end;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [设置节点中心点]
   * @param  {[type]} position   [description]
   * @return {[type]}            [description]
   */
  set center(position) {
    this.coordinate = vector(position).minus([
      this.width / 2,
      this.height / 2,
    ]).end;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [获取节点宽度]
   * @return {[type]} [description]
   */
  get width() {
    return this._width;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [设置节点宽度]
   * @param  {[type]} w          [description]
   * @return {[type]}            [description]
   */
  set width(w) {
    w = Math.floor(w);
    this._width = w > 50 ? w : 50;
    this.angle();
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [获取节点高度]
   * @return {[type]} [description]
   */
  get height() {
    return this._height;
  }

  /**
   * @author 阿扎
   * @date            2022-10-19
   * [设置节点高度]
   * @param  {[type]} h          [description]
   * @return {[type]}            [description]
   */
  set height(h) {
    h = Math.floor(h);
    this._height = h > 20 ? h : 20;
    this.angle();
  }

  /**
   * @author 阿扎
   * @date            2022-10-20
   * [计算夹角]
   * @return {[type]} [description]
   */
  angle() {
    const w = this.width / 2,
      h = this.height / 2,
      center = [0, 0];

    //节点左上角与X轴夹角
    const topLeft = vector(center)
      .minus([w, h])
      .angle().end;

    //节点右上角与X轴夹角
    const topRight = vector(center)
      .add([w, 0])
      .minus([0, h])
      .angle().end;

    //节点右下角与X轴夹角
    const bottomRight = vector(center)
      .add([w, h])
      .angle().end;

    //节点左下角与X轴夹角
    const bottomLeft = vector(center)
      .add([0, h])
      .minus([w, 0])
      .angle().end;

    this.angleList = [topLeft, topRight, bottomRight, bottomLeft];
  }

  /**
   * @author 阿扎
   * @date            2022-10-20
   * [计算相对偏移量]
   * @param  {[type]} offset     [description]
   * @return {[type]}            [description]
   */
  relative(offset) {
    const angle = vector(offset)
      .minus([this.width / 2, this.height / 2])
      .angle().end;
    const angleList = this.angleList;
    const directionList = [
      direction.top,
      direction.right,
      direction.bottom,
      direction.left,
    ];

    let dir = direction.left;

    angleList.reduce((prev, current, idx) => {
      if (angle >= prev && angle < current) {
        dir = directionList[idx - 1];
      }
      return current;
    });

    return {
      position: this.fixOffset(offset, dir), //坐标相对于左上角增量
      direction: directionVector[dir], //点所在方向
    };
  }

  /**
   * @author 阿扎
   * @date            2022-10-20
   * [节点左上角到各边中点偏移量]
   * @param  {[type]} offset     [description]
   * @param  {[type]} dir        [description]
   * @return {[type]}            [description]
   */
  fixOffset(offset, dir) {
    switch (dir) {
      case direction.top:
        offset[0] = this.width / 2;
        offset[1] = 0;
        break;
      case direction.right:
        offset[0] = this.width;
        offset[1] = this.height / 2;
        break;
      case direction.bottom:
        offset[0] = this.width / 2;
        offset[1] = this.height;
        break;
      case direction.left:
      default:
        offset[0] = 0;
        offset[1] = this.height / 2;
        break;
    }
    return offset;
  }

  /**
   * @author 阿扎
   * @date            2022-10-20
   * [将节点从图中移除]
   * @return {[type]} [description]
   */
  remove() {
    return this.graph.removeNode(this);
  }

  /**
   * @author 阿扎
   * @date            2022-10-20
   * [将节点转换为JSON格式]
   * @return {[type]} [description]
   */
  toJSON() {
    return {
      [mark.relationMark]: this[mark.relationMark],
      width: this.width,
      height: this.height,
      coordinate: [...this.coordinate],
      meta: this.meta,
    };
  }
}

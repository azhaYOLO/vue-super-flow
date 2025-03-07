/*
 * @Author: 阿扎
 * @Date:   2022-10-17 16:20:14
 * @Last Modified by:   Azha
 * @Last Modified time: 2022-10-21 11:27:42
 */

export default class GraphEvent {
  constructor() {
    this.listeners = {};
  }

  // 增加监听事件到列表
  add(type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  // 从列表中移除监听事件
  remove(type, callback) {
    if (!(type in this.listeners)) {
      return;
    }
    const stack = this.listeners[type];
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return this.remove(type, callback);
      }
    }
  }

  // 事件分配
  dispatch(event, breakOff = false) {
    if (!(event.type in this.listeners)) {
      return;
    }
    const stack = this.listeners[event.type];
    event.target = this;

    if (breakOff) {
      stack.some((fun, idx) => {
        const result = fun.call(this, event);
        if (result) stack.unshift(...stack.splice(idx, 1));
        return result;
      });
    } else {
      stack.forEach((fun) => fun.call(this, event));
    }
  }
}

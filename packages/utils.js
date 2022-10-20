/*
 * @Author: 阿扎
 * @Date:   2022-10-17 16:20:14
 * @Last Modified by:   Azha
 * @Last Modified time: 2022-10-20 09:30:11
 */

/**
 * [id记录]
 * @type {Object}
 */
export const mark = {
  relationMark: "id",
  startMark: "startId",
  endMark: "endId",
};

/**
 * @author 阿扎
 * @date            2022-10-19
 * [生成id]
 * @param  {String} before     [description]
 * @param  {String} after      [description]
 * @return {[type]}            [description]
 */
export function uuid(before = "", after = "") {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  const charsLen = chars.length;
  let uuid = [];
  const len = 16;
  for (let i = 0; i < len; i++) {
    uuid[i] = chars[0 | (Math.random() * charsLen)];
  }
  return before + uuid.join("") + after;
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [获取元素和左上角的距离]
 * @param  {[type]} evt        [description]
 * @param  {[type]} target     [description]
 * @return {[type]}            [description]
 */
export function getOffset(evt, target = null) {
  const { clientX, clientY, currentTarget } = evt;

  const current = target || currentTarget;

  const { left, top } = current.getBoundingClientRect();

  return [clientX - left, clientY - top];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [判断是否有交集]
 */
export function isIntersect({ clientX, clientY }, target) {
  const { top, right, bottom, left } = target.getBoundingClientRect();

  return top < clientY && right > clientX && bottom > clientY && left < clientX;
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [向量相加]
 * @param  {[type]} vectorA    [description]
 * @param  {[type]} vectorB    [description]
 */
export function addVector(vectorA, vectorB) {
  return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [向量乘以常量系数]
 * @param  {[type]} vector     [description]
 * @param  {[type]} k          [description]
 * @return {[type]}            [description]
 */
export function multiply(vector, k) {
  return [vector[0] * k, vector[1] * k];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [从B点到A点的距离]
 * @param  {[type]} pointA     [description]
 * @param  {[type]} pointB     [description]
 * @return {[type]}            [description]
 */
export function differ(pointA, pointB) {
  return [pointB[0] - pointA[0], pointB[1] - pointA[1]];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [从A点到B点的距离]
 * @param  {[type]} pointA     [description]
 * @param  {[type]} pointB     [description]
 * @return {[type]}            [description]
 */
export function minus(pointA, pointB) {
  return [pointA[0] - pointB[0], pointA[1] - pointB[1]];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [向量点乘]
 * @param  {[type]} vectorA    [description]
 * @param  {[type]} vectorB    [description]
 * @return {[type]}            [description]
 */
export function dotProduct(vectorA, vectorB) {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [向量叉乘]
 * @param  {[type]} vectorA    [description]
 * @param  {[type]} vectorB    [description]
 * @return {[type]}            [description]
 */
export function cross(vectorA, vectorB) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [计算向量的单位向量]
 * @param  {[type]} vector     [description]
 * @return {[type]}            [description]
 */
export function unitVector(vector) {
  const m = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  return [vector[0] / m, vector[1] / m];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [判断向量 x,y 坐标是否相等]
 * @param  {[type]} vector     [description]
 * @param  {[type]} target     [description]
 * @return {[type]}            [description]
 */
export function equals(vector, target) {
  return vector[0] === target[0] && vector[1] === target[1];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [计算向量夹角]
 * @param  {[type]} vector     [description]
 * @return {[type]}            [description]
 */
export function angle(vector) {
  return Math.round((180 / Math.PI) * Math.atan2(vector[1], vector[0])) + 180;
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [判断向量是否平行]
 * @param  {[type]} vectorA    [description]
 * @param  {[type]} vectorB    [description]
 * @return {[type]}            [description]
 */
export function parallel(vectorA, vectorB) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0] === 0;
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [判断 y 轴坐标是否相等]
 * @param  {[type]} vectorA    [description]
 * @param  {[type]} vectorB    [description]
 * @return {[type]}            [description]
 */
export function yAxisEqual(vectorA, vectorB) {
  return vectorA[1] === vectorB[1];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [判断 x 轴坐标是否相等]
 * @param  {[type]} vectorA    [description]
 * @param  {[type]} vectorB    [description]
 * @return {[type]}            [description]
 */
export function xAxisEqual(vectorA, vectorB) {
  return vectorA[0] === vectorB[0];
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [向量方法，调用属性的时候调用方法]
 * @param  {[type]} result     [description]
 * @return {[type]}            [description]
 */
export function vector(result) {
  const handler = {
    add: addVector,
    multiply,
    differ,
    minus,
    dotProduct,
    cross,
    unitVector,
    equals,
    angle,
    parallel,
  };
  const proxyHandler = {};

  Object.keys(handler).forEach((key) => {
    Object.defineProperty(proxyHandler, key, {
      get() {
        return function(val) {
          result = handler[key](result, val);
          return proxyHandler;
        };
      },
    });
  });

  Object.defineProperty(proxyHandler, "end", {
    get() {
      return result;
    },
  });

  return proxyHandler;
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [得到属性的类型]
 * @param  {[type]} val        [description]
 * @return {[type]}            [description]
 */
export function toRawType(val) {
  return Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLocaleLowerCase();
}

/**
 * @author 阿扎
 * @date             2022-10-19
 * [判断属性是否是方法]
 * @param  {[type]}  val        [description]
 * @return {Boolean}            [description]
 */
export function isFun(val) {
  return toRawType(val) === "function";
}

/**
 * @author 阿扎
 * @date             2022-10-19
 * [判断属性是否是布尔值]
 * @param  {[type]}  val        [description]
 * @return {Boolean}            [description]
 */
export function isBool(val) {
  return toRawType(val) === "boolean";
}

/**
 * @author 阿扎
 * @date             2022-10-19
 * [判断属性是否未定义]
 * @param  {[type]}  val        [description]
 * @return {Boolean}            [description]
 */
export function isUndef(val) {
  return toRawType(val) === "undefined";
}

/**
 * @author 阿扎
 * @date             2022-10-19
 * [判断属性是否是字符串]
 * @param  {[type]}  val        [description]
 * @return {Boolean}            [description]
 */
export function isString(val) {
  return toRawType(val) === "string";
}

/**
 * @author 阿扎
 * @date             2022-10-19
 * [判断属性是否是对象]
 * @param  {[type]}  val        [description]
 * @return {Boolean}            [description]
 */
export function isObject(val) {
  return toRawType(val) === "object";
}

/**
 * @author 阿扎
 * @date            2022-10-19
 * [替换数组]
 * @param  {[type]} arr1       [description]
 * @param  {[type]} arr2       [description]
 * @return {[type]}            [description]
 */
export function arrayReplace(arr1, arr2) {
  arr1.splice(0, arr1.length, ...arr2);
}

/**
 * @author 阿扎
 * @date              2022-10-19
 * [重设时延]
 * @param  {Function} fn         [description]
 * @param  {[type]}   timestamp  [description]
 * @return {[type]}              [description]
 */
export function debounce(fn, timestamp) {
  let timeout = null;
  return function() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(fn, timestamp);
  };
}

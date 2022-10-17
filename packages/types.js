/*
* @Author: 阿扎
* @Date:   2022-10-17 16:20:14
* @Last Modified by:   Azha
* @Last Modified time: 2022-10-17 17:02:32
*/

/**
 * [定义方向]
 * @type {Object}
 */
export const direction = {
  top: 1,
  right: 2,
  bottom: 3,
  left: 4
}


/**
 * [定义方向向量]
 * 上[0,-1] 右[1,0] 下[0,1] 左[-1,0]
 * @type {Object}
 */
export const directionVector = {
  [direction.top]: [0, -1],
  [direction.right]: [1, 0],
  [direction.bottom]: [0, 1],
  [direction.left]: [-1, 0]
}

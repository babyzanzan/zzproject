/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {      // 在valid_map中的是匹配有效的用户名
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {Object} data - 响应数据
 * @param {String} msg - 提示信息
 * @param {Number} code - 状态码
 * @return {undefined}
 * @description: 扩展ctx对象，添加apiSuccess和apiFail方法
 * @example: this.apiSuccess(data, msg, code)
 * @example: this.apiFail(data, msg, code)
 * 封装api返回格式扩展
 */
module.exports = {
  // 成功提示
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = {data, msg}
    this.code = code
  },
  // 失败提示
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = {data, msg}
    this.code = code
  }
}
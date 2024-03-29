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
  },

  // 生成token
  getToken(value) {
    return this.app.jwt.sign(value, this.app.config.jwt.secret)
  },

  // 分页
  async page(model, where = {}, options = {}) {
    let { offset = 0, limit = 10, order = [["created_time", "desc"]] } = options
    offset = parseInt(offset) || 0
    limit = parseInt(limit) || 10
    let data = await model.findAndCountAll({
      where,
      offset,
      limit,
      order
    })
    return {
      data: data.rows,
      meta: {
        total: data.count,
        offset,
        limit
      }
    }
  }
}
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
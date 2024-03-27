const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = {
    //   msg: "",
    //   data: [{id:1, name: ""}]
    // }
    let res = [{id:1, name: ""}]
    ctx.apiSuccess(res, "消息来了")
  }
}

module.exports = HomeController;

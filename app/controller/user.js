'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 注册
  async reg() {
    const { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        required: true,
        range: {
          min: 5,
          max: 20
        },
        desc: '用户名'
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码'
      },
      repassword: {
        type: 'string',
        required: true,
        desc: '确认密码'
      }
    }, {
        equals: [
          ['password', 'repassword']
        ]
    });
    const { username, password, repassword } = ctx.request.body;  

    // 判断密码和确认密码是否一致
    // if(password !== repassword){
    //   ctx.throw(400, "密码和确认密码不一致");
    // }

    
    // 验证用户是否已经存在
    if(await app.model.User.findOne({
      where: {
        username
      }
    })){
      ctx.throw(400, "用户名已存在");
    }
    // 创建用户
    const user = await app.model.User.create({
      username,
      password
    })
    if(!user){
      ctx.throw(400, "注册失败");
    }
    ctx.apiSuccess(user);
  }
}

module.exports = UserController;

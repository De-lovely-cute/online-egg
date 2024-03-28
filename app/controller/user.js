'use strict';

const Controller = require('egg').Controller;

const crypto = require('crypto');
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
        // equals: [
        //   ['password', 'repassword']
        // ]
    });
    
    const { username, password, repassword } = ctx.request.body;  
    // 判断密码和确认密码是否一致
    if(password !== repassword){
      ctx.throw(400, "密码和确认密码不相同");
    }
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
  // 登录
  async login() {
    const { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: "string",
        required: true,
        desc: "用户名"
      },
      password: {
        type: "string",
        required: true,
        desc: "密码"
      }
    })
    let { username, password } = ctex.request.body;
    // 验证该用户是否存在
    const user = await app.model.User.findOne({
      where: {
        username
      }
    })
    if(!user) {
      ctx.throw(400, "用户不存在")
    }
    // 验证密码是否正确
    await this.checkPassword(password, user.password)
    user = JSON.parse(JSON.stringify(user))
    // 生成token
    let token = ctx.getToken(user)
    user.token = token
    delete user.password

    // 加入到token缓存中
    if(!await this.service.cache.set(token, user.id)){
      ctx.throw(400, "登录失败")
    }
    // 返回用户信息
    return ctx.apiSuccess(user)
  }
  // 验证密码
  async checkPassword(password, hash_password) {
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret)
    hmac.update(password)
    password = hmac.digest('hex')
    let res = password === hash_password
    if(!res){
      this.ctx.throw(400, "密码错误")
    }
    return true
  }
}

module.exports = UserController;

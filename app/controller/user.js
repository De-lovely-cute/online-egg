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
    if (password !== repassword) {
      ctx.throw(400, "密码和确认密码不相同");
    }
    // 验证用户是否已经存在
    if (await app.model.User.findOne({
      where: {
        username
      }
    })) {
      ctx.throw(400, "用户名已存在");
    }
    // 创建用户
    const user = await app.model.User.create({
      username,
      password
    })
    if (!user) {
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
    let { username, password } = ctx.request.body;
    // 验证该用户是否存在
    let user = await app.model.User.findOne({
      where: {
        username
      }
    });
    if (!user) {
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
    if (!await this.service.cache.set(token, user.id)) {
      ctx.throw(400, "登录失败")
    }
    // 返回用户信息
    return ctx.apiSuccess(user)
  }
  /**
   * 验证密码
   * 
   * 输入的密码和数据库中的密码进行比较
   * 数据库中的密码是加密后的密码
   * @param {*} password
   * @param {*} hash_password 
   * @returns 
   */
  async checkPassword(password, hash_password) {
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret)
    hmac.update(password)
    password = hmac.digest('hex')
    let res = password === hash_password
    if (!res) {
      this.ctx.throw(400, "密码错误")
    }
    return true
  }

  // 退出登录
  async logout() {
    const { ctx, service } = this;
    // 拿到当前用户id
    let current_user_id = ctx.authUser.id;
    // 移除redis中的当前用户
    if (!await service.cache.remove(current_user_id)) {
      ctx.throw(400, "退出登录失败")
    }
    ctx.apiSuccess("退出登录成功")
  }

  // 统计相关数据
  async statistics() {
    const { ctx, service, app } = this;
    let user_id = ctx.authUser.id;

    let followCount = await service.user.getFollowCount(user_id);

    let videoCount = await service.user.getVideoCount(user_id);

    ctx.apiSuccess({
      followCount,
      videoCount
    });
  }

  // 获取用户相关信息
  async user_info() {
    const { ctx, service, app } = this;
    let currentUser = ctx.authUser;

    ctx.validate({
      user_id: {
        required: true,
        desc: "用户id",
        type: "int"
      }
    });

    let user_id = ctx.query.user_id;

    let res = await service.user.getUserInfo(user_id);

    let fensCount = 0;

    let followCount = 0;

    if (res) {
      fensCount = await service.user.getFensCount(user_id);
      followCount = await service.user.getFollowCount(user_id);
    }

    let follow = false;

    if (currentUser) {
      follow = await service.user.isFollow(currentUser.id, user_id);
    }

    ctx.apiSuccess({
      user: res,
      fensCount,
      followCount,
      follow
    });
  }
}

module.exports = UserController;

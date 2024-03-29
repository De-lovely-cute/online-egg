module.exports = (options, app) => {
  return async (ctx, next) => {
    // 1. 获取请求头中的token
    const { token } = ctx.header;
    // 判断token是否存在
    if (!token) {
      ctx.throw(400, "您没有权限访问该接口")
    }
    // 2. 根据token解密，获取用户信息
    let user = {}
    try {
      user = app.jwt.verify(token, app.config.jwt.secret)
    } catch (err) {
      let fail = err.name === "TokenExpiredError" ? "token已过期，请重新登录" : "token验证失败，请重新登录"
      ctx.throw(400, fail)
    }
    // 3. 判断用户是否登录
    let t = await ctx.service.cache.get('user_' + user.id);
    if (!t || t !== token) {
      ctx.throw(400, 'Token 令牌不合法!');
    }
    // 4. 判断用户是否存在
    user = await app.model.User.findOne({
      where: {
        id: user.id
      }
    })
    if (!user) {
      ctx.throw(400, "用户不存在")
    }

    // 5. 把用户信息挂载到ctx上
    ctx.user = user
    await next()
  }
}
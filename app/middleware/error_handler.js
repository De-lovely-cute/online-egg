/**
 * 全局抛出异常处理
 * @param {*} option 
 * @param {*} app 
 * @returns 
 */
module.exports = (option, app) => {
  return async function errorHandler(ctx, next){
    try {
      await next();
      
      if(ctx.status === 404 && !ctx.body) {
        ctx.body = {
          msg: 'fail',
          data: '404 Not Found'
        }
      }
    }catch(err){
      // 所有的异常都会在app上触发一个error事件，框架会记录一条错误日志
      app.emit('error', err, ctx)
      const status = err.status || 500

      // 生产环境时 500 错误的详细信息不返回给客户端, 以免泄露敏感信息
      let error = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message

      ctx.body = {
        msg: 'fail',
        data: error
      }

      // 参数校验异常
      if(status === 422 && err.message === 'Validation Failed'){
        if(err.errors && Array.isArray(err.errors)){
          error = err.errors[0].err[0] ? err.errors[0].err[0] : err.errors[0].err[1]
        }
        ctx.body = {
          msg: 'fail',
          data: error
        }
      }
      ctx.status = status
    }
  }

}
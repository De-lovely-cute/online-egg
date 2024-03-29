/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1711035201149_7176';

  // add your middleware config here
  // 注册中间件 全局抛出异常处理
  config.middleware = ['errorHandler', 'auth'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  /**
   * 关闭csrf开启跨域
   */
  config.security = {
    // 关闭 csrf
    csrf: {
      enable: false,
    },
    // 跨域白名单
    domainWhiteList: ["http://localhost:3000"],
  };
  
  // 允许跨域的方法
  config.cors = {
    origin: "*",
    allowMethods: "GET, PUT, POST, DELETE, PATCH",
  };
  // sequelize数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'egg-video',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_time updated_time
      timestamps: true,
      // 字段生成软删除时间戳 deleted_time
      // paranoid: true,
      createdAt: 'created_time',
      updatedAt: 'updated_time',
      // deletedAt: 'deleted_time',
      // 所有驼峰命名格式化
      underscored: true,
    }

    
  }

  // 数据加密
  config.crypto = {
    secret: "qhdgw@45ncashdaksh2!#@3nxjdas*_672",
  }

  // 参数验证
  config.valparams = {
    locale    : 'zh-cn',
    throwError: true
  };

  // jwt加密鉴权
  config.jwt = {
    secret: "qhdgw@45ncashdaksh2!#@3nxjdas*_672",
  };

  // redis存储
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: "127.0.0.1", // Redis host
      password: "",
      db: 2,
    },
  };

  // 配置那些路由需要验证
  config.auth = {
    //ignore: ['/reg', '/login']
    match: [
      "/logout",
      "/video",
      "/video_detail",
      "/vod/sign",
      "/comment",
      "/fava",
      "/user/follow",
      "/user/unfollow",
      "/user/follows",
      "/user/fens",
      "/user/statistics",
    ],
  };
  
  // 上传图片
  config.multipart = {
    fileSize: "50mb",
    mode: "stream",
    fileExtensions: [
      ".xls",
      ".txt",
      ".jpg",
      ".JPG",
      ".png",
      ".PNG",
      ".gif",
      ".GIF",
      ".jpeg",
      ".JPEG",
    ], // 扩展几种上传的文件格式
  };
  return {
    ...config,
    ...userConfig,
  };
};

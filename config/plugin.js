/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  cors:{
    enable: true,
    package: 'egg-cors',
  },

  // sequelize数据库配置
  sequelize:{
    enable: true,
    package: 'egg-sequelize',
  },

  // 参数校验
  valparams : {
    enable : true,
    package: 'egg-valparams'
  },

  // jwt加密鉴权
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },

  // redis插件
  redis: {
    enable: true,
    package: "egg-redis",
  }
};


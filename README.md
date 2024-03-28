# online-egg



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
npm i
npm run dev
open http://localhost:7001/
```

### Deploy

```bash
npm start
npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[egg]: https://eggjs.org


## 解决 egg-bin 安装不了问题
```
直接在https://www.npmjs.com/package/egg-bin上面安装最新的
```
# 关闭csrf开启跨域
``npm i egg-cors --save``
## 配置插件
```
// {app_root}/config/plugin.js
cors:{
  enable: true,
  package: 'egg-cors',
},
```
### config / config.default.js 目录下配置
```
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
```

# sequelize数据库配置
## 安装并配置egg-sequelize插件（它会辅助我们将定义好的 Model 对象加载到 app 和 ctx 上）和mysql2模块：
``npm install --save egg-sequelize mysql2``
## 在config/plugin.js中引入 egg-sequelize 插件
```
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
```
## 在config/config.default.js
```
config.sequelize = {
  dialect: "mysql",
  host: "127.0.0.1",
  username: "root",
  password: "root",
  port: 3306,
  database: "egg-video",
  // 中国时区
  timezone: "+08:00",
  define: {
    // 取消数据表名复数
    freezeTableName: true,
    // 自动写入时间戳 created_at updated_at
    timestamps: true,
    // 字段生成软删除时间戳 deleted_at
    // paranoid: true,
    createdAt: "created_time",
    updatedAt: "updated_time",
    // deletedAt: 'deleted_time',
    // 所有驼峰命名格式化
    underscored: true,
  },
};
```
# 数据库迁移配置
## sequelize 提供了sequelize-cli工具来实现Migrations，我们也可以在 egg 项目中引入 sequelize-cli。
``npm install --save-dev sequelize-cli``

## egg 项目中，我们希望将所有数据库 Migrations 相关的内容都放在database目录下，所以我们在项目根目录下新建一个.sequelizerc配置文件：
```
"use strict";

const path = require("path");

module.exports = {
  config: path.join(__dirname, "database/config.json"),
  "migrations-path": path.join(__dirname, "database/migrations"),
  "seeders-path": path.join(__dirname, "database/seeders"),
  "models-path": path.join(__dirname, "app/model"),
};
```
## 初始化 Migrations 配置文件和目录， 直接在控制台输入
```
npx sequelize init:config
npx sequelize init:migrations
#  npx sequelize init:models
```
## 执行完后会生成database/config.json文件和database/migrations目录，我们修改一下database/config.json中的内容，将其改成我们项目中使用的数据库配置：
```
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "egg-video",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  }
}
```
## 创建数据库
``npx sequelize db:create``
```
# 升级数据库
npx sequelize db:migrate
# 如果有问题需要回滚，可以通过 `db:migrate:undo` 回退一个变更
# npx sequelize db:migrate:undo
# 可以通过 `db:migrate:undo:all` 回退到初始状态
# npx sequelize db:migrate:undo:all
```

# 模型关联
```
User.associate = function (models) {
  // 关联用户资料 一对一
  User.hasOne(app.model.Userinfo);
  // 反向一对一关联
  // Userinfo.belongsTo(app.model.User);
  // 一对多关联
  User.hasMany(app.model.Post);
  // 反向一对多关联
  // Post.belongsTo(app.model.User);
  // 多对多
  // User.belongsToMany(Project, { as: 'Tasks', through: 'worker_tasks', foreignKey: 'userId' })
  // 反向多对多
  // Project.belongsToMany(User, { as: 'Workers', through: 'worker_tasks', foreignKey: 'projectId' })
};
```
# 数据表设计和迁移
## 用户相关
``npx sequelize migration:generate --name=user``
### 执行完命令后，会在database / migrations / 目录下生成数据表迁移文件，然后定义
```
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("user", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: STRING(30),
        allowNull: false,
        defaultValue: "",
        comment: "用户名",
        unique: true,
      },
      nickname: {
        type: STRING(30),
        allowNull: false,
        defaultValue: "",
        comment: "...",
      },
      email: {
        type: STRING(160),
        allowNull: false,
        defaultValue: "",
        comment: "邮箱",
      },
      password: {
        type: STRING,
        allowNull: false,
        defaultValue: "",
        comment: "密码",
      },
      avatar: {
        type: STRING,
        allowNull: true,
        defaultValue: "",
        comment: "头像",
      },
      phone: {
        type: STRING(11),
        allowNull: false,
        defaultValue: "",
        comment: "手机",
      },
      sex: {
        type: ENUM,
        values: ["男", "女", "保密"],
        allowNull: false,
        defaultValue: "男",
        comment: "性别",
      },
      desc: {
        type: TEXT,
        allowNull: false,
        defaultValue: "",
        comment: "个性签名",
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("user");
  },
};
```
+ 执行 migrate 进行数据库变更
``npx sequelize db:migrate``
### 模型创建
```
// app/model/user.js
"use strict";
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;
  // 配置（重要：一定要配置详细，一定要！！！）
  const User = app.model.define("user", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(30),
      allowNull: false,
      defaultValue: "",
      comment: "用户名",
      unique: true,
    },
    nickname: {
      type: STRING(30),
      allowNull: false,
      defaultValue: "",
      comment: "...",
    },
    email: {
      type: STRING(160),
      allowNull: false,
      defaultValue: "",
      comment: "邮箱",
    },
    password: {
      type: STRING,
      allowNull: false,
      defaultValue: "",
      comment: "密码",
    },
    avatar: {
      type: STRING,
      allowNull: true,
      defaultValue: "",
      comment: "头像",
    },
    phone: {
      type: STRING(11),
      allowNull: false,
      defaultValue: "",
      comment: "手机",
    },
    sex: {
      type: ENUM,
      values: ["男", "女", "保密"],
      allowNull: false,
      defaultValue: "男",
      comment: "性别",
    },
    desc: {
      type: TEXT,
      allowNull: false,
      defaultValue: "",
      comment: "个性签名",
    },
    created_time: DATE,
    updated_time: DATE,
  });
  return User;
};
```


## [接口文档](https://dishaxy.com/doc/7/)

# 解决 egg-bin 安装不了问题

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

## 分类相关

``npx sequelize migration:generate --name=category``

### 执行完命令后，会在database / migrations / 目录下生成数据表迁移文件，然后定义

```
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("category", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: STRING(100),
        allowNull: false,
        defaultValue: "",
        comment: "分类名称",
      },
      cover: {
        type: STRING,
        allowNull: true,
        defaultValue: "",
        comment: "分类图标",
      },
      desc: {
        type: TEXT,
        allowNull: false,
        defaultValue: "",
        comment: "分类描述",
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("category");
  },
};
```

+ 执行 migrate 进行数据库变更
  ``npx sequelize db:migrate``

### 模型创建

```
// app/model/category.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const Category = app.model.define("category", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "分类名称",
    },
    cover: {
      type: STRING,
      allowNull: true,
      defaultValue: "",
      comment: "分类图标",
    },
    desc: {
      type: TEXT,
      allowNull: false,
      defaultValue: "",
      comment: "分类描述",
    },
    created_time: DATE,
    updated_time: DATE,
  });

  return Category;
};
```

## 作品相关

### 创建数据迁移表

```
npx sequelize migration:generate --name=video
npx sequelize migration:generate --name=video_detail
npx sequelize migration:generate --name=video_play
```

### 执行完命令后，会在database / migrations / 目录下生成数据表迁移文件，然后定义

```
// video
"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("video", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: STRING(100),
        allowNull: false,
        defaultValue: "",
        comment: "视频标题",
      },
      cover: {
        type: STRING,
        allowNull: true,
        defaultValue: "",
        comment: "视频封面",
      },
      category_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "分类id",
        references: {
          model: "category",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "用户id",
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      duration: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "总时长",
      },
      desc: {
        type: TEXT,
        allowNull: false,
        defaultValue: "",
        comment: "视频描述",
      },
      play_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "播放量",
      },
      danmu_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "弹幕量",
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("video");
  },
};
```

```
// video_detail
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("video_detail", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: STRING(100),
        allowNull: false,
        defaultValue: "",
        comment: "子标题",
      },
      video_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "视频id",
        references: {
          model: "video",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      url: {
        type: STRING,
        allowNull: true,
        defaultValue: "",
        comment: "视频链接",
      },
      desc: {
        type: TEXT,
        allowNull: false,
        defaultValue: "",
        comment: "子描述",
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("video_detail");
  },
};
```

```
// video_play
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("video_play", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      ip: {
        type: STRING(50),
        allowNull: false,
        defaultValue: 0,
        comment: "ip地址",
      },
      video_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "视频id",
        references: {
          model: "video",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("video_play");
  },
};
```

### 执行 migrate 进行数据库变更 npx sequelize db:migrate 模型创建

```
// app/model/video.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const Video = app.model.define("video", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "视频标题",
    },
    cover: {
      type: STRING,
      allowNull: true,
      defaultValue: "",
      comment: "视频封面",
    },
    category_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "分类id",
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "用户id",
    },
    duration: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "总时长",
    },
    desc: {
      type: TEXT,
      allowNull: false,
      defaultValue: "",
      comment: "视频描述",
    },
    created_time: {
      type: DATE,
      get() {
        return (new Date(this.getDataValue("created_time"))).getTime();
      },
    },
    play_count: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "播放量",
    },
    danmu_count: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "弹幕量",
    },
    updated_time: DATE,
  });

  // 关联关系
  Video.associate = function (models) {
    // 关联作者
    Video.belongsTo(app.model.User);
    // 关联子视频
    Video.hasMany(app.model.VideoDetail);
  };

  return Video;
};
```

```
// app/model/video_detail.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const VideoDetail = app.model.define("video_detail", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "子标题",
    },
    video_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "视频id",
    },
    url: {
      type: STRING,
      allowNull: true,
      defaultValue: "",
      comment: "视频链接",
    },
    desc: {
      type: TEXT,
      allowNull: false,
      defaultValue: "",
      comment: "子描述",
    },
    created_time: DATE,
    updated_time: DATE,
  });

  // 关联关系
  VideoDetail.associate = function (models) {
    // 关联视频
    VideoDetail.belongsTo(app.model.Video);
  };

  return VideoDetail;
};
```

```
// app/model/video_play.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const VideoPlay = app.model.define("video_play", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    ip: {
      type: STRING(50),
      allowNull: false,
      defaultValue: 0,
      comment: "ip地址",
    },
    video_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "视频id",
    },
    created_time: DATE,
    updated_time: DATE,
  });

  return VideoPlay;
};
```

## 收藏相关

``npx sequelize migration:generate --name=fava``

### 执行完命令后，会在database / migrations / 目录下生成数据表迁移文件，然后定义

```
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("fava", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "用户id",
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      video_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "视频id",
        references: {
          model: "video",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("fava");
  },
};
```

+ 执行 migrate 进行数据库变更
  ``npx sequelize db:migrate``

### 模型创建

```
// app/model/fava.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const Fava = app.model.define("fava", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "用户id",
    },
    video_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "视频id",
    },
    created_time: DATE,
    updated_time: DATE,
  });

  // 关联关系
  Fava.associate = function (models) {
    // 关联作者
    Fava.belongsTo(app.model.User);
    // 关联视频
    Fava.belongsTo(app.model.Video);
  };

  return Fava;
};
```

## 评论相关

``npx sequelize migration:generate --name=comment``

### 执行完命令后，会在database / migrations / 目录下生成数据表迁移文件，然后定义

```
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("comment", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: TEXT,
        allowNull: false,
        defaultValue: "",
        comment: "评论内容",
      },
      video_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "视频id",
        references: {
          model: "video",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "用户id",
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      reply_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "回复id",
      },
      reply_user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "回复用户id",
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("comment");
  },
};
```

+ 执行 migrate 进行数据库变更
  ``npx sequelize db:migrate``

### 模型创建

```
// app/model/comment.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const Comment = app.model.define("comment", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: TEXT,
      allowNull: false,
      defaultValue: "",
      comment: "评论内容",
    },
    video_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "视频id",
      references: {
        model: "video",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "restrict", // 更新时操作
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "用户id",
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "cascade",
      onUpdate: "restrict", // 更新时操作
    },
    reply_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "回复id",
    },
    reply_user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "回复用户id",
    },
    created_time: DATE,
    updated_time: DATE,
  });

  // 关联关系
  Comment.associate = function (models) {
    // 关联作者
    Comment.belongsTo(app.model.User, {
      foreignKey: "user_id",
      as: "send_user",
    });
    // 关联被回复人
    Comment.belongsTo(app.model.User, {
      foreignKey: "reply_user_id",
      as: "reply_user",
    });
    // 关联视频
    Comment.belongsTo(app.model.Video);

    // 关联回复
    Comment.hasMany(app.model.Comment, {
      foreignKey: "reply_id",
    });
  };

  return Comment;
};
```

## 关注相关

``npx sequelize migration:generate --name=follow``

### 执行完命令后，会在database / migrations / 目录下生成数据表迁移文件，然后定义

```
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable("follow", {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: INTEGER,
        allowNull: true,
        comment: "用户id",
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      follow_id: {
        type: INTEGER,
        allowNull: true,
        comment: "关注id",
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "restrict", // 更新时操作
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("follow");
  },
};
```

+ 执行 migrate 进行数据库变更
  ``npx sequelize db:migrate``

### 模型创建

```
// app/model/follow.js
module.exports = (app) => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

  const Follow = app.model.define("follow", {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: true,
      comment: "用户id",
    },
    follow_id: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "关注id",
    },
    created_time: DATE,
    updated_time: DATE,
  });

  // 关联关系
  Follow.associate = function (models) {
    // 关联粉丝
    Follow.belongsTo(app.model.User, {
      as: "user_follow",
      foreignKey: "follow_id",
    });
    // 关联粉丝
    Follow.belongsTo(app.model.User, {
      as: "user_fen",
      foreignKey: "user_id",
    });
  };

  return Follow;
};
```

[egg]: https://eggjs.org


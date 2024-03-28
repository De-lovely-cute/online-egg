module.exports = (app) => {
  const { INTEGER, DATE, TEXT } = app.Sequelize;

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
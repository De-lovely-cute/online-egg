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
      comment: "作品标题",
    },
    cover: {
      type: STRING,
      allowNull: true,
      defaultValue: "",
      comment: "作品封面",
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
      comment: "作品描述",
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
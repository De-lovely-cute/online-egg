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
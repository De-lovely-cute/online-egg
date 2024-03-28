'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("video");
  }
};

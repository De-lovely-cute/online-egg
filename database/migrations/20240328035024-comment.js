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
    const { INTEGER, DATE, TEXT } = Sequelize;
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("comment");
  }
};

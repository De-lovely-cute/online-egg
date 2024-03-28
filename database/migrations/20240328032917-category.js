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
    return queryInterface.createTable('categories', {
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("category");
  }
};

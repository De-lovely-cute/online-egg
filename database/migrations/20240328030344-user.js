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
    return queryInterface.createTable('user', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '用户名',
        unique: true
      },
      password: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: "密码"
      },
      nickname: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '昵称'
      },
      email: {
        type: STRING(160),
        allowNull: false,
        defaultValue: '',
        comment: '邮箱'
      },
      avatar: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '头像'
      },
      phone: {
        type: STRING(11),
        allowNull: false,
        defaultValue: '',
        comment: "手机号"
      },
      sex: {
        type: ENUM,
        allowNull: false,
        values: ['男', '女', '保密'],
        defaultValue: "男",
        comment: "性别"
      },
      desc: {
        type: TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '个性签名'
      },
      created_time: DATE,
      updated_time: DATE
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     * 如果在下次想要修改表结构，需要先执行下面的命令
     * Example:
     * await queryInterface.dropTable('users');
     */
    
    return queryInterface.dropTable('user');
  }
};

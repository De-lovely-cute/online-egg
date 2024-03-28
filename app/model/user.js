'use strict';
const crypto = require('crypto');

module.exports = (app) => {
  const { INTEGER, STRING, DATE, ENUM, TEXT } = app.Sequelize;
  const User = app.model.define("user", {
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
      comment: "密码",
      set(val) {
        const hmac = crypto.createHash("sha256", app.config.crypto.secret);
        hmac.update(val);
        this.setDataValue('password', hmac.digest("hex"));
      }
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
  return User;
}


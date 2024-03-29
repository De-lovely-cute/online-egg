'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    // 用户是否存在
    async exist(user_id) {
        const { app } = this;
        return await app.model.User.findOne({
            where: {
                id: user_id
            }
        });
    }

    // 指定用户关注人数
    async getFollowCount(user_id) {
        return this.app.model.Follow.count({
            where: {
                user_id
            }
        });
    }

    // 指定用户粉丝人数
    async getFenCount(user_id) {
        return this.app.model.Follow.count({
            where: {
                follow_id: user_id
            }
        });
    }

    // 指定用户的作品量
    async getVideoCount(user_id) {
        return this.app.model.Video.count({
            where: {
                user_id
            }
        });
    }

    // 是否关注某人
    async isFollow(user_id, follow_id) {
        return !!(await this.app.model.Follow.findOne({
            where: {
                user_id,
                follow_id
            }
        }));
    }

    // 用户相关信息
    async getUserInfo(user_id) {
        return await this.app.model.User.findOne({
            where: {
                id: user_id
            },
            attributes: {
                exclude: ['password']
            }
        });
    }

}

module.exports = UserService;

const rules = {
  title: { type: 'string', required: true, desc: '作品标题' },
  cover: { type: 'string', required: true, desc: '作品封面' },
  category_id: { type: 'int', required: true, desc: '分类id' },
  desc: { type: 'string', required: true, desc: '作品描述' },
}

class VideoController extends Controller {
  // 创建作品
  async save() {
    const { ctx, app } = this;
    let currentUser = ctx.authUser;
    // 参数验证
    ctx.validate(rules)
    let { title, cover, category_id, desc } = ctx.request.body;
    // 创建内容
    let video = await ctx.model.Video.create({
      title, cover, category_id, desc, user_id: currentUser.id
    })
    if (!video) {
      return ctx.apiFail('创建作品失败');
    }
    ctx.apiSuccess(video);
  }

  // 当前用户的视频列表
  async index() {
    let { ctx, app } = this;
    let currentUser = ctx.authUser;
    ctx.validate({
      page: {
        required: true,
        desc: "页码",
        type: "int"
      },
      user_id: {
        required: true,
        desc: "用户id",
        type: "int"
      }
    });
    let user_id = ctx.query.user_id;
    let rows = await ctx.page(app.model.Video, {
      user_id
    });
    ctx.apiSuccess(rows);
  }
  // 更新作品
  async update() {
    let { ctx, app } = this;
    let currentUser = ctx.authUser;

    ctx.validate({
      id: {
        type: "int",
        required: true,
        desc: "视频ID"
      },
      ...rules
    });

    let {
      title,
      cover,
      category_id,
      desc,
    } = ctx.request.body;

    let video = await app.model.Video.findOne({
      where: {
        id: ctx.params.id,
        user_id: currentUser.id
      }
    });

    if (!video) {
      return ctx.throw(404, '该记录不存在');
    }

    let res = await video.update({
      title,
      cover,
      category_id,
      desc,
    });

    ctx.apiSuccess(res);
  }
}
module.exports = VideoController;
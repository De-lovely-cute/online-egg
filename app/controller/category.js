class CategoryController extends Controller {
  // Add your controller methods here
  // 获取分类列表
  async index() {
    const { ctx, app } = this
    let rows = await ctx.model.Category.findAll()
    ctx.apiSuccess(rows)
  }
}

module.exports = CategoryController;
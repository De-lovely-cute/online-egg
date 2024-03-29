/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post("/reg", controller.user.reg);
  router.post("/login", controller.user.login);
  router.get("/logout", controller.user.logout);
  router.get("/category", controller.category.index);
  // 统计相关数据
  router.get("/user/statistics", controller.user.statistics);
  // 获取用户相关信息
  router.get("/user/user_info", controller.user.user_info);
  // 添加视频
  router.post("/video", controller.video.save);
  // 上传文件
  router.post("/upload", controller.file.upload);
  router.get("/video_list/:page", controller.video.index);
  // 更新视频
  router.post("/video/:id", controller.video.update);
};

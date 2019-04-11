const studentController = require('./controller/student');



module.exports = (router) => {
  router.prefix('/api');
  router
  	.get('/profile',studentController.profile)
    .post('/stu_overview',studentController.overview)

};

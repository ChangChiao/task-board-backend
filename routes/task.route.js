const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/checkFile');
const taskValidation = require('../validations/task.validation');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router
  .route('/')
  .get(taskController.getTask)
  .post(auth(), upload.single("cover"), taskController.createTask)

router
  .route('/:taskId')
  .post(auth(), taskController.applyTask)
  .patch(auth(), taskController.updateTask)
  .delete(auth(), taskController.deleteTask);
  // .get(auth(), validate(taskValidation.getUser), taskController.getTaskByUser)
router
  .route('/:taskId/applicant')
  .patch(auth(), taskController.applyTask)
  .delete(auth(), taskController.cancelApplyTask)

router
  .route('/:taskId/staff')
  .post(auth(), validate(taskValidation.pickStaff), taskController.pickStaff)


router
  .route('/createTaskList')
  .get(auth(), taskController.getUserCreateTaskList)


  router
  .route('/applyTaskList')
  .get(auth(), taskController.getUserApplyTaskList)

module.exports = router;

const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const taskValidation = require('../validations/task.validation');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), taskController.getTask)
  .post(auth(), validate(taskValidation.addTask), taskController.createTask)

router
  .route('/:taskId')
  // .get(auth(), validate(taskValidation.getUser), taskController.getTaskByUser)
  // .patch(auth(), validate(taskValidation.updateUser), taskController.updateTask)
  // .delete(auth(), validate(taskValidation.deleteUser), taskController.deleteTask);

module.exports = router;

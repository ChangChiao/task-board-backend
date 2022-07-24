const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .post(auth(), validate(userValidation.createUser), userController.createUser);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUserById), userController.getUserById)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;


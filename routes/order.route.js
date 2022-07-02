const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router
  .route('/')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .post(auth('manageUsers'), validate(orderValidation.createOrder), orderController.createOrder)

module.exports = router;
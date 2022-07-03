const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(orderValidation.createOrder), orderController.createOrder)
//   .post(auth(), validate(orderValidation.createOrder), orderController.createOrder)

  router
  .route('/:orderId')
  .get(auth(), validate(orderValidation.getOrder), orderController.getOrder)

module.exports = router;
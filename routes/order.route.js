const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(orderValidation.createOrder), orderController.createOrder)
//   .post(auth(), validate(orderValidation.createOrder), orderController.createOrder)

//   router
//   .route('/:orderId')
//   .get(validate(orderValidation.getOrder), orderController.getOrder)

router
.route('/notify')
.post(orderController.notifyOrder)

module.exports = router;
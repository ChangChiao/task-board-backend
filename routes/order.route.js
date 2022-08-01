const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), orderController.createOrder)


router
.route('/notify')
.post(auth(), orderController.notifyOrder)

module.exports = router;
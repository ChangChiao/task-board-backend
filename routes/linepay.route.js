const express = require('express');
const auth = require('../middlewares/auth');
const linepayController = require('../controllers/linepay.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), linepayController.createOrder)


router
.route('/confirm')
.get(linepayController.confirmOrder)

module.exports = router;
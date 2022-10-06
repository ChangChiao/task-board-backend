const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const collectValidation = require('../validations/collect.validation');
const collectController = require('../controllers/collect.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), collectController.getCollect)
  
  router
  .route('/:taskId')
  .post(auth(), collectController.addCollect)
  .delete(auth(), collectController.removeCollect);


  module.exports = router;
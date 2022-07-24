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
  .route('/:cardId')
  .post(auth(), validate(collectValidation.addCollect), collectController.addCollect)
  .delete(auth(), validate(collectValidation.removeCollect), collectController.removeCollect);


  module.exports = router;
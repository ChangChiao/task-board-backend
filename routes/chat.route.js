const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const collectValidation = require('../validations/collect.validation');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), chatController.getRoomId)
  
  router
  .get('/room-info/:receiverId')
//   .post(auth(), collectController.addCollect)
//   .delete(auth(), collectController.removeCollect);


  module.exports = router;
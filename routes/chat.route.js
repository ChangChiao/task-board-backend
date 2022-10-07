const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const chatValidation = require("../validations/chat.validation");
const chatController = require("../controllers/chat.controller");

const router = express.Router();

router.route("/chat-record").get(auth(), chatController.getChatRecord);

router.post(
  "/room-info",
  auth(),
  validate(chatValidation.getRoomInfo()),
  chatController.getRoomId
);

module.exports = router;

const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const upload = require("../middlewares/checkFile");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");

const router = express.Router();

router
  .route("/")
  .get(auth(), userController.getUser)
  .post(auth(), validate(userValidation.createUser), userController.createUser)
  .patch(
    auth(),
    upload.single("avatar"),
    validate(userValidation.updateUser),
    userController.updateUser
  );

router.route("/favorite").get(auth(), userController.getFavorite);

router
  .route("/:userId")
  .get(auth(), validate(userValidation.getUserById), userController.getUserById)
  .delete(
    auth(),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

module.exports = router;

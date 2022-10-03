const express = require("express");
const passport = require("passport");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

// google登入
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

//使用者授權成功後給google通知後端用的api
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  authController.signInByGoogle
);

router.get("/facebook", passport.authenticate("facebook"));
// facebook callback

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
  }),
  authController.signInByFacebook
);

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);
router.get(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

module.exports = router;

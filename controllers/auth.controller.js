const httpStatus = require("http-status");
const path = require("path");
const { User } = require("../models");
const catchAsync = require("../utils/catchAsync");
const {
  oauthService,
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    data: { user, tokens },
    message: "註冊成功",
    status: "success"
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  await userService.checkUserStatus(email);
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({
    data: { user, tokens },
    message: "註冊成功",
    status: "success"
  });
});

const signInByGoogle = catchAsync(async (req, res) => {
  const { sub, email, name, picture } = req.user;
  const data = {
    id: sub,
    email,
    name,
    picture,
  };
  oauthService.thirdPartySignIn("google", data, res);
});

const signInByFacebook = catchAsync(async (req, res) => {
  const { id, email, name, picture } = req.user;
  const data = {
    id,
    email,
    name,
    picture: picture.data.url,
  };
  oauthService.thirdPartySignIn("facebook", data, res);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send({
    message: "登出成功",
    status: "success"
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.query.code)
  // console.log('user', user);
  if (!user) {
    return res.sendFile(
      path.join(__dirname, "../public/emailCheckFailed.html")
    );
  }
  let activeStatus;
  if (user.activeStatus === "none") {
    activeStatus = "normal";
  } else if (user.activeStatus === "third") {
    activeStatus = "both";
  } else {
    return res.sendFile(
      path.join(__dirname, "../public/emailCheckFailed.html")
    );
  }
  await User.findByIdAndUpdate(user._id, {
    activeStatus,
  });

  res.sendFile(path.join(__dirname, '../public/emailCheckSuccess.html'));
  // res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  signInByGoogle,
  signInByFacebook,
  sendVerificationEmail,
  verifyEmail,
};

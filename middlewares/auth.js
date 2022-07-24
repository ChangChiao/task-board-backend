const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  console.log('err', err, info ,user);
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  req.user = user;
  resolve();
};

const auth = () => async (req, res, next) => {
  console.log("auth", auth);
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, verifyCallback(req, resolve, reject));
  })
    .then((info) => {
      next();
    })
    .catch((err) => next(err));
};

module.exports = auth;

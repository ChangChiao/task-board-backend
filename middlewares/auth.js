const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    console.log("error", info);
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "請重新登入"));
  }
  req.user = user;
  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => {
      next();
    })
    .catch((err) => next(err));
};

module.exports = auth;

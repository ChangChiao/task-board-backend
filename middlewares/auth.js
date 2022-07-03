const passport = require('passport');

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false });
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;

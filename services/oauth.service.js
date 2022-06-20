const uuid = require("uuid");
const bcrypt = require("bcrypt");
const config = require('../config/config')
const { User } = require("../models");
const { generateToken } = require("./token.service");

const thirdPartyObj = {
  google: "googleId",
  faceBook: "facebookId"
}

const thirdPartyRedirect = (user, res) => {
    const token = generateToken(user, res)
    let path = `${config.frontEnd}?token=${token}&id=${user._id}&name=${user.name}&avatar=${user.avatar.url}`;
    res.redirect(path);
};

const thirdPartySignIn = async (thirdPartyName, data, res) => {
  const { id, email, name, picture } = data;

  const userExisted = await User.findOne({ [thirdPartyObj[thirdPartyName]]: id });

  if (!userExisted) {
    const randomPassword = uuid.v4();
    const password = await bcrypt.hash(randomPassword, 12);
    const newUserData = {
      email,
      name,
      avatar: picture,
      password,
    };
    user = await User.create(newUserData);
  }

  thirdPartyRedirect(user, res);
};

module.exports = {
    thirdPartySignIn
};

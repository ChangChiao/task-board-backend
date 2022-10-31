const uuid = require("uuid");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const { User } = require("../models");
const { generateToken } = require("./token.service");

const thirdPartyRedirect = (user, res) => {
  const token = generateToken(user, res);
  let path = `${config.frontEnd}`;
  res.cookie("token", token, {
    httpOnly: false,
    path: "/",
    sameSite: "none",
    secure:  process.env.NODE_ENV !== "development",
    domain:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://task-board-theta.vercel.app",
  });
  // res.cookie("token", token , {httpOnly: false, secure: false});
  res.redirect(path);
};

const thirdPartySignIn = async (thirdPartyName, data, res) => {
  const { id, email, name, picture } = data;
  const thirdPartyKey = `${thirdPartyName}Id`;

  let userExisted = await User.findOne({ email }).select(
    `+${thirdPartyKey} +activeStatus`
  );
  let user = userExisted;
  if (!userExisted) {
    const randomPassword = uuid.v4();
    const password = await bcrypt.hash(randomPassword, 12);
    const newUserData = {
      email,
      name,
      avatar: picture,
      password,
      activeStatus: "third",
      [`${thirdPartyKey}`]: id,
    };
    user = await User.create(newUserData);
  } else {
    const userStatus = {};
    if (!userExisted[thirdPartyKey]) {
      userStatus.activeStatus =
        userStatus.activeStatus === "none" ? "third" : "both";
    }
    userStatus[thirdPartyKey] = id;
    await User.updateOne({ email }, userStatus);
  }

  thirdPartyRedirect(user, res);
};

module.exports = {
  thirdPartySignIn,
};

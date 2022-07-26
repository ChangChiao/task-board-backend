const { User } = require("../models");
const getCollect = async (userBody) => {
  const user = userBody._id;
  const collect = await User.findById(user).select("collect");
  return collect;
};

const addCollect = async (userBody) => {
  const cardId = userBody.query.cardId;
  const user = userBody._id;
  const collect = await User.findByIdAndUpdate(
    { _id: user },
    { $push: { collect: cardId } }
  );
  return collect;
};

const removeCollect = async (userBody) => {
  const cardId = userBody.query.cardId;
  const user = userBody._id;
  const collect = await User.findByIdAndUpdate(
    { _id: user },
    { $pull: { collect: cardId } }
  );
  return collect;
};

module.exports = {
  getCollect,
  addCollect,
  removeCollect,
};

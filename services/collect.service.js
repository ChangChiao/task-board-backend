const { User } = require("../models");
const getCollect = async (req) => {
  const user = req.user._id;
  const collect = await User.findById(user).select("collect");
  return collect;
};

const addCollect = async (req) => {
  const taskId = req.params?.taskId;
  const userId = req.user._id;
  const collect = await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { collect: taskId } }
  );
  return collect;
};

const removeCollect = async (req) => {
  const taskId = req.params?.taskId;
  const userId = req.user._id;
  const collect = await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { collect: taskId } }
  );
  return collect;
};

module.exports = {
  getCollect,
  addCollect,
  removeCollect,
};

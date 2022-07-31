const { Task, User } = require("../models");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const { ImgurClient } = require("imgur");
const getTask = async (userBody) => {
  const { order, city, keyword } = userBody;
  const task = await Task.find({ city }, { $text: { $search: keyword } }).sort({
    pay: order === "desc" ? -1 : 1,
  });
  return task;
};

const getUserTask = async (req) => {
  const userId = req.params?.userId;
  const status = req.body.status;
  const task = await User.find({ author: userId, status });
  return task;
};

const createTask = async (req) => {
  const client = new ImgurClient({
    clientId: config.imgur.client_id,
    clientSecret: config.imgur.client_secret,
    refreshToken: config.imgur.refresh_token,
  });
  const response = await client.upload({
    image: req.files[0].buffer.toString("base64"),
    type: "base64",
    album: config.imgur.album_id,
  });
  if (response.status === 200) {
    userBody.cover = response.data.link;
  }else{
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "服務異常，請再試一次");
  }
  const user = req.user._id;
  const task = await Task.create(userBody);
  await User.findByIdAndUpdate(
    { _id: user },
    { $push: { createTaskList: task._id } }
  );
  return task;
};

const updateTask = async (userBody) => {
  const taskId = req.params?.taskId;
  const task = await Task.findByIdAndUpdate({ _id: taskId }, { userBody });
  return task;
};

const applyTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  await User.findByIdAndUpdate(
    { _id: user },
    { $push: { applyTaskList: taskId } }
  );
  await Task.findByIdAndUpdate({ _id: taskId }, { $push: { applicant: user } });
};

const cancelApplyTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  await User.findByIdAndUpdate(
    { _id: user },
    { $pull: { applyTaskList: taskId } }
  );
  await Task.findByIdAndUpdate({ _id: taskId }, { $pull: { applicant: user } });
};

const pickStaff = async (req) => {
  const taskId = req.params?.taskId;
  const staff = req.body.staff;
  const task = await Task.findById(taskId);
  if (task.status !== 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "該任務已結束");
  }
  await Task.findByIdAndUpdate({ _id: taskId }, { staff, status: 1 });
};

const deleteTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  const task = await Task.findByIdAndDelete(taskId);
  await User.findByIdAndUpdate(
    { _id: user },
    { $pull: { createTaskList: taskId } }
  );
  return task;
};

const getUserCreateTaskList = async (req) => {
  const userId = req.user._id;
  const task = await User.find({
    _id: userId,
  }).select("createTaskList");
  return task;
};

const getUserApplyTaskList = async (req) => {
  const userId = req.user._id;
  const task = await User.find({
    _id: userId,
  }).select("applyTaskList");
  return task;
};

module.exports = {
  getTask,
  getUserTask,
  createTask,
  updateTask,
  deleteTask,
  applyTask,
  cancelApplyTask,
  pickStaff,
  getUserCreateTaskList,
  getUserApplyTaskList,
};

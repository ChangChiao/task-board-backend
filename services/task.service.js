const { Task } = require("../models");
const { findById } = require("../models/token.model");
const getTask = async (userBody) => {
  const { order, city, keyword } = userBody;
  const task = await Task.find({ city }, { $text: { $search: keyword } }).sort({
    pay: order === "desc" ? -1 : 1,
  });
  return task;
};

const getTaskByUser = async (userBody) => {
  const task = await Task.findById(userBody._id);
  return task;
};

const createTask = async (userBody) => {
  const task = await Task.create(userBody);
  return task;
};
const updateTask = async (userBody) => {
  const task = await Task.findByIdAndUpdate(userBody._id, { userBody });
  return task;
};

const applyTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  const isExist = await Task.find(
    { _id: taskId },
    { applicant: { $elemMatch: { $eq: user } } }
  );
  if (isExist) {
    await Task.findByIdAndUpdate(
      { _id: taskId },
      { $pull: { applicant: user } }
    );
  } else {
    await Task.findByIdAndUpdate(
      { _id: taskId },
      { $push: { applicant: user } }
    );
  }
};

const deleteTask = async (req) => {
  const taskId = req.params?.taskId;
  const task = await Task.findByIdAndDelete(taskId);
  return task;
};

module.exports = {
  getTask,
  getTaskByUser,
  createTask,
  updateTask,
  deleteTask,
  applyTask,
};

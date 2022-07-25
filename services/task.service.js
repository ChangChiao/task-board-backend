const { Task } = require("../models");
const getTask = async (userBody) => {
  const { order, city, keyword } = userBody;
  const task = await Task.find({city}, {$text:{$search: keyword}}).sort({pay: order === "desc" ? -1 : 1});
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

const deleteTask = async (userBody) => {
  const task = await Task.findByIdAndDelete(userBody._id);
  return task;
};

module.exports = {
  getTask,
  getTaskByUser,
  createTask,
  updateTask,
  deleteTask,
};

const { Task } = require("../models");
const getTask = async (userBody) => {
  const task = await Task.find();
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

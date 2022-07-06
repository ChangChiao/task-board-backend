const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { taskService } = require("../services");
const getTask = catchAsync(async (req, res) => {
  const taskList = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send({
    data: taskList,
    message: "已將啟用確認信件寄送至您的信箱，請先啟用再登入，謝謝。",
  });
});

const getTaskByUser = catchAsync(async (req, res) => {
  const taskList = await taskService.getTaskByUser(req.body);
  res.status(httpStatus.CREATED).send({
    data: taskList,
    message: "已將啟用確認信件寄送至您的信箱，請先啟用再登入，謝謝。",
  });
});

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send({
    data: task,
    message: "已將啟用確認信件寄送至您的信箱，請先啟用再登入，謝謝。",
  });
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.body);
  res.status(httpStatus.CREATED).send({
    data: task,
    message: "已將啟用確認信件寄送至您的信箱，請先啟用再登入，謝謝。",
  });
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.body);
  res.status(httpStatus.CREATED).send({
    message: "已將啟用確認信件寄送至您的信箱，請先啟用再登入，謝謝。",
  });
});

module.exports = {
  getTask,
  getTaskByUser,
  createTask,
  updateTask,
  deleteTask,
};

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { taskService } = require("../services");
const getTask = catchAsync(async (req, res) => {
  const taskList = await taskService.createTask(req.body);
  res.status(httpStatus.OK).send({
    data: taskList,
    message: "成功",
    status: "success"
  });
});

const getTaskByUser = catchAsync(async (req, res) => {
  const taskList = await taskService.getTaskByUser(req.body);
  res.status(httpStatus.OK).send({
    data: taskList,
    message: "成功",
    status: "success"
  });
});


const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send({
    data: task,
    message: "新增成功",
    status: "success"
  });
});


const applyTask = catchAsync(async (req, res) => {
  await taskService.applyTask(req.params?.taskId);
  res.status(httpStatus.OK).send({
    message: "申請成功",
    status: "success"
  });
});


const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.body);
  res.status(httpStatus.OK).send({
    data: task,
    message: "更新成功。",
    status: "success"
  });
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.body);
  res.status(httpStatus.OK).send({
    message: "刪除成功",
    status: "success"
  });
});

module.exports = {
  getTask,
  getTaskByUser,
  createTask,
  updateTask,
  deleteTask,
  applyTask,
};

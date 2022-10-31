const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { taskService } = require("../services");
const getTask = catchAsync(async (req, res) => {
  const taskList = await taskService.getTask(req);
  res.cookie("test", "1111", {
    httpOnly: false,
    path: "/",
    sameSite: "none",
    maxAge: 8640000,
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(httpStatus.OK).send({
    data: taskList,
    message: "成功",
    status: "success"
  });
});

const getUserTask = catchAsync(async (req, res) => {
  const taskList = await taskService.getUserTask(req);
  res.status(httpStatus.OK).send({
    data: taskList,
    message: "成功",
    status: "success"
  });
});


const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req);
  res.status(httpStatus.CREATED).send({
    data: task,
    message: "新增成功",
    status: "success"
  });
});


const applyTask = catchAsync(async (req, res) => {
  await taskService.applyTask(req);
  res.status(httpStatus.OK).send({
    message: "申請成功",
    status: "success"
  });
});

const cancelApplyTask = catchAsync(async (req, res) => {
  await taskService.cancelApplyTask(req);
  res.status(httpStatus.OK).send({
    message: "取消成功",
    status: "success"
  });
});

const pickStaff = catchAsync(async (req, res) => {
  await taskService.pickStaff(req);
  res.status(httpStatus.OK).send({
    message: "選擇成功",
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
  await taskService.deleteTask(req);
  res.status(httpStatus.OK).send({
    message: "刪除成功",
    status: "success"
  });
});

const getUserCreateTaskList = catchAsync((async (req, res) => {
  const data = await taskService.getUserCreateTaskList(req);
  res.status(httpStatus.OK).send({
    data,
    message: "成功",
    status: "success"
  });
}));

const getUserApplyTaskList = catchAsync((async (req, res) => {
  const data = await taskService.getUserApplyTaskList(req);
  res.status(httpStatus.OK).send({
    data,
    message: "成功",
    status: "success"
  });
}));

module.exports = {
  getTask,
  getUserTask,
  createTask,
  updateTask,
  deleteTask,
  applyTask,
  pickStaff,
  cancelApplyTask,
  getUserCreateTaskList,
  getUserApplyTaskList
};

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const chatService = require("../services/chat.service");
const config = require("../config/config");

const getRoomId = catchAsync(async (req, res) => {
  const data = await chatService.getCollect(req);
  res.status(httpStatus.OK).send({
    data,
    message: "成功",
    status: "success",
  });
});

const addCollect = catchAsync(async (req, res) => {
  const data = await chatService.addCollect(req);
  res.status(httpStatus.CREATED).send({
    data,
    message: "新增成功",
    status: "success",
  });
});

const removeCollect = catchAsync(async (req, res) => {
  const data = await collectService.removeCollect(req);
  res.status(httpStatus.CREATED).send({
    data,
    message: "移除成功",
    status: "success",
  });
});

module.exports = {
  getRoomId,
  addCollect,
  removeCollect,
};

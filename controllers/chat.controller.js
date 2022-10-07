const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const chatService = require("../services/chat.service");
const config = require("../config/config");

const getRoomId = catchAsync(async (req, res) => {
  const data = await chatService.getRoomId(req);
  res.status(httpStatus.CREATED).send({
    data,
    message: "成功",
    status: "success",
  });
});

const getChatRecord = catchAsync(async (req, res) => {
  const data = await chatService.getChatRecord(req);
  res.status(httpStatus.OK).send({
    data,
    message: "成功",
    status: "success",
  });
});


module.exports = {
  getRoomId,
  getChatRecord,
};

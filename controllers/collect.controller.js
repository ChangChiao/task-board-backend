const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const collectService = require("../services/collect.service");
const config = require("../config/config");

const getCollect = catchAsync(async (req, res) => {
  const data = await collectService.getCollect(req.body);
  res.status(httpStatus.CREATED).send({
    data,
    message: "成功",
    status: "success"
  });
});


const addCollect = catchAsync(async (req, res) => {
  const data = await collectService.addCollect(req.body);
  res.status(httpStatus.CREATED).send({
    data,
    message: "新增成功",
    status: "success"
  });
});


const removeCollect = catchAsync(async (req, res) => {
  const data = await collectService.removeCollect(req);
  res.status(httpStatus.CREATED).send({
    data,
    message: "移除成功",
    status: "success"
  });
});

module.exports = {
  getCollect,
  addCollect,
  removeCollect,
};

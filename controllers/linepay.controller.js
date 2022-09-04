const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const linePayService = require("../services/linepay.service");
const createOrder = catchAsync(async (req, res) => {
  const data = await linePayService.createOrder(req);
  res.status(httpStatus.CREATED).send({
    data,
    message: "訂單建立成功",
    status: "success"
  });
});


const checkOrder = catchAsync(async (req, res) => {
  const data = await linePayService.checkOrder(req);
  res.status(httpStatus.OK).send({
    data,
    message: "付款成功",
    status: "success"
  });
});

module.exports = {
  createOrder,
  checkOrder,
};

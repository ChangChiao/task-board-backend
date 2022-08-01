const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const orderService = require("../services/order.service");
const config = require("../config/config");
const createOrder = catchAsync(async (req, res) => {
  const data = await orderService.createOrder(req);
  res.status(httpStatus.CREATED).send({
    data,
    message: "訂單建立成功",
    status: "success"
  });
});


const notifyOrder = catchAsync(async (req, res) => {
  const data = await orderService.notifyOrder(req);
  res.status(httpStatus.OK).send({
    data,
    message: "付款成功",
    status: "success"
  });
});

module.exports = {
  createOrder,
  notifyOrder,
};

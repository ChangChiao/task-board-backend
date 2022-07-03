const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const orderService  = require("../services/order.service");
const config = require('../config/config');
const createOrder = catchAsync(async (req, res) => {
  console.log('8777');
  const order = await orderService.createOrder(req.body);
  res.status(httpStatus.CREATED).send({
    order,
    message: "訂單建立成功",
  });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req);
  res.status(httpStatus.CREATED).send({
    order,
    message: "訂單建立成功",
  });
});

module.exports = {
  createOrder,
  getOrder,
};

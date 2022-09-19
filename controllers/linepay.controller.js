const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const linePayService = require("../services/linepay.service");
const createOrder = catchAsync(async (req, res) => {
  // await linePayService.createOrder(req, res);
  const url = await linePayService.createOrder(req, res);
  res.status(httpStatus.OK).send({
    data: {
      url,
    },
    message: "建單成功",
    status: "success",
  });
});

const confirmOrder = catchAsync(async (req, res) => {
  const data = await linePayService.confirmOrder(req);
  res.status(httpStatus.OK).send({
    data,
    message: "付款成功",
    status: "success"
  });
});

module.exports = {
  createOrder,
  confirmOrder,
};

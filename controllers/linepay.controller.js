const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const linePayService = require("../services/linepay.service");
const config = require("../config/config");
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
  const result = await linePayService.confirmOrder(req, res);
  if (result?.returnCode === '0000') {
    res.redirect(`${config.frontEnd}/checkOrder?id=${result.info.orderId}`)
  } else {
    res.status(httpStatus.BAD_REQUEST).send({
      message: result,
    });
  }
  // res.status(httpStatus.OK).send({
  //   data,
  //   message: "付款成功",
  //   status: "success"
  // });
});

module.exports = {
  createOrder,
  confirmOrder,
};

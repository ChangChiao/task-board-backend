const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const linePayService = require("../services/linepay.service");
const createOrder = catchAsync(async (req, res) => {
  await linePayService.createOrder(req, res);
});


const confirmOrder = catchAsync(async (req, res) => {
 await linePayService.confirmOrder(req, res);
});

module.exports = {
  createOrder,
  confirmOrder,
};

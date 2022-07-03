const { Order } = require("../models");
const createOrder = async (userBody) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  userBody.MerchantOrderNo = timestamp;
  userBody.TimeStamp = timestamp;
  userBody.user = '62b7076950b6177e6b2af1f8';
  console.log("userBody", userBody.user);
  const order = await Order.create(userBody);
  return order;
};

const getOrder = async (req) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  const { TimeStamp, MerchantOrderNo, Amt, ItemDesc } = order;
  console.log("orderId", orderId);
  const param = `MerchantID=${config.newebpay.merchantID}&RespondType=JSON&TimeStamp=${TimeStamp}&Version=${config.newebpay.version}&MerchantOrderNo=${MerchantOrderNo}&Amt=${Amt}&ItemDesc=${ItemDesc}&Email=joe.chang1014%40gmail.com`;
  //TODO email要動態
};

module.exports = {
  createOrder,
  getOrder,
};

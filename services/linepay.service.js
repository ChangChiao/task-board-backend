const config = require("../config/config");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const Base64 = require("crypto-js/enc-base64");
const { Order } = require("../models");
const { default: axios } = require("axios");
const { log } = require("../config/logger");
const orders = {
  amount: 299,
  currency: "TWD",
  packages: [
    {
      id: "vip",
      amount: 299,
      products: [
        {
          name: "vip",
          quantity: 1,
          price: 299,
        },
      ],
    },
  ],
};

const createOrder = async (req, res) => {
  const orderObj = { ...orders, currency: "TWD" };
  const timeStamp = Date.now();
  orderObj.user = req.user._id;
  orderObj.TimeStamp = timeStamp;
  orderObj.orderId = timeStamp.toString();
  orderObj.MerchantOrderNo = timeStamp;
  await Order.create(orderObj);
  delete orderObj.user;
  delete orderObj.MerchantOrderNo;
  delete orderObj.TimeStamp;
  const reqBody = {
    ...orderObj,
    redirectUrls: {
      confirmUrl: config.callback + "/v1/linePay/confirm",
      cancelUrl: config.callback + "/v1/linePay/cancel",
    },
  };
  const uri = "/payments/request";
  const nonce = timeStamp;
  const queryString = `${config.linepay.secretKey}/${
    config.linepay.version
  }${uri}${JSON.stringify(reqBody)}${nonce}`;
  console.log("queryString", queryString);
  const signature = Base64.stringify(
    hmacSHA256(queryString, config.linepay.secretKey)
  );

  const url = `${config.linepay.url}/${config.linepay.version}${uri}`;
  console.log("url", url);
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": config.linepay.channelID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };
  console.log("reqBody", reqBody);
  const linePayRes = await axios.post(url, reqBody, { headers });
  console.log("linePayRes", linePayRes.data);
  if (linePayRes?.data?.returnCode === "0000") {
    return linePayRes?.data?.info?.paymentUrl.web
    // res.redirect(linePayRes?.data?.info?.paymentUrl.web);
  }
  return null
};

const confirmOrder = async (req) => {
  const taskId = req.params?.id;
  const user = req.user._id;
  const order = order;
  order.orderId = parseInt(Date.now() / 1000);
};

module.exports = {
  orders,
  createOrder,
  confirmOrder,
};

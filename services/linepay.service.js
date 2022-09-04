const config = require("../config/config");
const { HmacSHA256, Base64 } = require("crypto-js");
const { Order } = require("../models");
const { default: axios } = require("axios");
const orders = {
  1: {
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
  },
};

const createOrder = async (req, res) => {
  const orderObj = order;
  order.user = req.user._id
  orderObj.orderId = parseInt(Date.now() / 1000);
  const order = await Order.create(orderObj);
  const reqBody = {
    ...order,
    redirectUrls: {
      comfirmUrl: config.callback + "/linePay/confirm",
      cancelUrl: config.callback + "/linePay/cancel",
    },
  };
  const uri = "/payments/request";
  const nonce = parseInt(Date.now() / 1000);
  const queryString = `${config.linepay.secretKey}/${config.linepay.version}${uri}${JSON.stringify(
    reqBody
  )}${nonce}`;
  const signature = Base64.stringify(
    HmacSHA256(queryString, config.linepay.secretKey)
  );
  const url = `${config.linepay.url}/${config.linepay.version}${uri}`;
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": config.linepay.channelID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };
  const res = await axios.post(url, reqBody, { headers });
  if(res?.data?.returnCode === '0000') {
    res.redirect(res?.data?.info?.paymentUrl.web);
  }
};

const confirmOrder = async (req) => {
  const taskId = req.params?.id;
  const user = req.user._id;
  const order = order;
  order.orderId = parseInt(Date.now() / 1000);
};

module.exports = {
  orders,
  checkOrder,
  confirmOrder,
};

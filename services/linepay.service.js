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

const createSignature = (uri, linePayBody) => {
  const nonce = timeStamp;
  const encrypt  = `${config.linepay.secretKey}/${
    config.linepay.version
  }${uri}${JSON.stringify(linePayBody)}${nonce}`;
  const signature = Base64.stringify(
    hmacSHA256(encrypt , config.linepay.secretKey)
  );
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": config.linepay.channelID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };
  return headers;
}

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
  // const nonce = timeStamp;
  // const queryString = `${config.linepay.secretKey}/${
  //   config.linepay.version
  // }${uri}${JSON.stringify(reqBody)}${nonce}`;
  // console.log("queryString", queryString);
  // const signature = createSignature

  // const url = `${config.linepay.url}/${config.linepay.version}${uri}`;
  // console.log("url", url);
  // const headers = {
  //   "Content-Type": "application/json",
  //   "X-LINE-ChannelId": config.linepay.channelID,
  //   "X-LINE-Authorization-Nonce": nonce,
  //   "X-LINE-Authorization": signature,
  // };
  const headers = createSignature(uri, reqBody)
  console.log("reqBody", reqBody);
  const linePayRes = await axios.post(url, reqBody, { headers });
  console.log("linePayRes", linePayRes.data);
  if (linePayRes?.data?.returnCode === "0000") {
    res.redirect(linePayRes?.data?.info?.paymentUrl.web);
  }
};

const confirmOrder = async (req, res) => {
  const { transactionId, orderId } = req.query;
  const uri = `/payments/${transactionId}/confirm`;
  const order = await Order.findById(orderId);
  const linePayBody = {
    amount: order.amount,
    currency: 'TWD',
  }

  const headers = createSignature(uri, linePayBody);

  const url = `${config.linepay.url}/${config.linepay.version}${uri}`;
  const linePayRes = await axios.post(url, linePayBody, { headers });
  console.log(linePayRes);
  
  if (linePayRes?.data?.returnCode === '0000') {
    res.redirect(`/checkOrder?id=${orderId}`)
  } else {
    res.status(httpStatus.BAD_REQUEST).send({
      message: linePayRes,
    });
  }
};

module.exports = {
  orders,
  createOrder,
  confirmOrder,
};

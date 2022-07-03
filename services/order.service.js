const { Order } = require("../models");
const crypto = require("crypto");
const createOrder = async (userBody) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  userBody.MerchantOrderNo = timestamp;
  userBody.TimeStamp = timestamp;
  userBody.user = "62b7076950b6177e6b2af1f8";
  console.log("userBody", userBody.user);
  const order = await Order.create(userBody);
  return order;
};

const getOrder = async (req) => {
  const { orderId } = req.params;
  console.log('orderId', orderId);
  const order = await Order.findById(orderId);
  console.log('order', order);
  //   const param = genDataChain(order);
  const aesEncrypt = create_mpg_aes_encrypt(order);
  console.log('aesEncrypt', aesEncrypt);
  //TODO email要動態
};

module.exports = {
  createOrder,
  getOrder,
};
const genDataChain = ({ TimeStamp, MerchantOrderNo, Amt, ItemDesc }) => {
  return `MerchantID=${
    config.newebpay.merchantID
  }&RespondType=JSON&TimeStamp=${TimeStamp}&Version=${
    config.newebpay.version
  }&MerchantOrderNo=${MerchantOrderNo}&Amt=${Amt}&ItemDesc=${encodeURIComponent(
    ItemDesc
  )}&Email=${encodeURIComponent("joe.chang1014%40gmail.com")}`;
};

const create_mpg_aes_encrypt = (TradeInfo) => {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
};

const create_mpg_sha_encrypt = (TradeInfo) => {
  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`;

  return sha.update(plainText).digest("hex").toUpperCase();
};

// 交易完成後回傳資料使用的反向解密
function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
  decrypt.setAutoPadding(false);
  let text = decrypt.update(TradeInfo, "hex", "utf8");
  let plainText = text + decrypt.final("utf8");
  let result = plainText.replace(/[\x00-\x20]+/g, "");
  return result;
}

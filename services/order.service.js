const { Order } = require("../models");
const crypto = require("crypto");
const config = require("../config/config")

const encryptOrder = async (orderObj) => {
  const order = JSON.parse(JSON.stringify(orderObj));
  order.MerchantID = config.newebpay.merchantID;
  order.Version = config.newebpay.version;
  const param = genDataChain(order);
  const aesEncrypt = create_mpg_aes_encrypt(param);
  console.log('aesEncrypt', aesEncrypt); //交易用
  const shaEncrypt =create_mpg_sha_encrypt(aesEncrypt);
  console.log('shaEncrypt', shaEncrypt); //驗證用
  order.TradeInfo = aesEncrypt
  order.TradeSha = shaEncrypt
  console.log('%===%%', order);
  return order
  //TODO email要動態
};

const createOrder = async (userBody) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    userBody.MerchantOrderNo = timestamp;
    userBody.TimeStamp = timestamp;
    userBody.user = "62b7076950b6177e6b2af1f8";
    console.log("userBody", userBody.user);
    const order = await Order.create(userBody);
    const encrypt = await encryptOrder(order);
    return encrypt;
  };


const notifyOrder = async(req) => {
    console.log('req.body notify data', req.body);
    const response = req.body;
  
    const thisShaEncrypt = create_mpg_sha_encrypt(response.TradeInfo);
    // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
    if (!thisShaEncrypt === response.TradeSha) {
        throw new Error('付款失敗：TradeSha 不一致');
    }
  
    // 解密交易內容
    const data = create_mpg_aes_decrypt(response.TradeInfo);
    console.log('data:', data);
    const MerchantOrderNo = data?.Result?.MerchantOrderNo
  
    // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
    const order = await Order.findById(MerchantOrderNo)
    if(!order) throw new Error('無此訂單');

    // 交易完成，更新訂單狀態
    await Order.findByIdAndUpdate(MerchantOrderNo, {orderStatus: 0})
}


//組交易資訊
const genDataChain = ({ TimeStamp, _id, Amt, ItemDesc }) => {
    return `MerchantID=${
      config.newebpay.merchantID
    }&RespondType=JSON&TimeStamp=${TimeStamp}&Version=${
      config.newebpay.version
    }&MerchantOrderNo=${_id}&Amt=${Amt}&ItemDesc=${encodeURIComponent(
      ItemDesc
    )}&Email=${encodeURIComponent("joe.chang1014%40gmail.com")}`;
  };

//使用 aes 加密
const create_mpg_aes_encrypt = (TradeInfo) => {
  let encrypt = crypto.createCipheriv("aes256", config.newebpay.hashkey, config.newebpay.hashiv);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
};

//使用 sha256 加密
const create_mpg_sha_encrypt = (TradeInfo) => {
  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${config.newebpay.hashkey}&${TradeInfo}&HashIV=${config.newebpay.hashiv}`;

  return sha.update(plainText).digest("hex").toUpperCase();
};

// 交易完成後回傳資料使用的反向解密
function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", config.newebpay.hashkey, config.newebpay.hashiv);
  decrypt.setAutoPadding(false);
  let text = decrypt.update(TradeInfo, "hex", "utf8");
  let plainText = text + decrypt.final("utf8");
  let result = plainText.replace(/[\x00-\x20]+/g, "");
  return result;
}

module.exports = {
    createOrder,
    notifyOrder
  };
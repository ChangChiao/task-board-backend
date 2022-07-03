const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "訂單一定要有user"],
  },
  payment: {
    type: String,
    default: "transfer",
    enum: ["credit", "linePay", "transfer"],
  },
  ItemDesc: {
    type: String,
    default: "VIP",
  },
  Amt: {
    type: Number,
    required: [true, "交易金額未填寫"],
    default: 199,
  },
  orderStatus: {
    type: Number,
    enum: [0, 1, 2],
    // 0=success, 1=fail, 2=處理中
    default: 2,
  },
  MerchantOrderNo: {
    type: Number,
    required: [true, "訂單Id為必填"],
  },
  TimeStamp:{
    type: Number,
    required: [true, " 時間戳為必填"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email",
  });

  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

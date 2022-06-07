const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "訂單一定要有user"],
  },
  payment: {
    type: String,
    default: "credit",
    enum: ["credit", "linePay", "transfer"],
  },
  product: {
    type: Number,
    default: 7,
    enum: [7, 30],
  },
  totalAmount: {
    type: Number,
    required: [true, "交易金額未填寫"],
    default: 100,
  },
  summary: {
    type: String,
    required: [true, "請輸入摘要"],
  },
  orderStatus: {
    type: Number,
    enum: [0, 1, 2],
    // 0=success, 1=fail, 2=處理中
    default: 2,
  },
  orderId: {
    type: String,
    required: [true, "訂單Id為必填"],
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
    select: "name _id",
  });

  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

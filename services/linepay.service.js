const config = require("../config/config");
const { Order } = require("../models");
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
            name: "",
            quantity: 1,
            price: 299,
          },
        ],
      },
    ],
  },
};

const createOrder = async (req) => {
    const orderObj = order;
    orderObj.orderId = parseInt(Date.now() / 1000);
    await Order.create(orderObj);
}

const checkOrder = async (req) => {
  const taskId = req.params?.id;
  const user = req.user._id;
  const order = order;
  order.orderId = parseInt(Date.now() / 1000);
};

module.exports = {
  orders,
  checkOrder,
  createOrder,
};

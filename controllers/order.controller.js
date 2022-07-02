const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const createOrder = catchAsync(async (req, res) => {
    // req.body
    const Timestamp = Math.round(new Date().getTime() / 1000);
});

module.exports = {
    createOrder
}
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({
    data: user,
    status: "success",
    message: "新增成功",
  });
});

const getUser = catchAsync(async (req, res) => {
  console.log('user', req.user)
  const userId = req.user?._id;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({
    data: user,
    message: "成功",
    status: "success",
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({
    data: user,
    message: "成功",
    status: "success",
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send({
    data: user,
    message: "修改成功",
    status: "success",
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send({
    message: "刪除成功",
    status: "success",
  });
});

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
};

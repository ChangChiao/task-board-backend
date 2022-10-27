const { Task, User } = require("../models");
const mongoose = require("mongoose");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const { ImgurClient } = require("imgur");
const httpStatus = require("http-status");

const setOrder = (self, target, order) => {
  console.log("self, target, order", self, target, order);
  if (self === target) return order === "desc" ? -1 : 1;
  return -1;
};

const getTask = async (req) => {
  const { sortOrder, sortBy, city, keyword } = req.query;
  console.log("keyword", city, keyword);
  // const task = Task.find()
  const pipeline = [
    {
      $sort: {
        status: 1,
        isVip: -1,
        expire: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
      },
    },
    {
      $project: {
        "author.contact": 0,
        "author.email": 0,
        "author.password": 0,
        "author.activeStatus": 0,
        "author.googleId": 0,
        "author.createTaskList": 0,
      },
    },
  ];
  if (city !== undefined) {
    pipeline.unshift({
      $match: {
        city: { $eq: city },
      },
    });
  }
  if (keyword !== undefined) {
    pipeline.unshift({
      $match: {
        title: new RegExp(keyword, "i"),
      },
    });
  }
  if (sortBy === "expire") {
    pipeline.push({
      $sort: {
        expire: sortOrder === "desc" ? -1 : 1,
        reward: -1,
      },
    });
  }

  if (sortBy === "reward") {
    pipeline.push({
      $sort: {
        reward: sortOrder === "desc" ? -1 : 1,
      },
    });
  }
  const task = await Task.aggregate(pipeline);
  console.log("task===", task);
  return task;
};

const getUserTask = async (req) => {
  const userId = req.params?.userId;
  const status = req.body.status;
  const task = await User.find({ author: userId, status }).populate({
    path: "applicant",
    populate: { path: "applicant", select: "name avatar" },
  });

  return task;
};

const createTask = async (req) => {
  const userBody = req.body;
  userBody.cover = req.file;
  console.log("userBody===", userBody);
  const client = new ImgurClient({
    clientId: config.imgur.client_id,
    clientSecret: config.imgur.client_secret,
    refreshToken: config.imgur.refresh_token,
  });
  const response = await client.upload({
    image: userBody.cover.buffer.toString("base64"),
    type: "base64",
    album: config.imgur.album_id,
  });
  if (response.status === 200) {
    userBody.cover = response.data.link;
  } else {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "服務異常，請再試一次");
  }

  const user = req.user._id;
  userBody.author = user;
  const task = await Task.create(userBody);
  await User.findByIdAndUpdate(
    { _id: user },
    { $push: { createTaskList: task._id } }
  );
  return task;
};

const updateTask = async (userBody) => {
  const taskId = req.params?.taskId;
  const task = await Task.findByIdAndUpdate({ _id: taskId }, { userBody });
  return task;
};

const applyTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  const taskAuthor = await Task.findById(taskId).select("author");
  if (taskAuthor.author.toString() === user.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "不能申請自己的任務");
  }
  const target = await User.findOne({
    $and: [{ _id: user }, { applyTaskList: { $in: [taskId] } }],
  });
  if (target) {
    throw new ApiError(httpStatus.BAD_REQUEST, "不能重複申請任務");
  }
  await User.findByIdAndUpdate(
    { _id: user },
    { $push: { applyTaskList: taskId } }
  );
  await Task.findByIdAndUpdate({ _id: taskId }, { $push: { applicant: user } });
};

const cancelApplyTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  await User.findByIdAndUpdate(
    { _id: user },
    { $pull: { applyTaskList: taskId } }
  );
  await Task.findByIdAndUpdate({ _id: taskId }, { $pull: { applicant: user } });
};

const pickStaff = async (req) => {
  const taskId = req.params?.taskId;
  const staff = req.body.staff;
  const task = await Task.findById(taskId);
  if (task.status !== 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "該任務已結束");
  }
  await Task.findByIdAndUpdate({ _id: taskId }, { staff, status: 1 });
};

const deleteTask = async (req) => {
  const taskId = req.params?.taskId;
  const user = req.user._id;
  const task = await Task.findByIdAndDelete(taskId);
  await User.findByIdAndUpdate(
    { _id: user },
    { $pull: { createTaskList: taskId } }
  );
  return task;
};

const getUserCreateTaskList = async (req) => {
  const userId = req.user._id;
  console.log("userId", userId)
  const task = await User.aggregate([
    {
      $match: {
        _id: { $eq: userId },
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "createTaskList",
        foreignField: "_id",
        as: "taskList",
      },
    },
    {
      $unwind: "$taskList",
    },
    {
      $lookup: {
        from: "users",
        localField: "taskList.applicant",
        foreignField: "_id",
        as: "taskList.applicant",
      },
    },
    {
      $project: {
        "taskList.applicant.contact": 0,
        "taskList.applicant.email": 0,
        "taskList.applicant.password": 0,
        "taskList.applicant.activeStatus": 0,
        "taskList.applicant.googleId": 0,
        "taskList.applicant.createTaskList": 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "taskList.staff",
        foreignField: "_id",
        as: "taskList.staff",
      },
    },
    {
      $unwind:{
        "path": "$taskList.staff",
        "preserveNullAndEmptyArrays": true
      }
    },
    {
      $project: {
        "taskList.staff.contact": 0,
        "taskList.staff.email": 0,
        "taskList.staff.password": 0,
        "taskList.staff.activeStatus": 0,
        "taskList.staff.googleId": 0,
        "taskList.staff.createTaskList": 0,
      },
    },
    // {
    //   $group: {
    //     _id: "$_id",
    //     taskList: { $push: "$taskList" },
    //   },
    // },
    {
      $replaceRoot: { newRoot: { $mergeObjects: ["$taskList"] } },
    },
  ]);
  return task ?? [];
};

const getUserApplyTaskList = async (req) => {
  const userId = req.user._id;
  const task = await User.aggregate([
    {
      $match: {
        _id: { $eq: userId },
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "applyTaskList",
        foreignField: "_id",
        as: "taskList",
      },
    },
    {
      $unwind: "$taskList",
    },
    {
      $lookup: {
        from: "users",
        localField: "taskList.staff",
        foreignField: "_id",
        as: "taskList.staff",
      },
    },
    {
      $project: {
        "taskList.staff.contact": 0,
        "taskList.staff.email": 0,
        "taskList.staff.password": 0,
        "taskList.staff.activeStatus": 0,
        "taskList.staff.googleId": 0,
        "taskList.staff.createTaskList": 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "taskList.author",
        foreignField: "_id",
        as: "taskList.author",
      },
    },
    {
      $unwind: "$taskList.author",
    },
    {
      $project: {
        "taskList.author.email": 0,
        "taskList.author.password": 0,
        "taskList.author.activeStatus": 0,
        "taskList.author.googleId": 0,
        "taskList.author.createTaskList": 0,
      },
    },
    // {
    //   $group: {
    //     _id: "$_id",
    //     taskList: { $push: "$taskList" },
    //   },
    // },
    {
      $replaceRoot: { newRoot: { $mergeObjects: ["$taskList"] } },
    },
  ]);

  return task ?? [];
};

module.exports = {
  getTask,
  getUserTask,
  createTask,
  updateTask,
  deleteTask,
  applyTask,
  cancelApplyTask,
  pickStaff,
  getUserCreateTaskList,
  getUserApplyTaskList,
};

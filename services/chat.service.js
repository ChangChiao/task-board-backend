const User = require("../models/user.model");
const ChatRoom = require("../models/chatRoom.model")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getRoomId = async (req) => {
  const receiver = req.body?.receiver;
  const sender = req.user._id;
  if (!receiver) {
    throw new ApiError(httpStatus.BAD_REQUEST, "未填寫聊天對象使用者id");
  }
  if (sender === receiver) {
    throw new ApiError(httpStatus.BAD_REQUEST, "自己不能跟自己聊天！");
  }
  const receiverUser = await User.findById(receiver);
  if (!receiverUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "沒有這個人喔");
  }
  const queryResult = await User.findById(sender).select("chatRecord");
  const { receiver: receiverRecord, roomId } =
    queryResult?.chatRecord.find(
      (item) => item.receiver.toString() === receiver
    ) || {};
  const { name, avatar, _id } = receiverUser;

  //已經有聊天記錄就直接回傳id
  if (receiverRecord) {
    return {
      roomId,
      name,
      avatar,
      _id,
    };
  } else {
    //沒有聊天記錄就新建房間
    const newRoom = await ChatRoom.create({
      members: [ObjectId(sender), ObjectId(receiver)],
    });
    console.log("newRoom", newRoom);
    await User.findByIdAndUpdate(sender, {
      $push: { chatRecord: { roomId: newRoom._id, receiver: receiver } },
    });
    await User.findByIdAndUpdate(receiver, {
      $push: { chatRecord: { roomId: newRoom._id, receiver: sender } },
    });
    return {
      roomId: newRoom._id,
      name,
      avatar,
      _id,
    };
  }
};

const getChatRecord = async (req) => {
    const user = req.user._id;
    const queryResult = await User.aggregate([
        { $match: { _id: user } },
        {
          $project: { chatRecord: 1 },
        },
        {
          $unwind: "$chatRecord",
        },
        {
          $lookup: {
            from: "chatrooms",
            let: {
              roomId: "$chatRecord.roomId",
              chatRecord: "$chatRecord",
            },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$roomId"] } } },
              {
                $project: { messages: 1, _id: 0 },
              },
              // { $replaceRoot: { newRoot: { $mergeObjects: [ $message , $$ROOT] } } }
              {
                $replaceRoot: {
                  newRoot: { message: { $slice: ["$messages", -1] } },
                },
              },
            ],
            as: "message",
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              receiverId: "$chatRecord.receiver",
              chatRecord: "$chatRecord",
            },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$receiverId"] } } },
              {
                $project: { avatar: 1, name: 1, _id: 0 },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: "$message",
        },
        {
          $unwind: "$user",
        },
        {
          $replaceRoot: {
            newRoot: {
              message: "$message.message",
              avatar: "$user.avatar",
              name: "$user.name",
              roomId: "$chatRecord.roomId",
            },
          },
        },
      ]);

      return queryResult;
  };

module.exports = {
  getRoomId,
  getChatRecord,
};

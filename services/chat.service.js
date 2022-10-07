const { User } = require("../models");
const getCollect = async (req) => {
  const user = userBody._id;
  const collect = await User.findById(user).select("collect");
  return collect;
};

const getRoomId = async (req) => {
  const receiver = req.params?.receiverId;
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

const removeCollect = async (req) => {
  const taskId = req.params?.taskId;
  const userId = req.user._id;
  const collect = await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { collect: taskId } }
  );
  return collect;
};

module.exports = {
  getRoomId,
  addCollect,
  removeCollect,
};

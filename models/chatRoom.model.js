const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ChatRoomSchema = new mongoose.Schema(
  {
    roomType: {
      type: Number,
      default: 0,
      enum: [0, 1], // 0=私人 //1=公開
    },
    members: {
      type: [mongoose.Types.ObjectId],
      required: true,
      default: [],
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;

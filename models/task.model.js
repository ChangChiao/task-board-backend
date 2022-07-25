const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  pay: {
    type: Number,
    default: 168,
  },
  status:{
    type: Number,
    enum: [0, 1, 2]
  },
  cover:{
    type: String,
    default: 'https://i.imgur.com/gA5JWK5.png',
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
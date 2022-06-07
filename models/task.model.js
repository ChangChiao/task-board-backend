const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
  reward: {
    type: Number,
    default: 168,
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
module.exports = User;
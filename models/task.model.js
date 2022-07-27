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
    enum: [0, 1, 2] //0 進行中 1已結束 2已過期
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
  applicant:{
    type: [{
      type:mongoose.Schema.ObjectId,
      ref:'User'
    }],
    default: [],
    validate: {
      validator: function(){
        return !(this.applicant.length >= 3)
      },
      message: `已經超過三個人申請`
    },
  },
  staff:{
    type: mongoose.Schema.ObjectId,
    default: null
  }
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: '_id name avatar',
  })
  next()
})


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
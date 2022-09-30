const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  status:{
    type: Number,
    default: 0,
    enum: [0, 1, 2] //0 進行中 1已結束 2已過期
  },
  city:{
    type: String,
    default: 'Taipei',
  },
  cover:{
    type: String,
    default: 'https://i.imgur.com/gA5JWK5.png',
  },
  expire: {
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
    ref:'User',
    default: null
  }
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'applicant staff',
    select: '_id name avatar isVip',
  })
  next()
})


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
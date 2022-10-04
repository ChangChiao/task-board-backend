const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { toJSON, paginate } = require("./plugins");
const { string } = require("joi");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    activeStatus: {
      type: String,
      enum: ["none", "normal", "third", "both"],
      default: "none",
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "https://i.imgur.com/gA5JWK5.png",
    },
    collect: {
      type: [mongoose.Schema.ObjectId],
      default: [],
    },
    isVip: {
      type: Boolean,
      default: false,
    },
    chatRecord: {
      type: [
        {
          roomId: {
            type: mongoose.Schema.ObjectId,
            ref: "ChatRoom",
          },
          receiver: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
          },
        },
      ],
      default: [],
    },
    googleId: {
      type: String,
      select: false,
    },
    facebookId: {
      type: String,
      select: false,
    },
    contact: {
      type: String,
      default: "",
    },
    createTaskList: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Task",
        },
      ],
      default: [],
      validate: {
        validator: function () {
          return !(this.createTaskList.length >= 10);
        },
        message: `最多只能新增十則任務`,
      },
    },
    applyTaskList: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Task",
        },
      ],
      default: [],
      validate: {
        validator: function () {
          return !(this.applyTaskList.length >= 10);
        },
        message: `最多只能申請十則任務`,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

//TODO schema檢查
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createTaskList",
  });
  this.populate({
    path: "applyTaskList",
  });
  next();
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  if (!user.contact) {
    user.contact = user.email;
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

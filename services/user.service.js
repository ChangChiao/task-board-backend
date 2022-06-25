const httpStatus = require("http-status");
const uuid = require("uuid");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const emailService = require("./email.service");
const config = require("../config/config");
const tokenService = require("./token.service")
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const userData = await User.findOne({ email }).select('+activeStatus');
  if (userData.activeStatus === 'meta' || userData.activeStatus === 'both') {
    throw new ApiError(httpStatus.BAD_REQUEST, "信箱已經註冊");
  }
  console.log('emailService', emailService);
  console.log('tokenService--', tokenService);
  const activeCode = tokenService.generateVerifyCode(userBody.email);
  const mailObj = {
    subject: "[TaskBoard]帳號啟用確認信",
    to: userBody.email,
    text: `親愛用戶您好！點選連結即可啟用您的 TaskBoard 帳號，[${config.callback}/users/checkCode?code=${activeCode}] 為保障您的帳號安全，請在24小時內點選該連結`,
  };

  const password = await bcrypt.hash(req.body.password, 12);
  let user = {}
  if (!userData) {
    userBody.name = `使用者${uuid.v1()}`
    userBody.password = password
    user = await User.create(userBody);
  } else {
    user = await User.findByIdAndUpdate(userData._id, { password });
  }

  await emailService.sendEmail(mailObj);
  
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * check user emailVerified
 * @param {string} email 
 * @returns {Boolean}
 */
const checkUserStatus = async (email) => {
    const result = await User.findOne({ email }).select("isEmailVerified");
    if(!result){
        throw new Error(`您尚未驗證信箱`);
    }
    return result
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  checkUserStatus,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

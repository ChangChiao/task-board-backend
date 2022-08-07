const Joi = require("joi");

const addTask = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    reward: Joi.string().required(),
    expire: Joi.string().required(),
    cover: Joi.any().required()
  }),
};

const pickStaff = {
  body: Joi.object().keys({
    staff: Joi.string().required(),
  }),
}

const getUserTask = {
  body: Joi.object().keys({
    status: Joi.number(),
  }),
}
module.exports = {
    addTask,
    pickStaff,
    getUserTask
};

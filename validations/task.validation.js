const Joi = require("joi");

const addTask = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    pay: Joi.number().required(),
    startTime: Joi.number().required(),
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

const Joi = require("joi");

const getRoomInfo = {
  body: Joi.object().keys({
    receiver: Joi.string().required(),
  }),
};

module.exports = {
  getRoomInfo,
};

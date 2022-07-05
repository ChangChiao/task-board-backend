const Joi = require("joi");

const createOrder = {
  body: Joi.object().keys({
    Email: Joi.string().required().email(),
    Amt: Joi.number().required(),
    ItemDesc: Joi.string().required(),
  }),
};


module.exports = {
  createOrder,
};

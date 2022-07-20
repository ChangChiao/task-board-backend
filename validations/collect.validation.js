const Joi = require("joi");

const addCollect = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const removeCollect = {
  query: Joi.object().keys({
    id: Joi.string().required(),
  }),
};


module.exports = {
  addCollect,
  removeCollect,
};

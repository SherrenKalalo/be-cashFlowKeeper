const Joi = require("joi");

const registrationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registrationSchema,
};

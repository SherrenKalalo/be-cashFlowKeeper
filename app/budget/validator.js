const Joi = require("joi");

const budgetSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().integer().strict().required(),
});

module.exports = {
  budgetSchema,
};

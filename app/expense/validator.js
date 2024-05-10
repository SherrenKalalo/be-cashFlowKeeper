const Joi = require("joi");

const expenseSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().integer().strict().required(),
});

module.exports = {
  expenseSchema,
};

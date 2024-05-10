const express = require("express");
const router = express.Router();
const expenseController = require("./controller");
const { decodeToken } = require("../../middleware/decodeToken");

router.post("/:id_budget", decodeToken, expenseController.createExpense);
router.delete("/:id_expense", decodeToken, expenseController.deleteExpenseById);
router.get("/:id_user", decodeToken, expenseController.getExpense);

module.exports = router;

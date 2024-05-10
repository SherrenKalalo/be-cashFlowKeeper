const express = require("express");
const router = express.Router();
const budgetController = require("./controller");
const { decodeToken } = require("../../middleware/decodeToken");

router.post("/", decodeToken, budgetController.createBudget);
router.get("/list/me", decodeToken, budgetController.getMyBudgetList);
router.delete("/:id_budget", decodeToken, budgetController.deleteBudgetById);

module.exports = router;

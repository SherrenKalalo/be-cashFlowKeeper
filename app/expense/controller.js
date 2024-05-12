const { expenseSchema } = require("./validator");
const prisma = require("../../database");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

const createExpense = async (req, res) => {
  try {
    // validasi req.body
    const validationResult = expenseSchema.validate(req.body);
    if (validationResult.error) {
      // lempar error invariantError
      throw new InvariantError(validationResult.error.message);
    }

    // ambil id_budget dari req.params
    const { id_budget } = req.params;

    // make sure id_budget ada
    const isBudget = await prisma.budget.findFirst({
      where: {
        id: id_budget,
      },
    });
    if (!isBudget) {
      throw new NotFoundError("Budget tidak ditemukan");
    }

    // insert expense ke database
    const expense = await prisma.expense.create({
      data: {
        id_budget,
        name: req.body.name,
        amount: req.body.amount,
      },
    });

    // update spent dan remaining di budget
    const newSpent = isBudget.spent + req.body.amount;
    const newRemaining = isBudget.remaining - req.body.amount;

    await prisma.budget.update({
      where: {
        id: id_budget,
      },
      data: {
        spent: newSpent,
        remaining: newRemaining,
      },
    });

    // kembalikan respon kepada user
    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data expense",
      data: {
        expense,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

const deleteExpenseById = async (req, res) => {
  try {
    // ambil id_expense dari req.params
    const { id_expense } = req.params;

    // make sure id_expense ada
    const isExpense = await prisma.expense.findFirst({
      where: {
        id: id_expense,
      },
    });
    if (!isExpense) {
      throw new NotFoundError("Expense tidak ditemukan");
    }

    // delete expense di database
    const expense = await prisma.expense.delete({
      where: {
        id: id_expense,
      },
    });

    // ambil data di budget
    const budget = await prisma.budget.findFirst({
      where: {
        id: isExpense.id_budget,
      },
    });

    // update spent dan remaining di budget
    const newSpent = budget.spent - isExpense.amount;
    const newRemaining = budget.remaining + isExpense.amount;

    await prisma.budget.update({
      where: {
        id: isExpense.id_budget,
      },
      data: {
        spent: newSpent,
        remaining: newRemaining,
      },
    });

    // kembalikan respon kepada user
    return res.status(200).json({
      status: "success",
      message: `Berhasil hapus data expense ${isExpense.name}`,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

const getExpense = async (req, res) => {
  console.log("masuk");
  try {
    // ambil id user dari req.params;
    const { id_user } = req.params;

    // validasi user ada atau tidak
    const isUser = await prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });
    if (!isUser) {
      throw new NotFoundError("User tidak ditemukan");
    }

    // ambil dulu semua id budget dari user tersebut
    const idBudgets = await prisma.budget.findMany({
      where: {
        id_user,
      },
      select: {
        id: true,
      },
    });

    console.log("ini dpe isi: ", idBudgets);

    const expenseLists = await prisma.expense.findMany({
      where: {
        id_budget: {
          in: idBudgets.map((item) => item.id),
        },
      },
    });

    return res.json({
      status: "success",
      message: `Berhasil dapat semua data list expense dari user ${isUser.username}`,
      data: {
        expenseLists,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

const updateExpense = async (req, res) => {
  try {
    // ambil id_expense dari req.params
    const { id_expense } = req.params;

    // make sure id_expense ada
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: id_expense,
      },
    });
    if (!existingExpense) {
      throw new NotFoundError("Expense tidak ditemukan");
    }

    // validasi req.body
    const validationResult = expenseSchema.validate(req.body);
    if (validationResult.error) {
      // lempar error InvariantError
      throw new InvariantError(validationResult.error.message);
    }

    // update expense di database
    const updatedExpense = await prisma.expense.update({
      where: {
        id: id_expense,
      },
      data: {
        name: req.body.name,
        amount: req.body.amount,
      },
    });

    // kembalikan respon kepada user
    return res.status(200).json({
      status: "success",
      message: `Berhasil update data expense ${existingExpense.name}`,
      data: {
        expense: updatedExpense,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

module.exports = {
  createExpense,
  deleteExpenseById,
  getExpense,
  updateExpense,
};

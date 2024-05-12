const InvariantError = require("../../exceptions/InvariantError");
const { budgetSchema } = require("./validator");
const prisma = require("../../database");
const NotFoundError = require("../../exceptions/NotFoundError");

const createBudget = async (req, res) => {
  try {
    // validasi req.body
    const validationResult = budgetSchema.validate(req.body);
    if (validationResult.error) {
      // lempar error invariantError
      throw new InvariantError(validationResult.error.message);
    }

    // id_user nanti ambe dari req.user dari token

    // insert budget ke database
    const budget = await prisma.budget.create({
      data: {
        id_user: req.user.id,
        name: req.body.name,
        spent: 0,
        remaining: req.body.amount,
        amount: req.body.amount,
        color: req.body.color,
      },
    });

    // kembalikan respon kepada user
    return res.status(201).json({
      status: "success",
      message: "Berhasil menambahkan data budget",
      data: {
        budget,
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

const getMyBudgetList = async (req, res) => {
  try {
    const budgetLists = await prisma.budget.findMany({
      where: {
        id_user: req.user.id,
      },
      include: {
        Expenses: true,
      },
    });

    return res.json({
      status: "success",
      message: "Berhasil dapat semua data list budget",
      data: {
        budgetLists,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error pada server",
    });
  }
};

const deleteBudgetById = async (req, res) => {
  try {
    // ambil id budget dari req.params
    const { id_budget } = req.params;

    // make sure id_budget ada
    const isBudget = await prisma.budget.findFirst({
      where: {
        AND: [
          {
            id: id_budget,
          },
          {
            // ambil id user dari token
            id_user: req.user.id,
          },
        ],
      },
    });

    if (!isBudget) {
      throw new NotFoundError("budget tidak ditemukan");
    }

    // delte row di database
    await prisma.budget.delete({
      where: {
        id: id_budget,
      },
    });

    return res.json({
      status: "success",
      message: `Berhasil delete budget dengan nama ${isBudget.name}`,
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
  createBudget,
  getMyBudgetList,
  deleteBudgetById,
};

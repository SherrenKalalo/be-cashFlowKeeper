const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const prisma = require("../../database");
const { registrationSchema } = require("./validator");
const InvariantError = require("../../exceptions/InvariantError");

const register = async (req, res) => {
  try {
    // validasi req.body
    const validationResult = registrationSchema.validate(req.body);
    if (validationResult.error) {
      // lempar error invariantError
      throw new InvariantError(validationResult.error.message);
    }

    // cek apakah username sudah ada di database atau belum
    const isThereUsername = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });
    if (isThereUsername) {
      throw new InvariantError("username already exist");
    }

    // enkripsi password user dengan menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // masukkan req body ke database
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });

    // kembalikan respon ke user
    return res.status(201).json({
      status: "success",
      message: "Berhasil Registrasi Akun",
      data: {
        id: user.id,
        username: user.username,
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

const login = async (req, res) => {
  try {
    // validasi req.body
    const validationResult = registrationSchema.validate(req.body);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    // validasi apakah ada user
    const isThereUser = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });

    if (!isThereUser) {
      throw new InvariantError("Username or Passowrd Incorrect");
    }

    // validasi password
    const matchPassword = await bcrypt.compare(
      req.body.password,
      isThereUser.password
    );

    if (!matchPassword) {
      throw new InvariantError("Username or Password Incorrect");
    }

    // generate token
    const accessToken = jwt.sign(
      { id: isThereUser.id, username: isThereUser.username },
      config.accessTokenKey,
      { expiresIn: "1d" }
    );

    return res.json({
      status: "success",
      message: "Berhasil login user",
      data: {
        id: isThereUser.id,
        username: isThereUser.username,
        accessToken,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        status: "fail",
        message: "Error pada server",
      });
    }
  }
};

module.exports = {
  register,
  login,
};

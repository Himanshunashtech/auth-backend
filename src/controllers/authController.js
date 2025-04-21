const UserModel = require("../models/usermodel");
const AppError = require("../utils/apierror");

const { registerUserSchema, loginUserSchema } = require("../utils/validation");

const cookieOptions = {
  httpOnly: true,
  secure: "production",
  sameSite: "Strict",
  maxAge: 24 * 60 * 60 * 1000,
};

const userRegisteration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      throw AppError.badRequest(error.details[0].message);
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw AppError.conflict("User already exists with this email");
    }

    const user = await UserModel.create({ name, email, password });

    const token = user.generateToken();

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({
        message: "User registered successfully",
        success: true,
        data: user,
      });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      throw AppError.badRequest(error.details[0].message);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw AppError.notFound("User not found, please register");
    }

    const isPasswordValid = user.comparePassword(password);
    if (!isPasswordValid) {
      throw AppError.unauthorized("Incorrect password");
    }

    const token = user.generateToken();

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        message: "User logged in successfully",
        success: true,
        data: user,
      });
  } catch (error) {
    next(error);
  }
};



const userLogout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({ message: "User logged out successfully", success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegisteration,
  userLogin,
 
  userLogout,
};

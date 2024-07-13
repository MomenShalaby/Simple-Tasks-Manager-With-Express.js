const crypto = require("crypto");

const secretKey = process.env.JWT_SECRET_KEY;
const jwtExpire = process.env.JWT_EXPIRE_TIME;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const createToken = require("../utils/createToken");

exports.signUp = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const userEmail = await UserModel.findOne({ email });
  if (userEmail) {
    return next(new ApiError(`email already exist.`, 404));
  }
  const user = await UserModel.create({ email, password, name });

  const token = createToken(user._id);
  res.status(200).json({
    status: true,
    data: user,
    token: token,
  });
});

exports.logIn = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError(`Invalid email or password`, 404));
  }
  const token = createToken(user._id);

  res.status(200).json({ status: true, data: user, token: token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    token = authorizationHeader.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        `You are not logged in, Please login to access this route`,
        401
      )
    );
  }
  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return next(
      new ApiError(
        `The user that belongs to this token does not exist anymore`,
        401
      )
    );
  }

  if (user.passwordChanged) {
    const passwordChangedTime = parseInt(
      user.passwordChanged.getTime() / 1000,
      10
    );
    if (passwordChangedTime > decoded.iat) {
      return next(
        new ApiError(`Password was recently changed, please login again`, 401)
      );
    }
  }

  if (!user.active && !req.active) {
    return next(
      new ApiError(`You are not active, please reactivate your account.`, 401)
    );
  }

  req.user = user;
  next();
});
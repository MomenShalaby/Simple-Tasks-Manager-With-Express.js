const ApiError = require("../utils/ApiError");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtExpire = () =>
  new ApiError("Token Expired, Please login again", 401);

const handleJwtSignatureError = () =>
  new ApiError("Invalid token, Please login again", 401);

const handleMongooseError = () =>
  new ApiError("Something is wrong with Mongo", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.name === "TokenExpiredError") err = handleJwtExpire();
  if (err.name === "JsonWebTokenError") err = handleJwtSignatureError();
  if (err.name === "MongooseError") err = handleMongooseError();
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorForProd(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;

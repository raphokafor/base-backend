const AppError = require("../utils/appError");

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDb = (err) => {
  const fieldValue = err.errmsg.match(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/)[0];
  const message = `Duplicate field value: ${fieldValue}, Please use a different value`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError("Invalid token. Please login again!", 401);

const handleTokenExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorForProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("PRODUCTION_NON_OP_ERROR", err);

    res.status(500).json({
      status: "error",
      message: "Oops something just went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateFieldDb(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDb(error);
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    sendErrorForProd(error, res);
  }
};

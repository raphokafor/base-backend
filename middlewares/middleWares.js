const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const handleAsync = require("../utils/handleAsync");
const User = require("../models/User");

exports.requireLogin = handleAsync(async (req, res, next) => {
  // get and check if token exists in payload
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to continue", 401)
    );
  }

  // validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // if token valid check user
  const retUser = await User.findById(decoded.id);
  if (!retUser) {
    return next(
      new AppError("The user belonging to this token no longer exist", 401)
    );
  }

  // check if user changed password after the token was issued
  if (retUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password, Please login in again", 401)
    );
  }

  // grant access to the user
  req.user = retUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array, allows to pass in multiple roles access to an endpoint
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

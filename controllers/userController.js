const User = require("../models/User");
const AppError = require("../utils/appError");
const handleAsync = require("../utils/handleAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    console.log("newObj[el] = obj[el]");
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.testy = handleAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: { message: "jkhjkhkjhh" },
  });
});

exports.getUser = handleAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById({ _id: userId });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.getAllUsers = handleAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

exports.getMe = handleAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = handleAsync(async (req, res, next) => {
  // create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Please use the appropriate route to update password", 400)
    );
  }

  // update user document, since its none sensitive, use findByIdAndUpdate
  const filteredRequestBody = filterObj(req.body, "name", "imageUrl");
  console.log("filter req", filteredRequestBody);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredRequestBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = handleAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isDeleted: true });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

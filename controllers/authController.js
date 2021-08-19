// 3rd party modules
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// domain modules
const User = require("../models/User");
const handleAsync = require("../utils/handleAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/emailer").sendEmail;
const generateResetEmail = require("../utils/templates/reset");
const generateWelcomeEmail = require("../utils/templates/welcome");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const expDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expires: expDate,
    httpOnly: true,
  };

  // add cookie options secure(https only) if production
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // remove password from payload
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = handleAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const welcomeEmailHtml = generateWelcomeEmail({
    name: newUser.name,
  });

  const emailObject = {
    email: newUser.email,
    subject: "Welcome To Opos Parking",
    emailHtml: welcomeEmailHtml,
    text: `Hi ${newUser.name}, Welcome to Opos Parking.`,
  };

  sendEmail(emailObject);

  createSendToken(newUser, 201, res);
});

exports.login = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // if everything checks out, generate and send token back to client
  createSendToken(user, 200, res);
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = handleAsync(async (req, res, next) => {
  const { idToken } = req.body;
  const response = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email_verified, name, email, imageUrl } = response.getPayload;

  // initialize user
  let googleUser;

  // assign user if the email is verified
  if (email_verified) {
    // check to see if user exists
    googleUser = await User.findOne({ email });

    // if user doesnt already exist, create account and sendEmail
    if (!googleUser) {
      const _newUser = new User({
        name: name,
        email: email,
        isGoogle: true,
        imageUrl,
      });
      const newUser = await _newUser.save({ validateBeforeSave: false });

      googleUser = newUser;

      const welcomeEmailHtml = generateWelcomeEmail({
        name,
      });

      const emailObject = {
        email: email,
        subject: "Welcome To Opos Parking!",
        emailHtml: welcomeEmailHtml,
        text: `Hi ${name}, Welcome to Opos Parking!`,
      };

      sendEmail(emailObject);
    }
  } else {
    return next(new AppError("Google login failed, Please try again", 400));
  }

  createSendToken(googleUser, 201, res);
});

exports.forgotPassword = handleAsync(async (req, res, next) => {
  // get user based on the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        `There is no user with given email address: ${req.body.email}`,
        404
      )
    );
  }

  // generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send back as an email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit your new password and confirmation to: ${resetURL}. \nIf you did not make this request, please ignore this email!`;

  try {
    const resetEmailHtml = generateResetEmail({
      name: user.name,
      url: resetURL,
    });

    const emailObject = {
      email: user.email,
      subject: "Forgot it? Password reset! (Valid for 10 minutes)",
      emailHtml: resetEmailHtml,
      text: message,
    };

    sendEmail(emailObject);

    return res.status(200).json({
      status: "success",
      message: "Token send to email!",
    });
  } catch (err) {
    console.log("SENDING_RESET_EMAIL_ERROR", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email, Try again later", 500)
    );
  }
});

exports.resetPassword = handleAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token has not expired and theres a valid user, set new password
  if (!user) {
    return next(
      new AppError("Token is invalid or has expired, Please try again.", 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update changedPasswordAt property for the user to current time

  // log user back in by sending back valid jwt
  createSendToken(user, 200, res);
});

exports.updatePassword = handleAsync(async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError("The password entered is incorrect, Please try again", 401)
    );
  }

  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // log in user and send jwt
  createSendToken(user, 200, res);
});

exports.logout = handleAsync(async (req, res, next) => {
  const cookieOptions = {
    maxAge: 1,
  };

  // add cookie options secure(https only) if production
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", "", cookieOptions);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.refreshTheToken = handleAsync(async (req, res, next) => {
  const cookieOptions = {
    maxAge: 1,
  };

  // add cookie options secure(https only) if production
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", "", cookieOptions);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

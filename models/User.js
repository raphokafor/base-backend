const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User must have a name to proceed."],
      maxlength: [60, "Name must have less than 60 characters"],
      minlength: [1, "Name must have more than 3 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Must have an email to proceed."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a valid password."],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // this only works on create and save!!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Confirm password does not match.",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    imageUrl: {
      type: String,
    },
    role: {
      type: String,
      required: [true, "User must have a role"],
      enum: {
        values: ["vendor", "customer", "odogwu"],
        default: "customer",
        message: "User role must be either vendor or customer",
      },
      default: "customer",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    isDeleted: { type: Boolean, default: false, select: false },
    admin: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // check if there was any change to password, if none just continue
  if (!this.isModified("password")) return next();

  // if there was a change then hash the string, the the number the more instense the encryption
  this.password = await bcrypt.hash(this.password, 12);

  // remove the passwordconfirm because it was only needed to validate the user know the password that they are putting in
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("users", userSchema);

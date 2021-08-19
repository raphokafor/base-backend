const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const middleWares = require("../middlewares/middleWares");

router.post("/v1/users/signup", authController.signup);
router.post("/v1/users/login", authController.login);

router.post("/v1/users/forgot-password", authController.forgotPassword);
router.patch("/v1/users/reset-password/:token", authController.resetPassword);

// requires login
router.patch(
  "/v1/users/update-password",
  middleWares.requireLogin,
  authController.updatePassword
);

router.post(
  "/v1/refresh-token",
  middleWares.requireLogin,
  authController.refreshTheToken
);

router.post(
  "/v1/users/logout",
  middleWares.requireLogin,
  authController.logout
);

module.exports = router;

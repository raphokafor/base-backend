const express = require("express");
const router = express.Router();

const middleWares = require("../middlewares/middleWares");
const userController = require("../controllers/userController");

// just a test endpoint
router.get("/v1/test", userController.testy);

// requires login
router.get(
  "/v1/me",
  middleWares.requireLogin,
  userController.getMe,
  userController.getUser
);
router.patch(
  "/v1/users/update",
  middleWares.requireLogin,
  userController.updateMe
);
router.delete(
  "/v1/users/delete",
  middleWares.requireLogin,
  userController.deleteMe
);

// requires super user
router.get(
  "/v1/users",
  middleWares.requireLogin,
  middleWares.restrictTo("odogwu"),
  userController.getAllUsers
);
router.get(
  "/v1/users/:id",
  middleWares.requireLogin,
  middleWares.restrictTo("odogwu"),
  userController.getUser
);

module.exports = router;

"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/checkAuth");
const router = express.Router();

//pre auth
router.post(
  "/request_reset_password",
  asyncHandler(accessController.requestResetPassword)
);
router.post("/resend-otp", asyncHandler(accessController.resendOTP));
router.post("/reset_password", asyncHandler(accessController.resetPassword));
router.post("/pre_signup", asyncHandler(accessController.preSignUp));
router.post(
  "/verify_otp_and_signup",
  asyncHandler(accessController.verifyOTPAndSignUp)
);
router.post("/login", asyncHandler(accessController.logIn));
router.post("/google-login", asyncHandler(accessController.googleLogin));

//authentication
// router.use(authentication)

//
router.post(
  "/change_password",
  authentication,
  asyncHandler(accessController.changePassword)
);
router.post(
  "/refresh_token",
  authentication,
  asyncHandler(accessController.refreshToken)
);
router.post("/logout", authentication, asyncHandler(accessController.logOut));
module.exports = router;

const express = require("express");
const router = express.Router();
const otpController = require("../../controllers/otp.controller")
const { asyncHandler } = require("../../helpers/asyncHandler");

router.post("/send_otp", asyncHandler(otpController.sendOTP))

module.exports = router;
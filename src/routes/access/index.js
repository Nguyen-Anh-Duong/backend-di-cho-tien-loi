"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/checkAuth");
const router = express.Router();

router.post("/pre_signup", asyncHandler(accessController.preSignUp));
router.post("/verify_otp_and_signup", asyncHandler(accessController.verifyOTPAndSignUp));
router.post("/login", asyncHandler(accessController.logIn));

//authentication
router.use(authentication)

router.post("/logout", asyncHandler(accessController.logOut));
module.exports = router;

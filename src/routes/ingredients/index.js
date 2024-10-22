const express = require("express");
const router = express.Router();
const otpController = require("../../controllers/otp.controller")
const { asyncHandler } = require("../../helpers/asyncHandler");
const ingredientController = require("../../controllers/ingredient.controller");

router.get("/", asyncHandler(ingredientController.getALlIngredients))

module.exports = router;
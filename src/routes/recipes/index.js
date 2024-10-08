"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const recipeController = require("../../controllers/recipe.controller");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.use(authentication);

router.post("/", asyncHandler(recipeController.CreateRecipe));

module.exports = router;

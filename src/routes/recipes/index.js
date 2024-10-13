"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const recipeController = require("../../controllers/recipe.controller");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.use(authentication);

router.post("/", asyncHandler(recipeController.createRecipe));
router.patch("/:id", recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;

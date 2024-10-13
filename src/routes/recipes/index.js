"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const recipeController = require("../../controllers/recipe.controller");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

// router.use(authentication);

router.post("/", asyncHandler(recipeController.createRecipe));
router.get("/", asyncHandler(recipeController.getAllRecipe));
router.get("/:id", asyncHandler(recipeController.getRecipeById));
router.patch("/:id", asyncHandler(recipeController.updateRecipe));
router.delete("/:id", asyncHandler(recipeController.deleteRecipe));

module.exports = router;

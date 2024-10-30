"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const recipeController = require("../../controllers/recipe.controller");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.use(authentication);

router.post("/ingredients", asyncHandler(recipeController.addNewIngredients));


router.post("/", asyncHandler(recipeController.createRecipe));
router.get("/", asyncHandler(recipeController.getAllRecipe));
router.get("/:recipeId", asyncHandler(recipeController.getRecipeById));
router.patch("/:recipeId", asyncHandler(recipeController.updateRecipe));
router.delete("/:recipeId", asyncHandler(recipeController.deleteRecipe));

module.exports = router;

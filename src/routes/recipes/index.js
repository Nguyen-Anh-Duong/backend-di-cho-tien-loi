"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const RecipeController = require("../../controllers/recipe.controller");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.get("/all", asyncHandler(RecipeController.getAllRecipes));
router.get("/categories", asyncHandler(RecipeController.getAllCategories));
router.use(authentication);

router.post("/ingredients", asyncHandler(RecipeController.addNewIngredients));
router.patch("/ingredients", asyncHandler(RecipeController.updateIngredients));
router.delete("/ingredients", asyncHandler(RecipeController.deleteIngredient));

router.post("/", asyncHandler(RecipeController.createRecipe));
router.get("/", asyncHandler(RecipeController.getPersonalRecipes));
//router.get("/:recipeId", asyncHandler(RecipeController.getRecipeById));
router.patch("/:recipeId", asyncHandler(RecipeController.updateRecipe));
router.delete("/:recipeId", asyncHandler(RecipeController.deleteRecipe));

module.exports = router;

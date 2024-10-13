"use strict";
const { ErrorResponse, NotFoundError } = require("../core/error.response");
const recipeModel = require("../models/recipe.model");

class RecipeService {
  static async getAllRecipe() {
    return await recipeModel.find();
  }
  static async getRecipeById(recipeId) {
    return await recipeModel.findById(recipeId);
  }
  static async createRecipe(recipe) {
    const newRecipe = recipeModel(recipe);
    await newRecipe.save(recipe);
    return newRecipe;
  }

  static async updateRecipe(recipeId, newRecipe) {
      const updateRecipe = await recipeModel.findByIdAndUpdate(
        recipeId,
        { $set: newRecipe },
        { new: true, runValidators: true }
      );

      if (!updateRecipe) {
        throw new NotFoundError("Recipe not found", 404);
      }
      return updateRecipe;
  }

  static async deleteRecipe(recipeId) {
      const deleteRecipe = await recipeModel.findByIdAndDelete(recipeId);
      if (!deleteRecipe) {
        throw new NotFoundError("Recipe not found", 404);
      }
      return deleteRecipe;
  }
}

module.exports = RecipeService;

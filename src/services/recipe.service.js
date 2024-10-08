"use strict";
const { ErrorResponse, NotFoundError } = require("../core/error.response");
const recipeModel = require("../models/recipe.model");

class RecipeService {
  static async createRecipe(recipe) {
    const newRecipe = recipeModel(recipe);
    await newRecipe.save(recipe);
    return newRecipe;
  }

  static async updateRecipe(recipeId, newRecipe) {
    try {
      const updateRecipe = await recipeModel.findByIdAndUpdate(
        recipeId,
        { $set: newRecipe },
        { new: true, runValidators: true }
      );

      if (!updateRecipe) {
        throw new NotFoundError("Recipe not found", 404);
      }
      return updateRecipe;
    } catch (error) {
      throw error;
    }
  }

  static async deleteRecipe(recipeId) {
    try {
      const deleteRecipe = await recipeModel.findByIdAndDelete(recipeId);
      if (!deleteRecipe) {
        throw new NotFoundError("Recipe not found", 404);
      }
      return deleteRecipe;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RecipeService;

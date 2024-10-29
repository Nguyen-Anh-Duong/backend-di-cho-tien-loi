"use strict";
const { ErrorResponse, NotFoundError, ForbiddenError } = require("../core/error.response");
const recipeModel = require("../models/recipe.model");
const userModel = require("../models/user.model");

class RecipeService {
  static async getAllRecipe() {
    return await recipeModel.find();
  }
  static async getRecipeById(recipeId) {
    return await recipeModel.findById(recipeId);
  }
  static async getRecipeByUserId(userId) {
    const foundUser = await userModel.findById(userId).lean();
    if (!foundUser) {
      throw new NotFoundError("User not found", 404);
    }
    const listRecipe = foundUser.user_favourite_recipes;
    const recipes = await recipeModel.find({ _id: { $in: listRecipe } });
    if(!recipes) {
      throw new NotFoundError("Recipes not found", 404);
    }
    return recipes;
  }
  static async createRecipe(recipe) {
    const newRecipe = recipeModel(recipe);
    await newRecipe.save(recipe);
    return newRecipe;
  }

  static async updateRecipe(userId, recipeId, newRecipe) {
    //check 
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      throw new NotFoundError("User not found", 404);
    }
    //check recipe in  user_favourite_recipes
    const isValidRecipe = foundUser.user_favourite_recipes.includes(recipeId);
    if (!isValidRecipe) {
      throw new ForbiddenError("Recipe not in user's favourite recipes");
    }
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

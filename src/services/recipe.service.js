"use strict";
const ApiError = require("../core/ApiError");
const { ErrorResponse, NotFoundError } = require("../core/error.response");
const Recipe = require("../models/recipe.model");
const User = require("../models/user.model");

class RecipeService {
  static async getAllRecipe() {
    return await recipeModel.find();
  }
  static async getRecipeById(recipeId) {
    return await recipeModel.findById(recipeId);
  }
  static async createRecipe(req) {
    const { userId } = req.user;

    const {
      recipe_name,
      recipe_description,
      recipe_cook_time,
      recipe_youtube_url,
      recipe_category,
      recipe_image,
      is_published,
      is_draft,
      recipe_id_crawl,
      recipe_ingredients,
    } = req.body;
    const newRecipe = Recipe({
      userId,
      recipe_name,
      recipe_description,
      recipe_cook_time,
      recipe_youtube_url,
      recipe_category,
      recipe_image,
      is_published,
      is_draft,
      recipe_id_crawl,
      recipe_ingredients,
    });
    await newRecipe.save();

    const response = newRecipe.toObject();
    delete response.createdAt;
    delete response.updatedAt;
    delete response.__v;

    return response;
  }

  static async updateRecipe(req) {
    const { userId } = req.user;
    const recipeId = req.params.recipeId;

    const {
      recipe_name,
      recipe_description,
      recipe_cook_time,
      recipe_youtube_url,
      recipe_category,
      recipe_image,
      is_published,
      is_draft,
      recipe_id_crawl,
      recipe_ingredients,
    } = req.body;

    const updateRecipe = await Recipe.findByIdAndUpdate(
      { _id: recipeId, userId },
      {
        $set: {
          recipe_name,
          recipe_description,
          recipe_cook_time,
          recipe_youtube_url,
          recipe_category,
          recipe_image,
          is_published,
          is_draft,
          recipe_id_crawl,
          recipe_ingredients,
        },
      },
      { new: true, runValidators: true }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();

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

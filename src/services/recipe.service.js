"use strict";
const ApiError = require("../core/ApiError");
const { ErrorResponse, NotFoundError } = require("../core/error.response");
const Recipe = require("../models/recipe.model");
const User = require("../models/user.model");

class RecipeService {
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  static async getAllCategories() {
    const categories = await Recipe.distinct("recipe_category");
    console.log("Categories:", categories);
    return categories;
  }
  static async getAllRecipes() {
    const recipes = await Recipe.find({ is_published: true }).lean();
    return this.shuffleArray(recipes);
  }
  static async getAllRecipesNoShuff() {
    const recipes = await Recipe.find({ is_published: true }).lean();
    return recipes;
  }
  static async getPersonalRecipes(req) {
    const { userId } = req.user;
    const recipes = await Recipe.find({ userId })
      .select("-createdAt -updatedAt -__v")
      .lean();
    return recipes;
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
      recipe_rating,
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
      recipe_rating,
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
      recipe_rating,
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
          recipe_rating,
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

    if (!updateRecipe) throw new ApiError("Không tìm thấy công thức", 404);
    return updateRecipe;
  }
  static async updateRecipeByAdmin(req) {
    const { userId } = req.user;
    const recipeId = req.params.recipeId;

    const {
      recipe_name,
      recipe_description,
      recipe_cook_time,
      recipe_youtube_url,
      recipe_rating,
      recipe_category,
      recipe_image,
      is_published,
      is_draft,
      recipe_id_crawl,
      recipe_ingredients,
    } = req.body;

    const updateRecipe = await Recipe.findByIdAndUpdate(
      { _id: recipeId},
      {
        $set: {
          recipe_name,
          recipe_description,
          recipe_cook_time,
          recipe_youtube_url,
          recipe_rating,
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

    if (!updateRecipe) throw new ApiError("Không tìm thấy công thức", 404);
    return updateRecipe;
  }

  static async deleteRecipe(req) {
    const { userId } = req.user;
    const recipeId = req.params.recipeId;
    const deleteRecipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      userId,
    })
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!deleteRecipe) {
      if (!recipe) throw new ApiError("Không tìm thấy công thức", 404);
    }
    // return deleteRecipe;
    return "xoa thanh cong";
  }
  static async deleteRecipeAdmin(req) {
    const { userId } = req.user;
    const recipeId = req.params.recipeId;
    const deleteRecipe = await Recipe.findOneAndDelete({
      _id: recipeId,
    })
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!deleteRecipe) {
      if (!recipe) throw new ApiError("Không tìm thấy công thức", 404);
    }
    // return deleteRecipe;
    return "xoa thanh cong";
  }

  static async addNewIngredients(req) {
    const { userId } = req.user;
    const { recipeId, ingredients } = req.body;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, userId },
      {
        $push: {
          recipe_ingredients: ingredients,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!recipe) throw new ApiError("Không tìm thấy công thức", 404);
    return recipe;
  }

  static async updateIngredients(req) {
    const { userId } = req.user;
    const { recipeId, ingredients } = req.body;

    const updateObject = {};

    // Tạo đối tượng cập nhật cho từng thành phần
    ingredients.forEach((ingredient, index) => {
      updateObject[`recipe_ingredients.$[elem${index}].name`] = ingredient.name;
      updateObject[`recipe_ingredients.$[elem${index}].quantity`] =
        ingredient.quantity;
      updateObject[`recipe_ingredients.$[elem${index}].unit`] = ingredient.unit;
      updateObject[`recipe_ingredients.$[elem${index}].category`] =
        ingredient.category;
      //updateObject[`recipe_ingredients.$[elem${index}]._id`] = ingredient._id;
    });

    try {
      const recipe = await Recipe.findOneAndUpdate(
        {
          _id: recipeId,
          userId,
        },
        {
          $set: updateObject,
        },
        {
          new: true,
          runValidators: true,
          arrayFilters: ingredients.map((ingredient, index) => ({
            [`elem${index}._id`]: ingredient._id,
          })),
        }
      )
        .select("-createdAt -updatedAt -__v")
        .lean();

      if (!recipe) throw new ApiError("Không tìm thấy công thức", 404);
      return recipe;
    } catch (err) {
      switch (err.name) {
        case "ValidationError":
          throw new ApiError(err.message, 400);
        case "CastError":
          throw new ApiError(err.message, 400);
        case "MongoError":
          throw new ApiError("Lỗi cơ sở dữ liệu", 500);
        default:
          throw err;
      }
    }
  }

  static async deleteIngredient(req) {
    const { userId } = req.user;
    const { recipeId, ingredients } = req.body;
    const recipe = await Recipe.findOneAndUpdate(
      {
        _id: recipeId,
        userId,
      },
      {
        $pull: {
          recipe_ingredients: {
            _id: { $in: ingredients },
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!recipe) throw new ApiError("Không tìm thấy công thức", 404);
    return recipe;
  }
}

module.exports = RecipeService;

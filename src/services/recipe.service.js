"use strict";
const recipeModel = require("../models/recipe.model");

class RecipeService {
  static async createRecipe({ foodName, name, htmlContent, description }) {
    const newRecipe = new recipeModel({
      foodName,
      name,
      htmlContent,
      description,
    });
    await newRecipe.save();
  }
}

module.exports = RecipeService;

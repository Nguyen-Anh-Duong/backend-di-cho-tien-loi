const { SuccessResponse } = require("../core/success.response");
const RecipeService = require("../services/recipe.service");
const { update } = require("lodash");

class RecipeController {
  createRecipe = async (req, res, next) => {
    new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.createRecipe(req),
    }).send(res);
  };

  updateRecipe = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.updateRecipe(req),
    }).send(res);
  };

  deleteRecipe = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.deleteRecipe(req),
    }).send(res);
  };

  addNewIngredients = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.addNewIngredients(req),
    }).send(res);
  };

  getPersonalRecipes = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.getPersonalRecipes(req),
    }).send(res);
  };
  getRecipeByRecipeId = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.getRecipeById(req),
    }).send(res);
  };
  getRecipeByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    return new SuccessResponse({
      metadata: await RecipeService.getRecipeByUserId(userId),
    }).send(res);
  };

  updateIngredients = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.updateIngredients(req),
    }).send(res);
  };

  deleteIngredient = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.deleteIngredient(req),
    }).send(res);
  };
}

module.exports = new RecipeController();

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
  getAllRecipe = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.getAllRecipe(),
    }).send(res);
  };
  getRecipeByRecipeId = async (req, res, next) => {
    return new SuccessResponse({
      message: "ok",
      statusCode: 200,
      metadata: await RecipeService.getRecipeById(req),
    }).send(res);
  };
}

module.exports = new RecipeController();

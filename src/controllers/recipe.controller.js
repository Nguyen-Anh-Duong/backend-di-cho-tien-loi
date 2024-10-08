const { model } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const RecipeService = require("../services/recipe.service");

class RecipeController {
  CreateRecipe = async (req, res, next) => {
    new SuccessResponse({
      message: {
        en: "success",
        vi: "Thêm công thức nấu ăn thành công",
      },
      statusCode: "00357",
      metadata: await RecipeService.createRecipe(req.body),
    }).send(res);
  };
}

module.exports = new RecipeController();

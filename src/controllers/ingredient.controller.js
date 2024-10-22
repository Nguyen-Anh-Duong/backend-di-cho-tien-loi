'use strict'

const { SuccessResponse } = require("../core/success.response");
const IngredientService = require("../services/ingredient.service");
class OtpController {
    getALlIngredients = async (req, res, next) => {
        new SuccessResponse({
            message: "OK",
            metadata: await IngredientService.getAllIngredients({limit : 50, offset : 0})
        }).send(res)
    }
}

module.exports = new OtpController();


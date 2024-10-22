'use strict'

const ingredientsModel = require("../models/ingredients.model")

class IngredientService {
    static getAllIngredients = async ({limit= 50, offset = 0}) => {
        const ingre =  await ingredientsModel.find().skip(offset).limit(limit);
        return ingre? ingre : []
    }
}
module.exports = IngredientService
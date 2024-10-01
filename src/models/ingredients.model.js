const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Ingredient";
const COLLECTION_NAME = "Ingredients";

const ingredientSchema = new Schema(
  {
    ingredient_name: { type: String, required: true },
    ingredient_thumbnail: {type: String, default: ''},
    ingredient_name_vi: {type: String, default: ''},
    ingredient_image: {type: String, default: ''},
    ingredient_category: {type: String, default: 'unknown'}
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, ingredientSchema)
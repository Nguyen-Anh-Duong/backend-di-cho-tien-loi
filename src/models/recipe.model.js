const { mongoose, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Recipe";
const COLLECTION_NAME = "Recipes";

const recipeSchema = new Schema(
  // {
  //   recipe_name: { type: String, required: true },
  //   recipe_desciption: { type: String, default: "" },
  //   recipe_ingredients: [
  //     {
  //       name: { type: String, required: true },
  //       quantity: { type: Number, required: true },
  //       type: { type: String, default: "" },
  //       unit: { type: String, required: true },
  //     },
  //   ],
  //   recipe_cook_time: { type: String, default: "" },
  //   recipe_category: { type: String, default: "" },
  //   recipe_image: { type: String, default: "" },
  //   is_published: { type: Boolean, default: false },
  //   is_draft: { type: Boolean, default: true },
  // },
  {
    foodName: String,
    name: String,
    htmlContent: String,
    description: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, recipeSchema);

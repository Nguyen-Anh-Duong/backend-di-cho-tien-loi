const { mongoose, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Recipe";
const COLLECTION_NAME = "Recipes";

const recipeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipe_name: { type: String, required: true },
    recipe_description: { type: String, default: "" },
    recipe_ingredients: [
      {
        name: { type: String, required: true },
        measure: { type: String, default: "" },
      },
    ],
    recipe_cook_time: { type: String, default: "" },
    recipe_youtube_url: {
      type: String,
      default: "",
    },
    recipe_category: { type: String, default: "" },
    recipe_image: { type: String, default: "" },
    is_published: { type: Boolean, default: false },
    is_draft: { type: Boolean, default: true },
    recipe_id_crawl: { type: String, required: true, default: "x" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, recipeSchema);

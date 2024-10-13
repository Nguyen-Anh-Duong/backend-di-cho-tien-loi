const { mongoose, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Recipe";
const COLLECTION_NAME = "Recipes";

const recipeSchema = new Schema(
  {
    recipe_name: { type: String, required: true },
    recipe_description: { type: String, default: "" },
    recipe_ingredients: [
      {
        name: { type: String, required: true },
<<<<<<< HEAD
        measure: { type: String, default: "" },
=======
        measure: {type: String, default: ''}
>>>>>>> 1006e29014a3605a1e4e690c22f719aa3916db12
      },
    ],
    recipe_cook_time: { type: String, default: "" },
    recipe_youtube_url: {
<<<<<<< HEAD
      type: String,
      default: "",
=======
      type: String, default: ""
>>>>>>> 1006e29014a3605a1e4e690c22f719aa3916db12
    },
    recipe_category: { type: String, default: "" },
    recipe_image: { type: String, default: "" },
    is_published: { type: Boolean, default: false },
    is_draft: { type: Boolean, default: true },
<<<<<<< HEAD
    recipe_id_crawl: { type: String, required: true },
=======
    recipe_id_crawl: {type: String, required: true}
>>>>>>> 1006e29014a3605a1e4e690c22f719aa3916db12
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, recipeSchema);

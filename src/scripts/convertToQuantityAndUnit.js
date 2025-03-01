const axios = require("axios");
const mongoose = require("mongoose");
const recipeModel = require("../models/recipe.model");

const mongoURI = "mongodb://localhost:27017/di-cho-tien-loi";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDB connected successfully"));

function splitMeasure(measure) {
  // Match whole numbers, decimals, and fractions at the start of string
  const match = measure.match(/^(\d+(?:\/\d+)?(?:\.\d+)?)/);
  if (!match) return { quantity: "", unit: measure.trim() };

  const quantity = match[0];
  // Phần còn lại sau số sẽ là unit
  const unit = measure.substring(quantity.length).trim();
  return { quantity, unit };
}

async function main() {
  try {
    const response = await axios.get("http://localhost:3056/v1/api/recipe");
    const metadata = response.data["metadata"];

    for (const recipe of metadata) {
      const ingredients = recipe["recipe_ingredients"];
      const updatedIngredients = ingredients.map((ingredient) => {
        const { quantity, unit } = splitMeasure(ingredient.measure);
        return {
          ...ingredient,
          quantity,
          unit,
          measure: undefined,
        };
      });

      await recipeModel.findByIdAndUpdate(
        recipe._id,
        { recipe_ingredients: updatedIngredients },
        { new: true }
      );

      console.log(`Updated recipe: ${recipe._id}`);
    }

    console.log("All recipes updated successfully");
  } catch (error) {
    console.log("Error:", error);
  }
}

main();

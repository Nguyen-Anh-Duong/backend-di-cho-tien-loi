const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model");
const axios = require("axios");

const translations = {
  Beef: "Thịt bò",
  Breakfast: "Bữa sáng",
  Chicken: "Thịt gà",
  Dessert: "Món tráng miệng",
  Goat: "Thịt dê",
  Lamb: "Thịt cừu",
  Miscellaneous: "Khác",
  Pasta: "Mì ống",
  Pork: "Thịt heo",
  Seafood: "Hải sản",
  Side: "Món phụ",
  Starter: "Món khai vị",
  Vegan: "Thuần chay",
  Vegetarian: "Chay",
};
const mongoURI =
  "mongodb+srv://dauhu1232019:vSqrW4bhaCdjbXC8@cluster01.kmae3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDB connected successfully"));

async function main() {
  const response = await axios.get("http://localhost:3056/v1/api/recipe/all");
  const metadata = response.data["metadata"];
  const allRecipes = metadata;
  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const translatedCategory = translations[recipe.recipe_category];
    if (translatedCategory) {
      await Recipe.findByIdAndUpdate(
        recipe._id,
        { recipe_category: translatedCategory },
        { new: true }
      );
      console.log(
        `${i}::Updated recipe ${recipe.recipe_name} == ${translatedCategory}`
      );
    } else {
      console.warn(
        `${i}::No translation found for category ${recipe.recipe_category} of recipe ${recipe.recipe_name}`
      );
    }
  }
}

main();

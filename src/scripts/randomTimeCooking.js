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

function randomCookTime() {
  // Generate a random cook time between 10 and 120 minutes
  return Math.floor(Math.random() * (120 - 10 + 1)) + 10;
}
function randomRating() {
    return Math.floor(Math.random() * (5 - 3 + 1)) + 3;
}

async function main() {
  try {
    const response = await axios.get("http://localhost:3056/v1/api/recipe");
    const metadata = response.data["metadata"]; 
    
    for (const recipe of metadata) {
        const updatedCookTime = randomCookTime();
        const updatedRating = randomRating();
      
      // Update the recipe in the database with new cook time
      await recipeModel.findByIdAndUpdate(
        recipe._id,
        { recipe_cook_time: updatedCookTime,
            recipe_rating: updatedRating
         },
        { new: true }
      );
      
      console.log(`Updated recipe: ${recipe._id} with cook time: ${updatedCookTime} rating: ${updatedRating}`);
    }
    
    console.log('All recipes updated successfully');
  } catch (error) {
    console.log('Error:', error);
  }
}

main();

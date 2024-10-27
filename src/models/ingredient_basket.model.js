const mongoose = require("mongoose");

const DOCUMENT_NAME = "IngredientBasket";
const COLLECTION_NAME = "IngredientBaskets";

const ingredientBasketSchema = new mongoose.Schema(
  {
    basketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Basket",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, default: "" },
    unit: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "bought"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// const ingredientBasketModel = mongoose.model(DOCUMENT_NAME, ingredientBasketSchema);

// module.exports = ingredientBasketModel;

//module.exports = mongoose.model(DOCUMENT_NAME, ingredientBasketSchema);

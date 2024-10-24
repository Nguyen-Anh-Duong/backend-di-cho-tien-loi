const mongoose = require("mongoose");

const DOCUMENT_NAME = "Basket";
const COLLECTION_NAME = "Baskets";

const basketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        category: { type: String, default: "" },
        unit: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "bought"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, basketSchema);

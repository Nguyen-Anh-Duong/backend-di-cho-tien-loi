const mongoose = require("mongoose");
require("dotenv/config");

const connectString = process.env.DB_URL_TEST;
mongoose
  .connect(connectString)
  .then((_) => console.log("Connect MongoDB successfully!!"))
  .catch((error) => console.log("Connect error!!"));

const DOCUMENT_NAME = "test";
const COLLECTION_NAME = "test";

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
        type: { type: String, default: "hhhhhhhhhhhhhhhhhh" },
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

const model = mongoose.model(DOCUMENT_NAME, basketSchema);

const testBasket = new model({
  userId: "67173915c7e3fe2534000954",
  name: "gggggggggggggggggggggggggg",
  description: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
});

const createIngredient = (index) => ({
  name: `Ingredient ${index}`,
  quantity: Math.floor(Math.random() * 100) + 1, // Random số lượng từ 1-100
  unit: "kg", // Đơn vị ví dụ là kg
});

// Thêm 1000 ingredients vào testBasket
for (let i = 0; i < 1000; i++) {
  testBasket.ingredients.push(createIngredient(i));
}

// Lưu vào database
testBasket
  .save()
  .then((doc) => {
    console.log("Basket created with 1000 ingredients:", doc);
  })
  .catch((err) => {
    console.error("Error creating basket:", err);
  });

//module.exports = mongoose.model(DOCUMENT_NAME, basketSchema);

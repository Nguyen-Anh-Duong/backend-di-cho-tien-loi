const { model, Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Fridge";
const COLLECTION_NAME = "Fridges";

const fridgeSchema = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "others",
    },
    expiryDate: {
      type: Number,
      default: -1,
    },
    addedDate: {
      type: Number,
      default: new Date().getTime(),
    },
    isConsumed: {
      type: Boolean,
      default: false,
    },
    consumedDate: {
      type: Number,
      default: -1,
    },
    storageLocation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const Fridge = model(DOCUMENT_NAME, fridgeSchema);

module.exports = Fridge;

const { mongoose, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "ShoppingList";
const COLLECTION_NAME = "ShoppingLists";

const shoppingListSchema = new Schema(
  // {
  //   userId: { type: Schema.Types.ObjectId, ref: "User" },
  //   shared_with_family_groupId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "FamilyGroup",
  //   },
  //   ingredients: [
  //     {
  //       name: { type: String, required: true },
  //       quantity: { type: Number, required: true },
  //       type: { type: String, default: "" },
  //       unit: { type: String, required: true },
  //       status: {
  //         type: String,
  //         enum: ["pending", "bought"],
  //         default: "pending",
  //       },
  //     },
  //   ],
  // },
  // {
  //   timestamps: true,
  //   collection: COLLECTION_NAME,
  // }
  {
    name: {
      type: String,
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId, ref: "User" 
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
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    family_id: { type: Schema.Types.ObjectId, ref: "FamilyGroups" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const ShoppingList = model(DOCUMENT_NAME, shoppingListSchema);

module.exports = ShoppingList;

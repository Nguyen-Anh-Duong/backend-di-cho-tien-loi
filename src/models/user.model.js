"use strict";

const { model, Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    user_password: { type: String, required: true },
    user_slug: { type: String, default: "" },
    user_role_system: { type: Schema.Types.ObjectId, ref: "Role" },
    user_sex: { type: String, default: "" },
    user_phone: { type: String, default: "" },
    user_avatar: { type: String, default: "" },
    user_status: {
      type: String,
      enum: ["pending", "active", "block"],
      default: "active",
    },
    user_family_group: { type: Schema.Types.ObjectId, ref: "FamilyGroup" },
    user_role_group: {
      groupId: {
        type: Schema.Types.ObjectId,
        ref: 'FamilyGroup'
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
      }
    },
    user_shopping_lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "ShoppingList",
      },
    ],
    user_favourite_recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);

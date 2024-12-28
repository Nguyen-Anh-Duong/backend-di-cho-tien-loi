"use strict";

const { model, Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    user_password: {
      type: String,
      required: true,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, default: null },
    googleAccessToken: { type: String, default: null },
    user_slug: { type: String, default: "" },
    user_role_system: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
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
        ref: "FamilyGroup",
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        // default: 'member'
      },
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
    fcmToken: { type: String },
    notifications: [
      {
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        from: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);

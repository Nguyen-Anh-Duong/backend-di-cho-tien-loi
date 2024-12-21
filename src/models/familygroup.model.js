"use strict";

const { model, Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "FamilyGroup";
const COLLECTION_NAME = "FamilyGroups";

const familyGroupSchema = new Schema(
  {
    fam_name: { type: String, default: "Family" },
    fam_members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member" },
        //is_shopping_today: { type: Boolean, default: false },
        //username: { type: String, required: true },
      },
    ],
    //fam_shared_lists: [{ type: Schema.Types.ObjectId, ref: "ShoppingLists" }],
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, // nguoi tao nhom
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, familyGroupSchema);

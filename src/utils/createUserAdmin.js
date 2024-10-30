const { convertToObjectId } = require(".");
const userModel = require("../models/user.model");

async function createUserAdmin() {
    await userModel.create({
        user_email: "admin@gmail.com",
        user_password: "admin123",
        user_name: "admin",
        user_role: convertToObjectId("66f0a0ae56fd66e6f5c1bfd6"),
        user_favourite_recipes: [convertToObjectId("67048554a2256daadeeca86a")],
    })
    console.log("create admin oke");
}
module.exports = { createUserAdmin };

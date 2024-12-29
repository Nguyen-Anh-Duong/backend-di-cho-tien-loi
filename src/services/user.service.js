"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const ShoppingList = require("../models/shoppinglist.model");
const Basket = require("../models/baskets.model");
const userModel = require("../models/user.model");
const { convertToObjectId, getInfoData } = require("../utils");
class UserService {
  static async review({ userId, month, year }) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Truy vấn shopping lists và baskets
    const shoppingLists = await ShoppingList.find({
      created_by: userId,
      createdAt: { $gte: startDate, $lt: endDate },
    });

    const baskets = await Basket.find({
      userId: userId,
      createdAt: { $gte: startDate, $lt: endDate },
    });

    // Tạo một đối tượng để lưu trữ số lượng của từng ingredient
    const ingredientMap = {
      money: 0,
      basket: {},
      family: {},
    };
    const pendingIngredientMap = {
      money: 0,
      basket: {},
      family: {},
    };

    // Duyệt qua từng shopping list
    shoppingLists.forEach((list) => {
      list.ingredients.forEach((ingredient) => {
        console.log(ingredient);
        if (ingredient.status === "bought") {
          const quantity = ingredient.quantity ?? 0; // Sử dụng giá trị mặc định nếu quantity là null
          if (ingredientMap.family[ingredient.name]) {
            ingredientMap.family[ingredient.name].quantity += quantity;
          } else {
            ingredientMap.family[ingredient.name] = {
              name: ingredient.name,
              quantity: quantity,
              category: ingredient.category,
              unit: ingredient.unit,
              status: ingredient.status,
            };
          }
        } else {
          const quantity = ingredient.quantity ?? 0; // Sử dụng giá trị mặc định nếu quantity là null
          if (pendingIngredientMap.family[ingredient.name]) {
            pendingIngredientMap.family[ingredient.name].quantity += quantity;
          } else {
            pendingIngredientMap.family[ingredient.name] = {
              name: ingredient.name,
              quantity: quantity,
              category: ingredient.category,
              unit: ingredient.unit,
              status: ingredient.status,
            };
          }
        }
      });
    });
    console.log(ingredientMap);

    // Duyệt qua từng basket
    baskets.forEach((basket) => {
      pendingIngredientMap.money += basket.totalMoney;
      basket.ingredients.forEach((ingredient) => {
        if (ingredient.status === "bought") {
          const quantity = ingredient.quantity ?? 0; // Sử dụng giá trị mặc định nếu quantity là null
          const totalMoney = ingredient.totalMoney ?? 0; // Sử dụng giá trị mặc định nếu totalMoney là null
          if (ingredientMap.basket[ingredient.name]) {
            ingredientMap.basket[ingredient.name].quantity += quantity;
            ingredientMap.basket[ingredient.name].totalMoney += totalMoney;
          } else {
            ingredientMap.basket[ingredient.name] = {
              name: ingredient.name,
              quantity: quantity,
              category: ingredient.category,
              unit: ingredient.unit ?? "",
              status: ingredient.status,
              totalMoney: totalMoney,
            };
          }
        } else {
          const quantity = ingredient.quantity ?? 0; // Sử dụng giá trị mặc định nếu quantity là null
          if (pendingIngredientMap.basket[ingredient.name]) {
            pendingIngredientMap.basket[ingredient.name].basket += quantity;
          } else {
            pendingIngredientMap.basket[ingredient.name] = {
              name: ingredient.name,
              quantity: quantity,
              category: ingredient.category,
              unit: ingredient.unit,
              status: ingredient.status,
            };
          }
        }
      });
    });

    return {
      ingredientMap: ingredientMap,
      pendingIngredientMap: pendingIngredientMap,
    };
  }
  static saveToken = async ({ userId, fcmToken }) => {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send("User not found.");
    user.fcmToken = fcmToken;
    await user.save();
  };
  static getUser = async ({ userId }) => {
    console.log(userId);
    const user = await userModel.findById(userId);

    return user;
  };
  static findAllUsers = async () => {
    return await userModel.find();
  };
  static updateRole = async ({ roleId, userId }) => {
    if (!roleId) {
      throw new NotFoundError("NOOOOOOOOOOO");
    }
    const query = {
      _id: userId,
    };
    const updateSet = {
      $set: {
        user_role_system: convertToObjectId(roleId),
      },
    };
    const options = {
      new: true,
    };
    const foundUser = await userModel.findByIdAndUpdate(
      query,
      updateSet,
      options
    );
    return foundUser;
  };
  static updateProfileUser = async ({
    userId,
    user_name,
    user_sex,
    user_phone,
    user_avatar,
  }) => {
    const query = { _id: userId };
    let updateSet = {};
    if (user_name) updateSet.user_name = user_name;
    if (user_sex) updateSet.user_sex = user_sex;
    if (user_phone) updateSet.user_phone = user_phone;
    if (user_avatar) updateSet.user_avatar = user_avatar;
    const options = { new: true };
    const updateUser = await userModel.findOneAndUpdate(
      query,
      updateSet,
      options
    );
    if (!updateUser) throw new BadRequestError("Update khong thanh cong");
    return getInfoData({
      object: updateUser,
      fields: [
        "user_name",
        "user_email",
        "user_phone",
        "user_sex",
        "user_avatar",
        "user_role_system",
      ],
    });
  };
  static blockUser = async ({ userId }) => {
    const query = { _id: userId };
    let updateSet = { user_status: "block" };
    const options = { new: true };

    const blockUser = await userModel.findOneAndUpdate(
      query,
      updateSet,
      options
    );
    if (!blockUser) {
      throw new BadRequestError("Block khong thanh cong");
    }
    return getInfoData({
      object: blockUser,
      fields: ["user_name", "user_email", "user_status"],
    });
  };
}

module.exports = UserService;

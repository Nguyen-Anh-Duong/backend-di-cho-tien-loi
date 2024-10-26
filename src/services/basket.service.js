"use strict";

const Basket = require("../models/baskets.model");
const ApiError = require("../core/ApiError");
const { update } = require("lodash");

class BasketService {
  static createBasket = async (req) => {
    const { name, description } = req.body;
    const { userId } = req.user;
    const newBasket = new Basket({ userId, name, description });
    await newBasket.save();

    const response = newBasket.toObject();
    delete response.createdAt;
    delete response.updatedAt;

    return response;
  };

  static updateBasket = async (req) => {
    const basketId = req.params.basketId;
    const { name, description } = req.body;
    const { userId } = req.user;

    const updateBasket = await Basket.findOneAndUpdate(
      { _id: basketId, userId },
      { name, description },
      { new: true, runValidators: true }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!updateBasket) throw new ApiError("Khong tim thay gio hang", 404);
    return updateBasket;
  };

  static deleteBasket = async (req) => {
    const basketId = req.params.basketId;
    const { userId } = req.user;

    const foundAndDelete = await Basket.findOneAndDelete({
      _id: basketId,
      userId,
    })
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!foundAndDelete) throw new ApiError("Khong tim thay gio hang", 404);

    return foundAndDelete;
  };

  static getBasketByBasketId = async (req) => {
    const basketId = req.params.basketId;
    const { userId } = req.user;

    const found = await Basket.findOne({ _id: basketId, userId })
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!found) throw new ApiError("Khong tim thay gio hang", 404);
    return found;
  };

  static getAllBasket = async (req) => {
    const { userId } = req.user;
    const found = await Basket.find({ userId })
      .select("-createdAt -updatedAt -__v")
      .lean();
    return found;
  };

  static createNewIngredientsForBasket = async (req) => {
    const { userId } = req.user;
    const { basketId, ingredients } = req.body;
    try {
      const newIngredient = await Basket.findOneAndUpdate(
        {
          _id: basketId,
          userId,
        },
        {
          $push: {
            ingredients,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .select("-createdAt -updatedAt -__v")
        .lean();
      if (!newIngredient) throw new ApiError("Giỏ hàng không tồn tại", 404);
      return newIngredient;
    } catch (err) {
      switch (err.name) {
        case "ValidationError":
          throw new ApiError(err.message, 400);
        case "CastError":
          throw new ApiError(err.message, 400);
        case "MongoError":
          throw new ApiError("Lỗi cơ sở dữ liệu", 500);
        default:
          throw err;
      }
    }
  };

  static updateIngredientsInBasket = async (req) => {
    const { userId } = req.user;
    const { basketId, ingredients } = req.body;

    const updateObject = {};

    // Tạo đối tượng cập nhật cho từng thành phần
    ingredients.forEach((ingredient, index) => {
      updateObject[`ingredients.$[elem${index}].name`] = ingredient.name;
      updateObject[`ingredients.$[elem${index}].quantity`] =
        ingredient.quantity;
      updateObject[`ingredients.$[elem${index}].unit`] = ingredient.unit;
      updateObject[`ingredients.$[elem${index}].category`] =
        ingredient.category;
      updateObject[`ingredients.$[elem${index}].status`] = ingredient.status;
    });

    try {
      const updatedBasket = await Basket.findOneAndUpdate(
        { _id: basketId, userId }, // Điều kiện tìm kiếm basket theo basketId và userId
        {
          $set: updateObject,
        },
        {
          new: true,
          arrayFilters: ingredients.map((ingredient, index) => ({
            [`elem${index}._id`]: ingredient._id,
          })), // Lọc phần tử cần cập nhật theo _id
          runValidators: true, // Đảm bảo các validator của schema vẫn được kiểm tra
        }
      )
        .select("-createdAt -updatedAt -__v")
        .lean();
      if (!updatedBasket) throw new ApiError("Giỏ hàng không tồn tại", 404);
      return updatedBasket;
    } catch (err) {
      switch (err.name) {
        case "ValidationError":
          throw new ApiError(err.message, 400);
        case "CastError":
          throw new ApiError(err.message, 400);
        case "MongoError":
          throw new ApiError("Lỗi cơ sở dữ liệu", 500);
        default:
          throw err;
      }
    }
  };

  static deleteIngredientsInBasket = async (req) => {
    const { userId } = req.user;
    const { basketId, ingredientIds } = req.body;

    const updatedBasket = await Basket.findOneAndUpdate(
      { _id: basketId, userId }, // Điều kiện tìm kiếm
      {
        $pull: {
          // Sử dụng $pull để xóa các ingredients
          ingredients: {
            _id: { $in: ingredientIds }, // Xóa các ingredient có _id trong danh sách
          },
        },
      },
      { new: true, runValidators: true } // Trả về giỏ hàng đã cập nhật và kiểm tra các validator
    );
    if (!updatedBasket) throw new ApiError("Giỏ hàng không tồn tại", 404);
    return updatedBasket;
  };
}

module.exports = BasketService;

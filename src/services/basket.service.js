"use strict";

const Basket = require("../models/baskets.model");
const ApiError = require("../core/ApiError");

class BasketService {
  static createBasket = async (req) => {
    const { name, description } = req.body;
    const { userId } = req.user;
    const newBasket = new Basket({ userId, name, description });
    await newBasket.save();
    return newBasket;
  };

  static updateBasket = async (req) => {
    const basketId = req.params.basketId;
    const { name, description } = req.body;
    const { userId } = req.user;

    const updateBasket = await Basket.findByIdAndUpdate(
      { _id: basketId, userId },
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updateBasket) throw new ApiError("Khong tim thay gio hang", 404);
    return updateBasket;
  };

  static deleteBasket = async (req) => {
    const basketId = req.params.basketId;
    const { userId } = req.user;

    const foundAndDelete = await Basket.findOneAndDelete({
      _id: basketId,
      userId,
    });
    if (!foundAndDelete) throw new ApiError("Khong tim thay gio hang", 404);

    return foundAndDelete;
  };

  static getBasketByBasketId = async (req) => {
    const basketId = req.params.basketId;
    const { userId } = req.user;

    const found = await Basket.findOne({ _id: basketId, userId });
    if (!found) throw new ApiError("Khong tim thay gio hang", 404);
    return found;
  };

  static getAllBasket = async (req) => {
    const { userId } = req.user;
    const found = await Basket.find({ userId });
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
      );
      if (!newIngredient)
        throw new ApiError(
          "Giỏ hàng không tồn tại hoặc bạn không có quyền truy cập.",
          404
        );
      return newIngredient;
    } catch (err) {
      switch (err.name) {
        case "ValidationError":
          throw new ApiError("Dữ liệu không hợp lệ", 400);
        case "CastError":
          throw new ApiError("Định dạng basketId không hợp lệ", 400);
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
    );
    if (!updatedBasket)
      throw new ApiError(
        "Giỏ hàng không tồn tại hoặc bạn không có quyền cập nhật",
        404
      );
    return updatedBasket;
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

    return updatedBasket;
  };
}

module.exports = BasketService;

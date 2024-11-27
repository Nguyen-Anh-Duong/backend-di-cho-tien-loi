"use strict";

const Basket = require("../models/baskets.model");
const ApiError = require("../core/ApiError");
const { update } = require("lodash");

class BasketService {
  static createBasket = async (req) => {
    const { name, description, ingredients, totalMoney } = req.body;
    const { userId } = req.user;
    const newBasket = new Basket({
      userId,
      name,
      description,
      ingredients,
      totalMoney,
    });
    await newBasket.save();

    const response = newBasket.toObject();
    response.basketId = response._id;
    delete response._id;
    delete response.createdAt;
    delete response.updatedAt;
    delete response.__v;
    return response;
  };

  static updateBasket = async (req) => {
    const basketId = req.params.basketId;
    const { name, description, totalMoney } = req.body;
    const { userId } = req.user;

    const updateBasket = await Basket.findOneAndUpdate(
      { _id: basketId, userId },
      { name, description, totalMoney },
      { new: true, runValidators: true }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!updateBasket) throw new ApiError("Khong tim thay gio hang", 404);
    updateBasket.basketId = updateBasket._id;
    delete updateBasket._id;

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
  };

  static getBasketByBasketId = async (req) => {
    const basketId = req.params.basketId;
    const { userId } = req.user;

    const found = await Basket.findOne({ _id: basketId, userId })
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!found) throw new ApiError("Khong tim thay gio hang", 404);
    found.basketId = found._id;
    delete found._id;
    return found;
  };

  static getPersonalBaskets = async (req) => {
    const { userId } = req.user;
    const baskets = await Basket.find({ userId })
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (Array.isArray(baskets)) {
      for (let basket of baskets) {
        basket.basketId = basket._id;
        delete basket._id;
      }
    }
    return baskets;
  };

  static addIngredients = async (req) => {
    const { userId } = req.user;
    const { basketId, newIngredients } = req.body;
    try {
      const basket = await Basket.findOneAndUpdate(
        {
          _id: basketId,
          userId,
        },
        {
          $push: {
            ingredients: newIngredients,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .select("-createdAt -updatedAt -__v")
        .lean();
      if (!basket) throw new ApiError("Giỏ hàng không tồn tại", 404);

      basket.basketId = basket._id;
      delete basket._id;

      const { ingredients } = basket;
      for (let ingredient of ingredients) {
        ingredient.ingredientId = ingredient._id;
        delete ingredient._id;
      }
      return basket;
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

  static updateIngredients = async (req) => {
    const { userId } = req.user;
    const { basketId, ingredients } = req.body;

    const updateObject = {};

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
        { _id: basketId, userId },
        {
          $set: updateObject,
        },
        {
          new: true,
          arrayFilters: ingredients.map((ingredient, index) => ({
            [`elem${index}._id`]: ingredient._id,
          })),
          runValidators: true,
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

  static deleteIngredients = async (req) => {
    const { userId } = req.user;
    const { basketId, ingredients } = req.body;

    const updatedBasket = await Basket.findOneAndUpdate(
      { _id: basketId, userId },
      {
        $pull: {
          ingredients: {
            _id: { $in: ingredients },
          },
        },
      },
      { new: true, runValidators: true }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!updatedBasket) throw new ApiError("Giỏ hàng không tồn tại", 404);
    return updatedBasket;
  };
}

module.exports = BasketService;

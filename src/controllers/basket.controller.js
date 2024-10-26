"use strict";

const { SuccessResponse } = require("../core/success.response");
const BasketService = require("../services/basket.service");

class BasketController {
  static createBasket = async (req, res, next) => {
    return new SuccessResponse({
      message: "Tao gio hang thanh cong",
      statusCode: 200,
      metadata: await BasketService.createBasket(req),
    }).send(res);
  };

  static updateBasket = async (req, res, next) => {
    return new SuccessResponse({
      message: "Cap nhat gio hang thanh cong",
      statusCode: 200,
      metadata: await BasketService.updateBasket(req),
    }).send(res);
  };

  static deleteBasket = async (req, res, next) => {
    return new SuccessResponse({
      message: "Xoa gio hang thanh cong",
      statusCode: 200,
      metadata: await BasketService.deleteBasket(req),
    }).send(res);
  };

  static getBasketByBasketId = async (req, res, next) => {
    return new SuccessResponse({
      message: "Lay gio hang thanh cong",
      statusCode: 200,
      metadata: await BasketService.getBasketByBasketId(req),
    }).send(res);
  };

  static getAllBasket = async (req, res, next) => {
    return new SuccessResponse({
      message: "Ok",
      statusCode: 200,
      metadata: await BasketService.getAllBasket(req),
    }).send(res);
  };

  static createNewIngredients = async (req, res, next) => {
    return new SuccessResponse({
      message: "Them ingredient thanh cong",
      statusCode: 200,
      metadata: await BasketService.createNewIngredientsForBasket(req),
    }).send(res);
  };

  static updateIngredientsInBasket = async (req, res, next) => {
    return new SuccessResponse({
      message: "Cap nhat ingredient cho gio hang thanh cong",
      statusCode: 200,
      metadata: await BasketService.updateIngredientsInBasket(req),
    }).send(res);
  };

  static deleteIngredientsInBasket = async (req, res, next) => {
    return new SuccessResponse({
      message: "Xoa ingredients thanh cong",
      statusCode: 200,
      metadata: await BasketService.deleteIngredientsInBasket(req),
    }).send(res);
  };
}

module.exports = BasketController;

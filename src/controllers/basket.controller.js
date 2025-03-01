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

  static getPersonalBaskets = async (req, res, next) => {
    return new SuccessResponse({
      message: "Ok",
      statusCode: 200,
      metadata: await BasketService.getPersonalBaskets(req),
    }).send(res);
  };

  static addIngredients = async (req, res, next) => {
    return new SuccessResponse({
      message: "Them ingredient thanh cong",
      statusCode: 200,
      metadata: await BasketService.addIngredients(req),
    }).send(res);
  };

  static updateIngredients = async (req, res, next) => {
    return new SuccessResponse({
      message: "Cap nhat ingredient cho gio hang thanh cong",
      statusCode: 200,
      metadata: await BasketService.updateIngredients(req),
    }).send(res);
  };

  static deleteIngredients = async (req, res, next) => {
    return new SuccessResponse({
      message: "Xoa ingredients thanh cong",
      statusCode: 200,
      metadata: await BasketService.deleteIngredients(req),
    }).send(res);
  };
}

module.exports = BasketController;

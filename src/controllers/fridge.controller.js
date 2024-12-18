const { SuccessResponse } = require("../core/success.response");
const FridgeService = require("../services/fridge.service");

class FridgeController {
  static createNewFridgeItem = async (req, res, next) => {
    const {
      name,
      quantity,
      unit,
      category,
      isConsumed,
      consumedDate,
      storageLocation,
      addedDate,
      expiryDate,
    } = req.body;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Them thuc pham vao tu lanh thanh cong",
      statusCode: 200,
      metadata: await FridgeService.createNewFridgeItem({
        userId,
        name,
        quantity,
        unit,
        category,
        isConsumed,
        consumedDate,
        storageLocation,
        addedDate,
        expiryDate,
      }),
    }).send(res);
  };

  static updateFridgeItemById = async (req, res, next) => {
    const { fridgeId } = req.params;
    const { userId } = req.user;
    const {
      name,
      quantity,
      unit,
      category,
      isConsumed,
      consumedDate,
      storageLocation,
      addedDate,
      expiryDate,
    } = req.body;
    return new SuccessResponse({
      message: "Cap nhat thuc pham trong tu lanh thanh cong",
      statusCode: 200,
      metadata: await FridgeService.updateFridgeItemById({
        fridgeId,
        userId,
        name,
        quantity,
        unit,
        category,
        isConsumed,
        consumedDate,
        storageLocation,
        addedDate,
        expiryDate,
      }),
    }).send(res);
  };

  static deleteFridgeItemById = async (req, res, next) => {
    const { fridgeId } = req.params;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Xoa thuc pham trong tu lanh thanh cong",
      statusCode: 200,
      metadata: await FridgeService.deleteFridgeItemById({
        fridgeId,
        userId,
      }),
    }).send(res);
  };

  static getFridgeItemById = async (req, res, next) => {
    const { fridgeId } = req.params;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Lay thuc pham trong tu lanh thanh cong",
      statusCode: 200,
      metadata: await FridgeService.getFridgeItemById({
        fridgeId,
        userId,
      }),
    }).send(res);
  };

  static getFridgeItems = async (req, res, next) => {
    const { userId } = req.user;
    const { category, isConsumed, storageLocation, sortBy } = req.query;
    return new SuccessResponse({
      message: "Lay thuc pham trong tu lanh thanh cong",
      statusCode: 200,
      metadata: await FridgeService.getFridgeItems({
        userId,
        category,
        isConsumed,
        storageLocation,
        sortBy,
      }),
    }).send(res);
  };
}

module.exports = FridgeController;

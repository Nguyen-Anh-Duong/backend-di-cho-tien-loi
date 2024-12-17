const { SuccessResponse } = require("../core/success.response");
const FridgeService = require("../services/fridge.service");

class FridgeController {
  static createNewFridge = async (req, res, next) => {
    const {
      name,
      quantity,
      unit,
      category,
      isConsumed,
      consumedDate,
      storageLocation,
      addedDate,
    } = req.body;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Tao tu lanh thanh cong",
      statusCode: 200,
      metadata: await FridgeService.createNewFridge({
        userId,
        name,
        quantity,
        unit,
        category,
        isConsumed,
        consumedDate,
        storageLocation,
        addedDate,
      }),
    }).send(res);
  };
}

module.exports = FridgeController;

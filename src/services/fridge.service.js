const Fridge = require("../models/fridge.model");
const ApiError = require("../core/ApiError");

class FridgeService {
  static createNewFridge = async ({
    userId,
    name,
    quantity,
    unit,
    category,
    isConsumed,
    consumedDate,
    storageLocation,
    addedDate,
  }) => {
    console.log(new Date().toString());
    const newFridge = new Fridge({
      userId,
      name,
      quantity,
      unit,
      category,
      isConsumed,
      consumedDate,
      storageLocation,
      addedDate,
    });
    await newFridge.save();

    const response = newFridge.toObject();
    response.fridgeId = response._id;
    delete response._id;
    delete response.createdAt;
    delete response.updatedAt;
    delete response.__v;
    return response;
  };

  static get;
}

module.exports = FridgeService;

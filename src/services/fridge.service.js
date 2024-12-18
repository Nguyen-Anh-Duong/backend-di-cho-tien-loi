const Fridge = require("../models/fridge.model");
const ApiError = require("../core/ApiError");

class FridgeService {
  static createNewFridgeItem = async ({
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
  }) => {
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
      expiryDate,
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

  static updateFridgeItemById = async ({
    fridgeId,
    userId,
    quantity,
    name,
    unit,
    category,
    isConsumed,
    consumedDate,
    storageLocation,
    addedDate,
    expiryDate,
  }) => {
    const fridgeItem = await Fridge.findOneAndUpdate(
      {
        _id: fridgeId,
        userId,
      },
      {
        quantity,
        name,
        unit,
        category,
        isConsumed,
        consumedDate,
        storageLocation,
        addedDate,
        expiryDate,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!fridgeItem) throw new ApiError("Thuc pham khong ton tai.", 404);
    fridgeItem.fridgeId = fridgeItem._id;
    delete fridgeItem._id;
    return fridgeItem;
  };

  static deleteFridgeItemById = async ({ fridgeId, userId }) => {
    const fridgeItem = await Fridge.findOneAndDelete({
      _id: fridgeId,
      userId,
    });

    if (!fridgeItem) throw new ApiError("Thuc pham khong ton tai.", 404);
  };

  static getFridgeItemById = async ({ fridgeId, userId }) => {
    const fridgeItem = await Fridge.findOne({ _id: fridgeId, userId })
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!fridgeItem) throw new ApiError("Thuc pham khong ton tai.", 404);
    fridgeItem.fridgeId = fridgeItem._id;
    delete fridgeItem._id;
    return fridgeItem;
  };

  static getFridgeItems = async ({
    userId,
    category,
    isConsumed,
    storageLocation,
    sortBy,
  }) => {
    const filter = {};
    filter.userId = userId;
    if (category) filter.category = category; // Lọc theo nhóm thực phẩm
    if (storageLocation) filter.storageLocation = storageLocation; // Lọc theo vị trí để thức ăn
    if (isConsumed !== undefined) filter.isConsumed = isConsumed === "true"; // Lọc theo trạng thái sử dụng
    // filter.expiryDate = { $gt: 0 };
    // filter.consumedDate = { $gt: 0 };

    // Định nghĩa sắp xếp
    const sortOptions = {};
    if (sortBy) {
      const validSortFields = ["expiryDate", "addedDate", "consumedDate"];
      if (validSortFields.includes(sortBy)) {
        sortOptions[sortBy] = 1; // Sắp xếp tăng dần (1)
      } else {
        throw new ApiError("Invalid sortBy field", 400);
      }
    }

    // Truy vấn MongoDB
    const items = await Fridge.find(filter)
      .sort(sortOptions)
      .select("-createdAt -updatedAt -__v")
      .lean();

    // Trả về kết quả
    if (!items) throw new ApiError("Thuc pham khong ton tai.", 404);
    const transformedItems = items.map((item) => ({
      ...item,
      fridgeId: item._id,
      _id: undefined,
    }));
    return transformedItems;
  };
}

module.exports = FridgeService;

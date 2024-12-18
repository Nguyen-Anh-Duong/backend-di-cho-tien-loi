const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const FridgeController = require("../../controllers/fridge.controller");
const Fridge = require("../../models/fridge.model");

const router = express.Router();

router.use(authentication);

//get an fridge by id
router.get(
  "/items/:fridgeId",
  asyncHandler(FridgeController.getFridgeItemById)
);

router.get("/items", asyncHandler(FridgeController.getFridgeItems));

//create an fridge
router.post("/items", asyncHandler(FridgeController.createNewFridgeItem));

router.put(
  "/items/:fridgeId",
  asyncHandler(FridgeController.updateFridgeItemById)
);

router.delete(
  "/items/:fridgeId",
  asyncHandler(FridgeController.deleteFridgeItemById)
);

module.exports = router;

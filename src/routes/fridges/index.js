const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const FridgeController = require("../../controllers/fridge.controller");
const Fridge = require("../../models/fridge.model");

const router = express.Router();

router.use(authentication);

//get an fridge by id
router.get("/:id", (req, res) => {
  res.send("hello");
});

//create an fridge
router.post("/", asyncHandler(FridgeController.createNewFridge));

router.patch("/", (req, res) => {});

router.delete("/", (req, res) => {});

module.exports = router;

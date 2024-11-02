"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const User = require("../../models/user.model");
const Basket = require("../../models/baskets.model");
const BasketController = require("../../controllers/basket.controller");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();

router.use(authentication);

router.post("/ingredients", asyncHandler(BasketController.addIngredients));
router.patch("/ingredients", asyncHandler(BasketController.updateIngredients));
router.delete("/ingredients", asyncHandler(BasketController.deleteIngredients));

router.post("/", asyncHandler(BasketController.createBasket));
router.patch("/:basketId", asyncHandler(BasketController.updateBasket));
router.delete("/:basketId", asyncHandler(BasketController.deleteBasket));
router.get("/", asyncHandler(BasketController.getPersonalBaskets));
router.get("/:basketId", asyncHandler(BasketController.getBasketByBasketId));

module.exports = router;

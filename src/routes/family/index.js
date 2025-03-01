const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const FamilyController = require("../../controllers/family.controller");

const router = express.Router();

router.use(authentication);

// router quan li thanh vien
router.post("/join", asyncHandler(FamilyController.joinFamily));
router.post("/leave/:familyId", asyncHandler(FamilyController.leaveFamily));

router.delete(
  "/:familyId/members",
  asyncHandler(FamilyController.deleteMembers)
);

router.post("/:familyId/assign-task/:userId/:listId", asyncHandler(FamilyController.assignTask))

//router crud nhom
router.get("/:familyId", asyncHandler(FamilyController.getFamilyInformation));
//router.get("/", asyncHandler(FamilyController.getAllFamiliesJoined));

router.post("/", asyncHandler(FamilyController.createNewFamily));

router.patch(
  "/:familyId",
  asyncHandler(FamilyController.updateFamilyInformation)
);
router.delete("/:familyId", asyncHandler(FamilyController.deleteFamily));

//router shopping list
router.post(
  "/:familyId/shopping-lists",
  asyncHandler(FamilyController.createNewShoppingList)
);

router.patch(
  "/:familyId/shopping-lists/:listId",
  asyncHandler(FamilyController.updateShoppingListById)
);

router.delete(
  "/:familyId/shopping-lists/:listId",
  asyncHandler(FamilyController.deleteShoppingList)
);
router.get(
  "/:familyId/shopping-lists",
  asyncHandler(FamilyController.getShoppingListsInFamily)
);

module.exports = router;

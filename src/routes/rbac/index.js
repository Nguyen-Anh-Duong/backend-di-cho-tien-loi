"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/checkAuth");
const rbacController = require("../../controllers/rbac.controller");
const router = express.Router();

router.post("/roles", asyncHandler(rbacController.newRole));
router.post("/resource", asyncHandler(rbacController.newResource));
router.get("/roles", asyncHandler(rbacController.getRoles));
router.get("/resources", asyncHandler(rbacController.getResources));

module.exports = router;

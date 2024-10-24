"use strict";

const express = require("express");
const { apiKey } = require("../auth/checkAuth");
const { route } = require("./access");
const router = express.Router();

router.use("/v1/api", require("./access"));

//check apikey
// router.use(apiKey);

router.use("/v1/api/ingredients", require("./ingredients"));
router.use("/v1/api/recipe", require("./recipes"));
router.use("/v1/api/otp", require("./otp"));
router.use("/v1/api/rbac", require("./rbac"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/baskets", require("./baskets"));

module.exports = router;

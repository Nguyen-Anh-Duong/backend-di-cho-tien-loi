"use strict";

const express = require("express");
const { apiKey } = require("../auth/checkAuth");
const router = express.Router();
//check apikey
router.use(apiKey);

//
router.use("/v1/api/otp", require("./otp"));
router.use("/v1/api", require("./access"));
router.use('/v1/api/rbac', require('./rbac'))
router.use("/v1/api/user", require("./user"));
module.exports = router;

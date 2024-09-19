"use strict";
const crypto = require("crypto");
const apikeyModel = require("../models/apikey.model.js");
class ApiKeyService {
  static async createApiKey() {
    await apikeyModel.create({ key: crypto.randomBytes(64).toString("hex") });
  }
}

module.exports = ApiKeyService;

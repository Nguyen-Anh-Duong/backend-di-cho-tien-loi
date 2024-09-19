"use strict";

const AccessService = require("../services/access.service");
const { SuccessResponse } = require("../core/success.response");

class AccessController {
  signUp = async (req, res, next) => {
    new SuccessResponse({
      message: "create user success!!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  logIn = async (req, res, next) => {
    new SuccessResponse({
      message: "signIn user success!!",
      metadata: await AccessService.logIn(req.body),
    }).send(res);
  };
  logOut = async (req, res, next) => {
    new SuccessResponse({
      message: "logout success!!",
      metadata: await AccessService.logOut(req.keyStore),
    }).send(res);
  }
}
module.exports = new AccessController();

"use strict";

const AccessService = require("../services/access.service");
const { SuccessResponse } = require("../core/success.response");

class AccessController {
  preSignUp = async (req, res, next) => {
    new SuccessResponse({
      message: "create user success!!",
      metadata: await AccessService.preSignUp(req.body),
    }).send(res);
  };
  verifyOTPAndSignUp = async (req, res, next) => {
    new SuccessResponse({
      message: "verify OTP and signUp success!!",
      metadata: await AccessService.verifyOTPAndSignUp(req.body),
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

"use strict";

const AccessService = require("../services/access.service");
const { SuccessResponse } = require("../core/success.response");
const { googleLogin } = require("../services/google.service");

class AccessController {
  googleLogin = async (req, res, next) => {
    new SuccessResponse({
      message: "google login success!!",
      metadata: await googleLogin(req.body.token),
    }).send(res);
  };
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
    console.log(req.body);
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
  };
  refreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "refresh token success!!",
      metadata: await AccessService.refreshToken(req.body),
    }).send(res);
  };
  requestResetPassword = async (req, res, next) => {
    new SuccessResponse({
      message: "request reset password success!!",
      metadata: await AccessService.requestResetPassword(req.body),
    }).send(res);
  };
  changePassword = async (req, res, next) => {
    new SuccessResponse({
      message: "change password success!!",
      metadata: await AccessService.changePassword({
        ...req.user,
        ...req.body,
      }),
    }).send(res);
  };
  resetPassword = async (req, res, next) => {
    const { email, otp } = req.body;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    new SuccessResponse({
      message: "reset password success!!",
      metadata: await AccessService.resetPassword({ email, password, otp }),
    }).send(res);
  };
  checkOTPResetPassword = async (req, res, next) => {
    new SuccessResponse({
      message: "check OTP reset password success!!",
      metadata: await AccessService.checkOTPResetPassword(req.body),
    }).send(res);
  };

  resendOTP = async (req, res, next) => {
    const { email, name } = req.body;
    new SuccessResponse({
      message: "check OTP reset password success!!",
      metadata: await AccessService.resendOTP({ email, name }),
    }).send(res);
  };
}
module.exports = new AccessController();

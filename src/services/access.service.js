"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const ApiKeyService = require("./apiKey.service");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { getInfoData } = require("../utils");
const OTPService = require("./otp.service");
const { sendOTP, sendEmail, sendWelcome } = require("./email.service");
class AccessService {
  static async verifyOTPAndSignUp({ email, password, name, otp }) {
    const isOTPValid = await OTPService.verifyOTP(email, otp);
    if (!isOTPValid) throw new BadRequestError("Invalid OTP");

    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (foundUser) throw new BadRequestError("Da ton tai user");
    await ApiKeyService.createApiKey();
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      user_email: email,
      user_password: passwordHash,
      user_name: name,
    });
    if (newUser) {
      sendWelcome({ email: newUser.user_email, name: newUser.user_name }).catch(
        (err) => console.log(err)
      );
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey });

      //luu vao db
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        privateKey,
        publicKey,
      });
      console.log(keyStore);

      const payload = {
        userId: newUser._id,
        email: newUser.user_email,
      };
      const tokens = await KeyTokenService.createTokenPair({
        payload,
        privateKey: keyStore.privateKey,
        publicKey: keyStore.publicKey,
      });
      if (!tokens) throw new BadRequestError("create token pair failed");
      return {
        user: getInfoData({
          object: newUser,
          fields: ["_id", "user_email", "user_name"],
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  }

  static async logIn({ email, password }) {
    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (!foundUser) throw new NotFoundError("User not found");

    const passwordHash = foundUser.user_password;
    const match = await bcrypt.compare(password, passwordHash);
    if (!match) throw new BadRequestError("Invalid password");

    const keyStore = await KeyTokenService.findByUserId(foundUser._id);
    if (!keyStore) throw new NotFoundError("Not found keyStore");
    const { privateKey, publicKey } = keyStore;
    //lay refreshToken
    const tokens = await KeyTokenService.createTokenPair({
      payload: {
        userId: foundUser._id,
        email: foundUser.user_email,
      },
      privateKey,
      publicKey,
    });
    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      user: getInfoData({
        object: foundUser,
        fields: ["_id", "user_email", "user_name"],
      }),
      tokens,
    };
  }

  static async logOut(keyStore) {
    console.log(`keyStore: ${keyStore}`);
    const delKey = await KeyTokenService.removeRefreshTokenById({
      id: keyStore._id,
      refreshToken: keyStore.refreshToken,
    });
    return {
      code: 200,
      metadata: getInfoData({
        object: delKey,
        fields: ["_id", "refreshToken", "refreshTokensUsed"],
      }),
    };
  }

  static async preSignUp({ email, password, name }) {
    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (foundUser) throw new BadRequestError("User already exists");

    const otp = await OTPService.generateOTP(email);
    console.log(otp);
    //test tang hieu suat khong awaiting coi sao
    await sendOTP({ email, name, otp }).catch((err) => {
      console.log(err);
    });

    return { message: "OTP sent to email for verification", otp };
  }
}

module.exports = AccessService;

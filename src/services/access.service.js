"use strict";
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../core/error.response");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const ApiKeyService = require("./apikey.service");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { getInfoData } = require("../utils");
const OTPService = require("./otp.service");
const {
  sendOTP,
  sendEmail,
  sendWelcome,
  sendOTPResetPassword,
} = require("./email.service");
const roleSchema = require("../models/role.schema");
const keytokenModel = require("../models/keytoken.model");
class AccessService {
  static async verifyOTPAndSignUp({ email, password, name, otp }) {
    const isOTPValid = await OTPService.verifyOTP(email, otp);
    if (!isOTPValid) throw new BadRequestError("Invalid OTP");

    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (foundUser) throw new BadRequestError("Da ton tai user");
    await ApiKeyService.createApiKey();
    const defaultRole = await roleSchema.findOne({ rol_name: "user" }).lean();
    if (!defaultRole) {
      const newRole = await roleSchema.create({
        rol_name: "user" /*, other fields */,
        rol_slug: "hhehe",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      user_email: email,
      user_password: passwordHash,
      user_name: name,
      user_role_system: defaultRole._id,
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

      //console.log({ privateKey, publicKey });

      //luu vao db
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        privateKey,
        publicKey,
      });

      const payload = {
        userId: newUser._id,
        email: newUser.user_email,
        roleId: defaultRole._id,
      };
      const tokens = await KeyTokenService.createTokenPair({
        payload,
        privateKey: keyStore.privateKey,
        publicKey: keyStore.publicKey,
      });
      if (!tokens) throw new BadRequestError("create token pair failed");
      await keytokenModel.findOneAndUpdate(
        { userId: newUser._id },
        { refreshToken: tokens.refreshToken }
      );
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
        fields: [
          "_id",
          "user_email",
          "user_name",
          "user_role_system",
          "user_role_group",
          "user_family_group",
        ],
      }),
      tokens,
    };
  }

  static async logOut(keyStore) {
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
  static async resendOTP({ email, name = "Bạn" }) {
    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (foundUser) throw new BadRequestError("User already exists");

    const otp = await OTPService.generateOTP(email);
    console.log(otp);
    await sendOTP({ email, name, otp }).catch((err) => {
      console.log(err);
    });

    return { message: "OTP sent to email for verification", otp };
  }
  static async refreshToken({ refreshToken }) {
    const keyStore = await keytokenModel.findOne({
      refreshToken: refreshToken,
    });
    if (!keyStore) throw new NotFoundError("Not found keyStore");

    //check refreshToken het han hay chua
    const decoded = jwt.verify(refreshToken, keyStore.publicKey);
    if (!decoded) throw new BadRequestError("Invalid refresh token");
    if (decoded.exp < Date.now() / 1000)
      throw new BadRequestError("Refresh token expired");

    const { privateKey, publicKey } = keyStore;
    const payload = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
    };

    const tokens = await KeyTokenService.createTokenPair({
      payload,
      privateKey,
      publicKey,
    });
    return {
      user: getInfoData({
        object: decoded,
        fields: ["userId", "email", "roleId"],
      }),
      tokens,
    };
  }
  static async requestResetPassword({ email }) {
    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (!foundUser) throw new NotFoundError("User not found");
    const otp = await OTPService.generateOTP(email);
    await sendOTPResetPassword({ email, name: foundUser.user_name, otp });
    console.log(otp);
    //TODO: sau cmt otp lai
    return {
      toUserEmail: email,
      // otp
    };
  }
  static async resetPassword({ email, password, otp }) {
    const isValidOTP = await OTPService.verifyOTP(email, otp);
    if (!isValidOTP) throw new ForbiddenError("Invalid OTP");

    const foundUser = await userModel.findOne({ user_email: email }).lean();
    if (!foundUser) throw new NotFoundError("User not found");

    const passwordHash = await bcrypt.hash(password, 10);
    await userModel.findByIdAndUpdate(foundUser._id, {
      user_password: passwordHash,
    });
    await sendOTPResetPassword({
      email,
      name: foundUser.user_name,
      otp: password,
    });

    return { message: "Reset password success" };
  }
  static async changePassword({ email, oldPassword, newPassword, userId }) {
    console.log(`duy ${userId}`);
    if (!oldPassword || !newPassword)
      throw new BadRequestError("Old password and new password are required");
    const foundUser = await userModel.findById(userId).lean();
    if (!foundUser) throw new NotFoundError("User not found");

    const passwordHash = foundUser.user_password;
    const match = await bcrypt.compare(oldPassword, passwordHash);
    if (!match) throw new BadRequestError("Invalid old password");
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(foundUser._id, {
      user_password: newPasswordHash,
    });
    return {
      email: foundUser.user_email,
      name: foundUser.user_name,
      newPassword: newPassword,
    };
  }
}

module.exports = AccessService;

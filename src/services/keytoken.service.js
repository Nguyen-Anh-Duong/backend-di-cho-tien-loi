"use strict";
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };
  static removeRefreshTokenById = async ({id, refreshToken}) => {
    const filter = {_id: id};
    const updateSet = {
      $set: {
        refreshToken: null,
      },
    };
    if(refreshToken) {
      updateSet.$push = {
        refreshTokensUsed: refreshToken,
      }
    }
    const options = {new: true};
    return await keytokenModel.findByIdAndUpdate(filter, updateSet, options);
  }
  static removeKeyById = async (id) => {
    return await keytokenModel.findByIdAndDelete(id);
  };
  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ userId: userId });
  };
  /**
   * 
   * @param {*} param0 
   * @returns 
   * @description create or update in database
   */
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken = null,
  }) => {
    try {
      const filter = { userId: userId };
      const updateSet = {
        publicKey: publicKey,
        privateKey: privateKey,
        refreshTokenUsed: [],
        refreshToken: refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        updateSet,
        options
      );

      return tokens;
    } catch (error) {
      return error;
    }
  };
  static createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
      const accessToken = JWT.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "2d",
      });
      const refreshToken = JWT.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "60d",
      });
      console.log({ accessToken, refreshToken });
      //check
      JWT.verify(
        accessToken,
        publicKey,
        { algorithm: ["RS256"] },
        (err, decode) => {
          if (err) {
            console.error(`error verify:: `, err);
          } else {
            console.log(`decode verify:: `, decode);
          }
        }
      );
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(`create token pair error:: ${error}`);
      return null;
    }
  };

  static verifyToken = async ({ token, publicKey }) => {
    try {
      return JWT.verify(token, publicKey, { algorithm: ["RS256"] });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = KeyTokenService;

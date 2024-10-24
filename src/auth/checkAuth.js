"use strict";
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../core/error.response");
const apikeyModel = require("../models/apikey.model");
const KeyTokenService = require("../services/keytoken.service");
const JWT = require("jsonwebtoken");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "x-rtoken-id",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    console.log(key);
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error 1",
      });
    }

    //check in db
    const objKey = await apikeyModel.findOne({ key: key }).lean();

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error 2",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const authentication = async (req, res, next) => {
  try {
    const userId = req.headers[HEADER?.CLIENT_ID];
    if (!userId) throw new ForbiddenError("Invalid Request");

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new ForbiddenError("Not found keyStore");

    //check refreshToken
    if (req.headers[HEADER.REFRESHTOKEN]) {
      try {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN];
        const decodeUser = await JWT.verify(refreshToken, keyStore.publicKey);
        //coi dung user k
        if (userId !== decodeUser.userId)
          throw new ForbiddenError("Invalid User");
        req.keyStore = keyStore;
        req.user = decodeUser; //decodeUser: {userId, email, roleId}
        req.refreshToken = refreshToken;
        return next();
      } catch (error) {
        next(error);
      }
    }
    //check accessToken
    if (req.headers[HEADER.AUTHORIZATION]) {
      try {
        const accessToken = req.headers[HEADER.AUTHORIZATION];
        const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
          throw new ForbiddenError("Invalid User");
        req.keyStore = keyStore;
        req.user = decodeUser; //decodeUser: {userId, email, roleId}
        return next();
      } catch (error) {
        next(error);
      }
    }

    throw new ForbiddenError("No valid token found");
  } catch (error) {
    next(error);
  }
};

module.exports = { apiKey, authentication };

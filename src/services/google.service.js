const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require("../models/user.model");
const roleSchema = require("../models/role.schema");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const keytokenModel = require("../models/keytoken.model");
const { BadRequestError } = require("../core/error.response");

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

async function googleLogin(idToken) {
  const payload1 = await verifyGoogleToken(idToken);
  const defaultRole = await roleSchema.findOne({ rol_name: "user" }).lean();
  if (!defaultRole) {
    const newRole = await roleSchema.create({
      rol_name: "user" /*, other fields */,
      rol_slug: "hhehe",
    });
  }
  let user = await User.findOne({ googleId: payload1.sub });

  if (!user) {
    user = new User({
      user_name: payload1.name,
      user_email: payload1.email + "MOCK",
      user_email_gg: payload1.email,
      googleId: payload1.sub,
      googleAccessToken: idToken,
      user_password: "default_password",
    });
    await user.save();
  }
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
    userId: user._id,
    privateKey,
    publicKey,
  });

  const payload = {
    userId: user._id,
    email: user.user_email,
    roleId: defaultRole._id,
  };
  console.log(payload);
  console.log(keyStore);
  const tokens = await KeyTokenService.createTokenPair({
    payload,
    privateKey: keyStore.privateKey,
    publicKey: keyStore.publicKey,
  });
  if (!tokens) throw new BadRequestError("create token pair failed");
  await keytokenModel.findOneAndUpdate(
    { userId: user._id },
    { refreshToken: tokens.refreshToken }
  );
  user.user_email = payload1.email;
  //rebuild
  return {
    user: user,
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  };
}

module.exports = {
  googleLogin,
};

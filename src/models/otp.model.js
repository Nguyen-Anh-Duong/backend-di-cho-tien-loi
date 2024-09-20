const {mongoose, Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'OTP';
const COLLECTION_NAME = 'OTPS';

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 } // OTP expires after 5 minutes
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

module.exports = model(DOCUMENT_NAME, otpSchema);
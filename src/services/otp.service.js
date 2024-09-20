const otpModel = require("../models/otp.model");
const { BadRequestError } = require("../core/error.response");

class OTPService {
  static async generateOTP(email) {
    const otp = Math.floor( 100000+ Math.random() * 900000).toString();
    await otpModel.create({ email, otp });
    return otp;
  }

  static async verifyOTP(email, otp) {
    const otpRecord = await otpModel.findOne({ email, otp });
    if (!otpRecord) {
      throw new BadRequestError("Invalid OTP");
    }
    //ktra cho chac an
    if (otpRecord.createdAt < new Date(Date.now() - 2 * 60 * 1000)) {
      throw new BadRequestError("OTP has expired");
    }
    await otpModel.deleteOne({ email, otp });
    return true;
  }
}

module.exports = OTPService;
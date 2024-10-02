'use strict'
const { sendOTP } = require("../services/email.service");
const { SuccessResponse } = require("../core/success.response");
class OtpController {
    sendOTP = async (req, res, next) => {
        new SuccessResponse({
            message: "Send OTP success!!",
            metadata: await sendOTP(req.body)
        }).send(res);
    }
}

module.exports = new OtpController();


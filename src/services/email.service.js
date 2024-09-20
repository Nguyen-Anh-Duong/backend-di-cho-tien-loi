'use strict';

const nodemailer = require('nodemailer');
const {VERIFICATION_EMAIL_TEMPLATE, WELCOME_TEMPLATE} = require('../templates/index');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE ,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT , 
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async ({email, subject = "No Subject", text = "No Text", html = ''}) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html: html
        });
        return info;
    } catch (error) {
        console.log(error);
    }
}
const sendOTP = async ({email, name, otp}) => {
    const appName = process.env.APP_NAME
    const html = VERIFICATION_EMAIL_TEMPLATE
        .replace('{userName}', name)
        .replace('{verificationCode}', otp)
        .replace('{expirationTime}', 2)
        .replace('{appName}', appName);
    const subject = "Verify Your Email";
    return await sendEmail({email, subject, html});
}

const sendWelcome = async({email, name})=> {
    const appName = process.env.APP_NAME
    const html = WELCOME_TEMPLATE
        .replace('{userName}', name)
        .replace('{appName}', appName);
    const subject = 'Welcome to Di cho tien loi'
    return await sendEmail({email, subject, html})
}

module.exports = {
    sendEmail,
    sendOTP,
    sendWelcome
}
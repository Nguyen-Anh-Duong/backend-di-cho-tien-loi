'use strict'
const { SuccessResponse } = require('../core/success.response')
const  UserService = require('../services/user.service')

class UserController {
    viewAny = async (req, res, next) => {
        new SuccessResponse({
            message: "Get info user success",
            metadata: await UserService.findAllUsers()
        }).send(res)
    }
    updateRole = async (req, res, next) => {
        new SuccessResponse({
            message: "Get info user success",
            metadata: await UserService.updateRole(req.body)
        }).send(res)
    }
    updateProfile = async(req, res, next) => {
        new SuccessResponse({
            message: {
                en: "Update User Profile Success!",
                vi: "Cap nhat thong tin nguoi dung thanh cong!"
            },
            metadata: await UserService.updateProfileUser({...req.body, ...req.params})
        }).send(res)
    }
    blockUser = async(req, res, next) => {
        new SuccessResponse({
            message: {
                en: "Block User Success!",
                vi: "Chan nguoi dung thanh cong!"
            },
            metadata: await UserService.blockUser(req.params)
        }).send(res)
    }
    getUser = async(req, res, next) => {
        new SuccessResponse({
            message: "Get user success",
            metadata: await UserService.getUser({...req.user})
        }).send(res)
    }
    saveToken =  async (req, res, next) => {
        const { fcmToken } = req.body;
        const {userId} = req.user
        new SuccessResponse({
            message: {
                en: "Save Token OK!",
        
            },
            metadata: await UserService.saveToken({ userId, fcmToken } )
        }).send(res)
    }
    review = async (req, res, next) => {
        const { userId } = req.user;
        const { month, year } = req.params;
        new SuccessResponse({
            message: {
                en: `Review ${month}-$${year}}`,
            },
            metadata: await UserService.review({ userId, month, year } )
        }).send(res)
    }
}
module.exports = new UserController()
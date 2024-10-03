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
}
module.exports = new UserController()
'use strict'

const { resolveHostname } = require("nodemailer/lib/shared")
const { SuccessResponse } = require("../core/success.response")
const { createRole, getRoleList, newResource, getResources, roleList } = require("../services/rbac.service")

class RbacController {
    newRole = async(req, res, next) => {
        new SuccessResponse({
            message: "tao role thanh cong",
            metadata: await createRole(req.body)
        }).send(res)
    }
    newResource = async(req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
            message: "tao resource thanh cong",
            metadata: await newResource(req.body)
        }).send(res)
    }
    getRoles = async(req, res, next) => {
        new SuccessResponse({
            message: "get role thanh cong",
            metadata: await getRoleList({})
        }).send(res)
    }
    
    getResources = async(req, res, next) => {
        new SuccessResponse({
            message: "get resource thanh cong",
            metadata: await getResources()
        }).send(res)
    }

}

module.exports = new RbacController()
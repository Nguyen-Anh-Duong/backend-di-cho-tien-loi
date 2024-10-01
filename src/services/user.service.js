'use strict'

const { NotFoundError } = require("../core/error.response")
const userModel = require("../models/user.model")
const {convertToObjectId} = require('../utils')
class UserService {
    static findAllUsers = async () => {
        return await userModel.find()
    }
    static updateRole = async ({roleId, userId}) => {
        if(!roleId) {
            throw new NotFoundError("NOOOOOOOOOOO");
        }
        const query = {
            _id: userId
        }
        const updateSet = {
            $set: {
                user_role_system: convertToObjectId(roleId)
            }
        }
        const options = {
            new: true
        }
        const foundUser = await userModel.findByIdAndUpdate(query, updateSet, options);
        return foundUser
        
    }
}

module.exports = UserService

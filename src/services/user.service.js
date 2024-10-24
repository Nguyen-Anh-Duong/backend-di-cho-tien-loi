'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.response")
const userModel = require("../models/user.model")
const {convertToObjectId, getInfoData} = require('../utils')
class UserService {
    static getUser = async (userId) => {
        const user = await userModel.findById(userId);

        return getInfoData({object: user, fields: ["user_name", "user_email", "user_phone", "user_sex", "user_avatar"]})
    }
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
    static updateProfileUser = async ({userId, user_name, user_sex, user_phone, user_avatar }) => {
        const query = {_id: userId}
        let updateSet = {}
        if (user_name) updateSet.user_name = user_name;
        if (user_sex) updateSet.user_sex = user_sex;
        if (user_phone) updateSet.user_phone = user_phone;
        if (user_avatar) updateSet.user_avatar = user_avatar;
        const options = {new: true}
        const updateUser = await userModel.findOneAndUpdate(query, updateSet, options)
        if(!updateUser)
            throw new BadRequestError("Update khong thanh cong")
        return getInfoData({object: updateUser, fields: ["user_name", "user_email", "user_phone", "user_sex", "user_avatar", "user_role_system"]})
    }
    static blockUser = async ({userId}) => {
        const query = {_id: userId}
        let updateSet = {user_status: "block"}
        const options = {new: true}

        const blockUser = await userModel.findOneAndUpdate(query, updateSet, options)
        if(!blockUser) {
            throw new BadRequestError("Block khong thanh cong")
        }
        return getInfoData({object: blockUser, fields: ["user_name", "user_email", "user_status"]  })
    }
}

module.exports = UserService

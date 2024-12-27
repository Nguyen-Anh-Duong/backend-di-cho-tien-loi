'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.response");
const ShoppingList = require("../models/shoppinglist.model");
const userModel = require("../models/user.model")
const {convertToObjectId, getInfoData} = require('../utils')
class UserService {

    static async review({userId, month, year}) {
        const startDate = new Date(year, month - 1, 1); 
        const endDate = new Date(year, month, 1); 

        const shoppingLists = await ShoppingList.find({created_by: userId});
        
        // Tạo một đối tượng để lưu trữ số lượng của từng ingredient
        const ingredientMap = {};

        // Duyệt qua từng shopping list
        shoppingLists.forEach(list => {
            list.ingredients.forEach(ingredient => {
                // Nếu ingredient đã tồn tại trong ingredientMap, cộng dồn số lượng
                if (ingredientMap[ingredient.name]) {
                    ingredientMap[ingredient.name].quantity += ingredient.quantity;
                } else {
                    // Nếu chưa tồn tại, thêm mới vào ingredientMap
                    ingredientMap[ingredient.name] = {
                        name: ingredient.name,
                        quantity: ingredient.quantity,
                        category: ingredient.category,
                        unit: ingredient.unit,
                        status: ingredient.status
                    };
                }
            });
        });
        return ingredientMap;
    }
    static saveToken = async ({ userId, fcmToken } ) => {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).send("User not found.");
        user.fcmToken = fcmToken;
        await user.save();
    }
    static getUser = async ({userId}) => {
        console.log(userId)
        const user = await userModel.findById(userId);

        return user;
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

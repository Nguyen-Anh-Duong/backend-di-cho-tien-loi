const ApiError = require("../core/ApiError");
const Family = require("../models/familygroup.model");
const ShoppingList = require("../models/shoppinglist.model");
const User = require("../models/user.model");
const userModel = require("../models/user.model");
const admin = require("../firebase/firebaseAdmin.js");

class FamilyService {
  static acceptMember = async ({ familyId, userId, adminId }) => {
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);

    const isAdmin = foundFamily.fam_members.some(
      (member) =>
        member.userId.toString() === adminId && member.role === "admin"
    );
    if (!isAdmin)
      throw new ApiError(
        "Chi co admin moi co quyen chap nhan thanh vien.",
        403
      );

    const memberExists = foundFamily.fam_members.some(
      (member) => member.userId.toString() === userId
    );
    if (memberExists)
      throw new ApiError("Thanh vien da ton tai trong nhom.", 400);
    foundFamily.fam_members.push({ userId, role: "member" });
    return parseFamily(foundFamily);
  };
  static createNewFamily = async ({ fam_name, userId }) => {
    const user = await User.findById(userId);
    if (user.user_family_group) {
      throw new ApiError("May dinh ngoai tinh a", 400);
    }
    const newFamily = new Family({
      fam_name,
      fam_members: [{ userId, role: "admin" }],
      created_by: user._id,
    });

    newFamily.code = formatFamilyCode(newFamily._id.toString());

    user.user_family_group = newFamily._id;
    user.user_role_group = { role: "admin" };
    await user.save();
    await newFamily.save();

    return parseFamily(newFamily);
  };

  static updateFamilyInformation = async ({
    familyId,
    fam_name,
    fam_members,
    userId,
  }) => {
    //Tim xem co family khong
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);
    //kiem tra xem admin cua family co id trung voi userId khong
    if (userId != foundFamily.created_by)
      throw new ApiError("Ban khong phai la admin cua nhom.", 400);

    if (fam_name) foundFamily.fam_name = fam_name;
    if (fam_members) foundFamily.fam_members = fam_members;
    //if (fam_shared_lists) foundFamily.fam_shared_lists = fam_shared_lists;
    await foundFamily.save();

    return parseFamily(foundFamily);
  };

  static deleteFamily = async ({ familyId, userId }) => {
    //Tim xem co family khong
    const foundFamily = await Family.findById(familyId).populate(
      "fam_members.userId"
    );
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);
    //kiem tra xem admin cua family co id trung voi userId khong
    if (userId != foundFamily.created_by)
      throw new ApiError("Ban khong phai la admin cua nhom.", 400);
    await User.updateMany(
      { user_family_group: familyId },
      { $set: { user_family_group: null, user_role_group: { role: null } } }
    );
    await ShoppingList.deleteMany({ family_id: familyId });

    await foundFamily.deleteOne();

    const fcmTokens = foundFamily.fam_members
      .map((member) => member.userId.fcmToken)
      .filter((token) => token);

    // Gửi thông báo FCM
    const notification = {
      title: "Benri xin thông báo",
      body: `${foundFamily.fam_name} đã bị xóa T.T`,
    };
    const message = {
      notification: notification,
      tokens: fcmTokens,
    };
    await admin.messaging().sendMulticast(message);
  };

  //hàm này cần nghĩ thêm
  static getFamilyInformation = async ({ familyId }) => {
    const foundFamily = await Family.findById(familyId).populate(
      "fam_members.userId"
    );
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);
    return parseFamily(foundFamily);
  };

  // quan li thanh vien

  static joinFamily = async ({ code, userId }) => {
    const foundFamily = await Family.findOne({ code: code }).populate(
      "fam_members.userId"
    );
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);
    const fcmTokens = foundFamily.fam_members
      .map((member) => member.userId.fcmToken)
      .filter((token) => token);
    const memberExists = foundFamily.fam_members.some(
      (member) => member.userId.toString() === userId
    );
    if (memberExists)
      throw new ApiError("User đã là thành viên của gia đình này.", 400);
    foundFamily.fam_members.push({ userId });

    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new ApiError("Không tìm thấy user", 404);
    foundUser.user_family_group = foundFamily._id;
    foundUser.user_role_group = { role: "member" };

    await foundUser.save();
    await foundFamily.save();

    //thong  bao FB

    const notification = {
      title: "Benri xin thông báo",
      body: `Có thành viên mới trong ${foundFamily.fam_name}`,
    };
    const message = {
      notification: notification,
      tokens: fcmTokens,
    };
    await admin.messaging().sendMulticast(message);
    return {
      famlily_id: foundUser.user_family_group,
    };
  };

  static leaveFamily = async ({ familyId, userId }) => {
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);

    foundFamily.fam_members = foundFamily.fam_members.filter(
      (member) => member.userId.toString() != userId
    );
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new ApiError("Không tìm thấy user", 404);
    foundUser.user_family_group = null;
    foundUser.user_role_group = { role: null };

    await foundUser.save();
    await foundFamily.save();
  };

  static deleteMembers = async ({ userId, memberIds, familyId }) => {
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);
    if (userId != foundFamily.created_by)
      throw new ApiError("Ban khong phai la admin cua nhom.", 400);
    foundFamily.fam_members = foundFamily.fam_members.filter(
      (member) => !memberIds.includes(member.userId.toString())
    );
    await foundFamily.save();
  };

  static createNewShoppingList = async ({
    name,
    description,
    ingredients,
    familyId,
    userId,
  }) => {
    const foundFamily = await Family.findById(familyId)
      .select("-createdAt -updatedAt -__v")
      .populate("fam_members.userId")
      .lean();
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);

    const isMember = foundFamily.fam_members.find(
      (member) => member.userId == userId
    );
    if (!isMember) throw new ApiError("Ban khong nam trong nhom nay.", 400);

    const shoppingList = new ShoppingList({
      name,
      description,
      ingredients,
      created_by: userId,
      family_id: familyId,
      workerId: userId,
    });
    await shoppingList.save();

    // gui msg
    const fcmTokens = foundFamily.fam_members
      .map((member) => member.userId.fcmToken)
      .filter((token) => token);
    const notification = {
      title: "Benri xin thông báo",
      body: `Danh sách mua sắm mới đã được tạo trong ${foundFamily.fam_name}`,
    };
    const message = {
      notification: notification,
      tokens: fcmTokens,
    };
    await admin.messaging().sendMulticast(message);
    return parseShoppingList(shoppingList);
  };

  static updateShoppingListById = async ({
    name,
    description,
    ingredients,
    familyId,
    userId,
    listId,
  }) => {
    const foundFamily = await Family.findById(familyId)
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);

    const isMember = foundFamily.fam_members.find(
      (member) => member.userId == userId
    );
    if (!isMember) throw new ApiError("Ban khong nam trong nhom nay.", 400);

    const foundShoppingList = await ShoppingList.findById(listId);
    if (!foundShoppingList)
      throw new ApiError("Khong tim thay shopping list.", 404);

    if (name) foundShoppingList.name = name;
    if (description) foundShoppingList.description = description;
    if (ingredients) foundShoppingList.ingredients = ingredients;

    await foundShoppingList.save();

    return parseShoppingList(foundShoppingList);
  };

  static deleteShoppingList = async ({ familyId, userId, listId }) => {
    const foundFamily = await Family.findById(familyId)
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);

    const foundShoppingList = await ShoppingList.findById(listId);
    if (!foundShoppingList)
      throw new ApiError("Khong tim thay shopping list.", 404);

    // nếu userId không nằm trong family thì error
    // nếu userId có role là member thì không có quyền xóa list của member khác

    let foundMember = foundFamily.fam_members.find(
      (member) => member.userId.toString() === userId
    );

    console.log(foundMember);

    if (!foundMember) throw new ApiError("Ban khong nam trong nhom nay.", 400);
    else if (
      foundMember.role === "member" &&
      foundMember.userId.toString() != foundFamily.created_by.toString()
    )
      throw new ApiError("Ban khong co quyen xoa list nay.", 400);
    else await foundShoppingList.deleteOne();
  };

  static assignTask = async ({
    familyId,
    userId,
    taskDetails,
    adminId,
    listId,
  }) => {
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);

    const isAdmin = foundFamily.fam_members.some((member) => {
      console.log(`${member} -- ${adminId}`);
      return member.userId.toString() === adminId && member.role === "admin";
    });
    if (!isAdmin)
      throw new ApiError("Chi co admin moi co quyen giao viec.", 403);

    const user = await User.findById(userId);
    if (!user) throw new ApiError("Khong tim thay nguoi dung.", 404);
    console.log(`listId :: ${listId}`);
    const foundShoppingList = await ShoppingList.findById(listId);
    if (!foundShoppingList) throw new ApiError("Khong tim thay gio hang", 404);

    foundShoppingList.workerId = userId;
    await foundShoppingList.save();
    // Gửi thông báo đến người dùng
    const notification = {
      title: "Benri xin thông báo",
      body: taskDetails,
    };

    const message = {
      notification: notification,
      token: user.fcmToken,
    };

    await admin.messaging().send(message);

    return {
      message: `Task assigned successfully.From:: ${adminId} to ${userId} `,
    };
  };
  static getShoppingListsInFamily = async ({ familyId, userId }) => {
    const foundFamily = await Family.findById(familyId)
      .select("-createdAt -updatedAt -__v")
      .lean();
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);

    let foundMember = foundFamily.fam_members.find(
      (member) => member.userId.toString() === userId
    );

    // nếu userId không nằm trong family thì error
    if (!foundMember) throw new ApiError("Ban khong nam trong nhom nay.", 400);

    const foundShoppingLists = await ShoppingList.find({ family_id: familyId });
    return foundShoppingLists.map((item) => parseShoppingList(item));
  };
}

const parseFamily = function (family) {
  const response = family.toObject();
  response.family_id = response._id;
  delete response._id;
  delete response.__v;

  const { fam_members } = response;
  response.fam_members = fam_members.map((member) => ({
    userId: {
      id: member.userId._id,
      name: member.userId.user_name,
      role: member.role,
    },
  }));

  return response;
};

const parseShoppingList = function (shoppingList) {
  const response = shoppingList.toObject();
  response.list_id = response._id;
  delete response._id;
  delete response.__v;
  const { ingredients } = response;
  ingredients.map((member) => delete member._id);
  return response;
};

const formatFamilyCode = (familyId) => {
  return familyId.match(/.{1,4}/g).join("-");
};

module.exports = FamilyService;

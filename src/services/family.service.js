const ApiError = require("../core/ApiError");
const Family = require("../models/familygroup.model");
const ShoppingList = require("../models/shoppinglist.model");
const User = require("../models/user.model");

class FamilyService {
  static createNewFamily = async ({ fam_name, userId }) => {
    const user = await User.findById(userId);

    const newFamily = new Family({
      fam_name,
      fam_members: [{ userId, role: "admin" }],
      created_by: user._id,
    });

    newFamily.code = formatFamilyCode(newFamily._id.toString());

    user.user_family_group = newFamily._id;
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
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);
    //kiem tra xem admin cua family co id trung voi userId khong
    if (userId != foundFamily.created_by)
      throw new ApiError("Ban khong phai la admin cua nhom.", 400);

    await foundFamily.deleteOne();
  };

  //hàm này cần nghĩ thêm
  static getFamilyInformation = async ({ familyId }) => {
    const foundFamily = await Family.findById(familyId).populate('fam_members.userId');
    if (!foundFamily) throw new ApiError("Khong tim thay nhom.", 404);
    return parseFamily(foundFamily);
  };

  // quan li thanh vien

  static joinFamily = async ({ code, userId }) => {
    const foundFamily = await Family.findOne({ code });
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);
    foundFamily.fam_members.push({ userId });
    await foundFamily.save();
  };

  static leaveFamily = async ({ familyId, userId }) => {
    const foundFamily = await Family.findById(familyId);
    if (!foundFamily) throw new ApiError("Khong tim thay family.", 404);

    foundFamily.fam_members = foundFamily.fam_members.filter(
      (member) => member.userId.toString() != userId
    );

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
    });
    await shoppingList.save();
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
      role: member.role
    }
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

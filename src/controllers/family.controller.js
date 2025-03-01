const FamilyService = require("../services/family.service");
const { SuccessResponse } = require("../core/success.response");

class FamilyController {
  static getShoppingListsInFamily = async (req, res, next) => {
    const { familyId } = req.params;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Lay tat ca shopping list cua family thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.getShoppingListsInFamily({
        familyId,
        userId,
      }),
    }).send(res);
  };
  
  static assignTask = async (req, res, next) => {
    const { familyId, userId, listId } = req.params
    const adminId = req.user.userId
    const {taskDetails} = req.body
    return new SuccessResponse({
      message: "Giao task thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.assignTask({ familyId, taskDetails , adminId, userId, listId}),
    }).send(res);
  };
  static createNewFamily = async (req, res, next) => {
    const { userId } = req.user;
    const { fam_name } = req.body;
    return new SuccessResponse({
      message: "Tao family thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.createNewFamily({ fam_name, userId }),
    }).send(res);
  };

  static updateFamilyInformation = async (req, res, next) => {
    const { userId } = req.user;
    const { fam_name, fam_members, fam_shared_lists } = req.body;
    const { familyId, listId } = req.params;
    return new SuccessResponse({
      message: "Cap nhat thong tin family thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.updateFamilyInformation({
        familyId,
        fam_name,
        fam_members,
        // fam_shared_lists,
        userId,
      }),
    }).send(res);
  };

  static deleteFamily = async (req, res, next) => {
    const { userId } = req.user;
    const { familyId } = req.params;
    return new SuccessResponse({
      message: "Xoa family thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.deleteFamily({
        familyId,
        userId,
      }),
    }).send(res);
  };

  static getFamilyInformation = async (req, res, next) => {
    const { familyId } = req.params;
    return new SuccessResponse({
      message: "Lay thong tin family thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.getFamilyInformation({
        familyId,
      }),
    }).send(res);
  };

  //   static getAllFamiliesJoined = async (req, res, next) => {
  //     const { userId } = req.user;
  //     return new SuccessResponse({
  //       message: "Tim tat ca cac family da tham gia thanh cong.",
  //       statusCode: 200,
  //       metadata: await FamilyService.getAllFamiliesJoined({
  //         userId,
  //       }),
  //     }).send(res);
  //   };

  static joinFamily = async (req, res, next) => {
    const { code } = req.body;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Da tham gia nhom OK.",
      statusCode: 200,
      metadata: await FamilyService.joinFamily({
        code,
        userId,
      }),
    }).send(res);
  };

  static acceptInvitation = async (req, res, next) => {
    const {familyId} = req.params;
    const {userId} = req.body;
    const {adminId} = req.user
    return new SuccessResponse({
      message: "Chap nhan tham gia nhom",
      statusCode: 200,
      metadata: await FamilyService.acceptMember({
        userId,
        familyId,
        adminId
      }),
    }).send(res);
  }
  static leaveFamily = async (req, res, next) => {
    const { familyId } = req.params;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Roi nhom thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.leaveFamily({
        userId,
        familyId,
      }),
    }).send(res);
  };

  static deleteMembers = async (req, res, next) => {
    const { familyId } = req.params;
    const { userId } = req.user;
    const { memberIds } = req.body;
    return new SuccessResponse({
      message: "Xoa thanh vien nhom thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.deleteMembers({
        userId,
        memberIds,
        familyId,
      }),
    }).send(res);
  };

  static createNewShoppingList = async (req, res, next) => {
    const { familyId } = req.params;
    const { name, description, ingredients } = req.body;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Them danh sach di cho thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.createNewShoppingList({
        name,
        description,
        ingredients,
        familyId,
        userId,
      }),
    }).send(res);
  };
  static updateShoppingListById = async (req, res, next) => {
    const { familyId, listId } = req.params;
    const { name, description, ingredients } = req.body;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Cap nhat shopping list thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.updateShoppingListById({
        name,
        description,
        ingredients,
        familyId,
        userId,
        listId,
      }),
    }).send(res);
  };

  static deleteShoppingList = async (req, res, next) => {
    const { familyId, listId } = req.params;
    const { userId } = req.user;
    return new SuccessResponse({
      message: "Xoa shopping list thanh cong.",
      statusCode: 200,
      metadata: await FamilyService.deleteShoppingList({
        familyId,
        userId,
        listId,
      }),
    }).send(res);
  };
}

module.exports = FamilyController;

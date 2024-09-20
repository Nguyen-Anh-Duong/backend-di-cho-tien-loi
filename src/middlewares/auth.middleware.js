const { NotFoundError } = require("../core/error.response");
const userModel = require("../models/user.model");

const checkSystemPermission = async (requiredPermission) => {
  try {
    const user = await userModel.findById(req.user.userId).lean();
    if (!user) throw new NotFoundError("Not found user");

    const userRole = user.user_role_system
    if (!userRole) throw new NotFoundError("Not found role");
 
  } catch (error) {
    next(error);
  }
};

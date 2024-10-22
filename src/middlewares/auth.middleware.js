const { NotFoundError, ForbiddenError } = require("../core/error.response");
const userModel = require("../models/user.model");
const rbac = require("../middlewares/role.middleware")
const {getRoleList} = require("../services/rbac.service")
const roleModel = require("../models/role.schema")
const checkSystemPermission =  (action, resource) => {
  return async (req, res, next) => {
    try {
      const currentUser = req?.user
      const {userId} = req.params;
      const rol_name = req.query.role;

      if(rol_name !== "admin" && currentUser.userId !== userId) {
        throw new ForbiddenError("Ban chi duoc cap nhat ho so cua ban")
      }
     
    
      const userData = await userModel.findById(currentUser.userId).populate('user_role_system')
      console.log(userData)
      if(rol_name != userData.user_role_system.rol_name || userData.user_role_system.rol_name === "user") {
            throw new ForbiddenError("You are user not admin")
      }
      

      const _ = rbac.setGrants(await getRoleList({userId: currentUser.userId}))
      if(!_) {
        throw new NotFoundError("rbac not found ")
      }

      const permission = rbac.can(rol_name)[action](resource);
      if(!permission.granted) {
        throw new ForbiddenError("You are not allowed to access this resource")
      }
       next()
    } catch (error) {
      next(error)
    }
  }
}


module.exports = {checkSystemPermission}
const { NotFoundError, ForbiddenError } = require("../core/error.response");
const userModel = require("../models/user.model");
const rbac = require("../middlewares/role.middleware")
const {getRoleList} = require("../services/rbac.service")
const roleModel = require("../models/role.schema")
const checkSystemPermission =  (action, resource) => {
  return async (req, res, next) => {
    try {
      const {userId} = req?.user || req.body
      const _ = rbac.setGrants(await getRoleList({userId: userId}))
      if(!_) {
        throw new NotFoundError("rbac not found ")
      }
      const rol_name = req.query.role;
      console.log(rol_name+"******");
      const userData = await userModel.findById(userId).populate('user_role_system')
      console.log(userData)
      const roleId = req.user.roleId;
      const role = await roleModel.findById(roleId)
      console.log(roleId+"==roleId")
      if(rol_name!==userData.user_role_system.rol_name) {
        throw new ForbiddenError("You are not allowed to access this resource")
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
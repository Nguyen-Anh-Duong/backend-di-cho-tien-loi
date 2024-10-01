"use strict";

const { NotFoundError } = require("../core/error.response");
const resourceModel = require("../models/resource.model");
const ROLE = require("../models/role.schema");
const userModel = require("../models/user.model");
const { convertToObjectId } = require("../utils");

const newResource = async ({ name, slug, description }) => {
  try {
    const src = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });
    console.log(src);
    return src;
  } catch (error) {
    return error;
  }
};

const createRole = async ({
  name = "user",
  slug = "u00001",
  description = "user",
  grants = [],
}) => {
  console.log({ name, slug, description, grants });
  const foundRole = await ROLE.findOne({ rol_slug: slug });
  if (foundRole) throw new NotFoundError("da ton tai role");
  const role = await ROLE.create({
    rol_name: name,
    rol_slug: slug,
    rol_description: description,
    rol_grants: grants,
  });
  return role;
};


const getResources = async () => {
  try {
    return await resourceModel.find();
  } catch (error) {
    return error;
  }
};

const getRoleList = async ({
  userId = 0,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    const { user_role_system } = await userModel.findById(userId);
    if(!user_role_system) throw new NotFoundError("role not exist in db")
    console.log("***" + user_role_system);
    
    const roleId = convertToObjectId(user_role_system);
    if(!roleId) throw new NotFoundError("roleId not found")
    
    const roles = await ROLE.aggregate([
      { $match: { _id: roleId } },
      { $unwind: "$rol_grants" },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource"
        }
      },
      { $unwind: "$resource" },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          action: '$rol_grants.actions',
          attributes: '$rol_grants.attributes'
        }
      },
      { $unwind: "$action" },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: 1,
          attributes: 1
        }
      }
    ]);

    console.log(roles);
    return roles;
  } catch (error) {
    return []
  }
};

module.exports = {
  newResource,
  createRole,
  getRoleList,
  getResources,
};

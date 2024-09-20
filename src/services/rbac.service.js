'use strict'

const { NotFoundError } = require("../core/error.response")
const resourceModel = require("../models/resource.model")
const ROLE = require("../models/role.schema")

const newResource = async ({
    name,
    slug,
    description
}) => {
    
    const src= await resourceModel.create({
            src_name: name,
            src_slug: slug,
            src_description: description
    })
    console.log(src)
    return src
    
}

const createRole = async ({name = 'user', slug = 'u00001', description="user", grants = []}) => {
    try {
        const foundRole = ROLE.findOne({rol_slug: slug})
        if(foundRole) throw NotFoundError("da ton tai role")

        const role = await ROLE.create({
            rol_name: name,
            rol_slug: slug,
            rol_description: description,
            rol_grants: grants
        })
        
    } catch (error) {
        return error
    }
}

const getRoleList = async () => {
    try {
        return await ROLE.find()
    } catch (error) {
        return error
    }
}
const getResources = async () => {
    try {
        return await resourceModel.find()
    } catch (error) {
        return error
    }
}

module.exports = {
    newResource, createRole, getRoleList, getResources
}
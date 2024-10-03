'use strict'
const { checkSystemPermission } = require('../../middlewares/auth.middleware')
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const userController = require('../../controllers/user.controller')
const router = express.Router()

// router.post('/updateRole', asyncHandler(userController.updateRole))
router.get('/viewAny', checkSystemPermission("readAny", "user"), asyncHandler(userController.viewAny))
router.patch('/updateProfile/:userId', checkSystemPermission("updateOwn", "user"), asyncHandler(userController.updateProfile))

module.exports = router

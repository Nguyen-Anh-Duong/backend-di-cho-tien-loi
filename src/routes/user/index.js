'use strict'
const { checkSystemPermission } = require('../../middlewares/auth.middleware')
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const userController = require('../../controllers/user.controller')
const { authentication } = require("../../auth/checkAuth");

const router = express.Router()

// router.post('/updateRole', asyncHandler(userController.updateRole))
router.use(authentication);
router.get('/', asyncHandler(userController.getUser))
router.post('/save-token', asyncHandler(userController.saveToken))
router.get('/viewAny', checkSystemPermission("readAny", "user"), asyncHandler(userController.viewAny))
router.patch('/updateProfile/:userId', checkSystemPermission("updateOwn", "user"), asyncHandler(userController.updateProfile))
router.post('/block/:userId', checkSystemPermission("updateOwn", "user"), asyncHandler(userController.blockUser))

module.exports = router

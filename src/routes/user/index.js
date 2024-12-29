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
router.get('/review/:month/:year', asyncHandler(userController.review))
router.get('/viewAny', checkSystemPermission("readAny", "user"), asyncHandler(userController.viewAny))
router.patch('/updateProfile/:userId', checkSystemPermission("updateAny", "user"), asyncHandler(userController.updateProfile))
router.post('/block/:userId', checkSystemPermission("updateAny", "user"), asyncHandler(userController.blockUser))
router.post('/', checkSystemPermission("updateAny", "user"), asyncHandler(userController.createUser))
router.delete('/:deleteId', checkSystemPermission("updateAny", "user"), asyncHandler(userController.deleteUser))

module.exports = router

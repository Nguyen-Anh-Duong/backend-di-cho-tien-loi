'use strict'
const { checkSystemPermission } = require('../../middlewares/auth.middleware')
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const userController = require('../../controllers/user.controller')
const router = express.Router()

router.post('/update', asyncHandler(userController.updateRole))
router.get('/viewAny', checkSystemPermission("read", "user"), asyncHandler(userController.viewAny))

module.exports = router

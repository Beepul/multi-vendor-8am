const router = require('express').Router()
const auth = require('../../middleware/auth.middleware')
const allowRole = require('../../middleware/rbac.middleware')
const userCtrl = require('./user.controller')

router.get('/seller/:sellerId', auth, userCtrl.getSellerDetail)

router.route('/')
    .get(auth, allowRole(['admin']), userCtrl.index)

module.exports = router 
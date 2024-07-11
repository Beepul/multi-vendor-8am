const auth = require('../../middleware/auth.middleware')
const allowRole = require('../../middleware/rbac.middleware')
const { setPath, uploader } = require('../../middleware/uploader.middleware')
const { bodyValidator } = require('../../middleware/validator.middleware')
const shopCtrl = require('./shop.controller')
const { CreateShopDTO } = require('./shop.dto')

const router = require('express').Router()


router.post(
    '/create-shop',
    auth,
    allowRole(['customer', 'admin']),
    setPath('shop'),
    uploader.fields([{name: 'profileImg', maxCount:1}, {name: 'bannerImg', maxCount: 1}]),
    bodyValidator(CreateShopDTO, ['profileImg', 'bannerImg']),
    shopCtrl.createShop
)

router.get(
    '/activate/:token',
    auth,
    allowRole(['customer', 'admin']),
    shopCtrl.activateShop
)

router.put(
    '/resend-activation-link',
    auth,
    allowRole(['customer', 'admin']),
    shopCtrl.resendActivationLink
)

router.get(
    '/dashboard-details',
    auth,
    allowRole(['seller']),
    shopCtrl.getDashboardDetails
)

router.get(
    '/my',
    auth,
    allowRole(['seller']),
    shopCtrl.getMyShop
)

module.exports = router
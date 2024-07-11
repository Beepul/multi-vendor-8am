const router = require('express').Router()
const { setPath, uploader } = require('../../middleware/uploader.middleware')
const { bodyValidator } = require('../../middleware/validator.middleware')
const authCtrl = require('./auth.controller')
const { registerDTO, loginDTO, ResendActivationDTO, UpdateDTO, UpdatePasswordDTO, ResetPasswordDTO } = require('./auth.dto')
const auth = require('../../middleware/auth.middleware')
const allowRole = require('../../middleware/rbac.middleware')

router.post('/register', 
    setPath('users'), 
    // uploader.none(), 
    uploader.single('image'), 
    bodyValidator(registerDTO), 
    authCtrl.register
)
router.put('/resend-activation-link', bodyValidator(ResendActivationDTO) ,authCtrl.resendActivationLink)
router.get('/activate/:token', authCtrl.activate)
router.post('/login', bodyValidator(loginDTO) ,authCtrl.login)

router.get('/me', auth ,authCtrl.getLoggedIn)
router.put(
    '/update-my-detail', 
    auth, 
    setPath('users'),
    uploader.single('image'),
    bodyValidator(UpdateDTO, ["image"]),
    authCtrl.updateMe
)
router.put(
    '/update-my-password',
    auth,
    bodyValidator(UpdatePasswordDTO),
    authCtrl.updateMyPassword
)
router.post(
    '/get-resetLink',
    authCtrl.sendResetLink
)
router.put(
    '/reset-password',
    bodyValidator(ResetPasswordDTO),
    authCtrl.resetPassword
)
router.get('/admin', auth , allowRole('admin')  ,authCtrl.adminAccess)

module.exports = router 
const mailSvc = require("../../services/mail.service")
const authSvc = require("../auth/auth.service")
const shopSvc = require("./shop.service")
const jwt = require('jsonwebtoken')

class ShopController {
    createShop = async (req, res, next) => {
        try{
            const payload = shopSvc.transformCreateDTO(req)

            const userDetail = await authSvc.findOneUser({
                _id: payload.sellerId,
                status: "active"
            })

            if(!userDetail){
                throw {code: 404, message: "User not found or user account is not activated."}
            }

            const existingShop = await shopSvc.findOneShop({sellerId: payload.sellerId})

            if(existingShop) {
                throw {code: 400, message: "Single user cannot have multiple shops!"}
            }

            const shop = await shopSvc.createShop(payload)

            await mailSvc.sendEmail(
                userDetail.email,
                "Activate your Shop!",
                `Dear ${userDetail.name} <br/>
                <p>You have registered your shop with name <strong>${shop.name}</strong>.</p>
                <p>Please click the link below or copy and paste the url in browser to activate your shop account:</p>
                <a href="${process.env.FRONTEND_URL}/seller/activate-shop/${shop.activationToken}">
                    ${process.env.FRONTEND_URL}/seller/activate-shop/${shop.activationToken}
                </a>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please do not reply to this email via any mail service.</em><small></p>
                `
            )

            res.json({
                result: shop,
                message: "Shop created successfully",
                meta: null
            })

        }catch (err) {
            next(err)
        }
    }
    activateShop = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser

            const token = req.params.token 

            const isVerifiedToken = jwt.verify(token, process.env.JWT_SECRET)

            const seller = await authSvc.findOneUser({
                _id: isVerifiedToken.sub,
            })

            if(!seller){
                throw {code: 400, message: "User not found with the token you have provided."}
            }

            const shop = await shopSvc.findOneShop({
                sellerId: seller._id,
                activationToken: token
            })

            if(!shop){
                throw {code: 400, message: "Shop not found with the token or user you have provided."}
            }

            const updatedShop = await shopSvc.updateShop(shop._id,{
                status: 'approved',
                activationToken: null,
                updatedBy: loggedInUser._id
            })

            const updatedUser = await authSvc.updateUser({role: 'seller'}, seller._id)

            res.json({
                result: updatedShop,
                message: "Shop has been activated",
                meta: null
            })


        }catch( error) {
            next(error)
        }
    }

    resendActivationLink = async (req, res, next) => {
        try {
            const {email} = req.body 

            const userDetail = await authSvc.findOneUser({
                email: email 
            })

            if(!userDetail){
                throw {code: 400, message: "User does not exists"}
            }

            const associatedShop = await shopSvc.findOneShop({
                sellerId: userDetail._id
            })

            if(!associatedShop){
                throw {code: 404, message: `Associated shop to ${email} not found`}
            }

            const activationToken = jwt.sign({sub: associatedShop.sellerId}, process.env.JWT_SECRET)

            await shopSvc.updateShop(associatedShop._id, {activationToken: activationToken})

            await mailSvc.sendEmail(
                userDetail.email,
                "Activate your Shop!",
                `Dear ${userDetail.name} <br/>
                <p>You have registered your shop with name <strong>${associatedShop.name}</strong>.</p>
                <p>Please click the link below or copy and paste the url in browser to activate your shop account:</p>
                <a href="${process.env.FRONTEND_URL}/seller/activate-shop/${activationToken}">
                    ${process.env.FRONTEND_URL}/seller/activate-shop/${activationToken}
                </a>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please do not reply to this email via any mail service.</em><small></p>
                `
            )

            res.json({
                result: null,
                message: "Activation Link sent successfully",
                meta: null
            })


        } catch (error) {
            next(error)
        }
    }

    getDashboardDetails = async (req, res, next) => {
        try{

            res.json({
                result: {
                    profit: 0,
                    numOfProducts: 0,
                    numOfOrders: 0,
                    topTenCategories: 0,
                    topTenBrands: 0,
                    latestRatings: [],
                    latestTransactions: []
                },
                message: "Your dashboard details",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }

    getMyShop = async (req, res, next) => {
        try{
            const shop = req.shopDetail

            res.json({
                result: shop,
                message: "Shop details",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }
} 

const shopCtrl = new ShopController

module.exports = shopCtrl


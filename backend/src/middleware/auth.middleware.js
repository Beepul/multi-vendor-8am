require("dotenv").config()
const jwt = require('jsonwebtoken')
const User = require('../modules/user/user.model')
const authSvc = require("../modules/auth/auth.service")
const shopSvc = require("../modules/shop/shop.service")

const auth = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null 

        if(!token){
            next({code: 401, message: "Token required"})
        }

        token = token.split(" ").pop()

        const tokenData = jwt.verify(token, process.env.JWT_SECRET)

        const userDetail = await authSvc.findOneUser({_id: tokenData.sub})

        if(!userDetail){
            next({code: 401, message: "User does not exists!"})
        }

        if(userDetail.role === 'seller'){
            const shopDetail = await shopSvc.findOneShop({sellerId: userDetail._id})

            req.shopDetail = shopDetail
        }
        

        req.authUser = userDetail

        next()


    } catch (error) {
        console.log("Exception", error) 
        next({code: 401, message: "Unauthorized access"})
    }
}

module.exports = auth
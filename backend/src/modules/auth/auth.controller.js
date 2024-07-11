require('dotenv').config()
const mailSvc = require('../../services/mail.service')
const productSvc = require('../product/product.service')
const shopSvc = require('../shop/shop.service')
const authSvc = require('./auth.service')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class AuthController {
    register = async (req, res, next) => {
        // TODO ===> validation, db query to store, varification send via email, client response

        try {
            const data = authSvc.transformRegisterData(req)

            const registeredUser = await authSvc.createUser(data)
            
            await mailSvc.sendEmail(
                registeredUser.email,
                "Activate your Account!",
                `Dear ${registeredUser.name} <br/>
                <p>You have registered your account with username <strong>${registeredUser.name}</strong>.</p>
                <p>Please click the link below or copy and paste the url in browser to activate your account:</p>
                <a href="${process.env.FRONTEND_URL}/activate/${registeredUser.activationToken}">
                    ${process.env.FRONTEND_URL}/activate/${registeredUser.activationToken}
                </a>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please do not reply to this email via any mail service.</em><small></p>
                `
            )
            
            res.json({
                result: registeredUser,
                message: "Register success",
                meta: null
            })
            
        } catch (exception) {
            next(exception)
        }
        
    }
    activate = async (req, res, next) => {
        try {
            const token = req.params.token 

            const associatedUser = await authSvc.findOneUser({
                activationToken: token
            })

            if(!associatedUser){
                throw {code: 400, message: "Token does not exists"}
            }

            const updateResult = await authSvc.updateUser({
                activationToken: null,
                status: "active"
            }, associatedUser._id)

            res.json({
                result: updateResult,
                message: "Your account has been activated successfully",
                meta: null
            })

            // User identify, status = active, activationToken = null
        } catch (error) {
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

            if(userDetail.status === 'active'){
                throw {code: 400, message: "User has been already activated. Please try login to your account."}
            }

            await mailSvc.sendEmail(
                userDetail.email,
                "Activate your Account!",
                `Dear ${userDetail.name} <br/>
                <p>You have registered your account with username <strong>${userDetail.name}</strong>.</p>
                <p>Please click the link below or copy and paste the url in browser to activate your account:</p>
                <a href="${process.env.FRONTEND_URL}/activate/${userDetail.activationToken}">
                    ${process.env.FRONTEND_URL}/activate/${userDetail.activationToken}
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

    login = async (req, res, next) => {
        try {
            const {email, password} = req.body
            const userDetail = await authSvc.findOneUser({
                email: email
            })

            if(!userDetail){
                throw {code: 400, message: "User does not exists"}
            }

            if(bcrypt.compareSync(password, userDetail.password)){
                if(userDetail.status !== 'active'){
                    throw {code: 400, message: "Your account has not been activated. Please activate your account."}
                }

                const accessToken = jwt.sign({
                    sub: userDetail._id
                }, process.env.JWT_SECRET)
                const refreshToken = jwt.sign({
                    sub: userDetail._id
                }, process.env.JWT_SECRET)

                res.json({
                    result: {
                        detail: {
                            _id: userDetail._id,
                            name: userDetail.name,
                            email: userDetail.email,
                            role: userDetail.role,
                            status: userDetail.status,
                            image: userDetail.image,
                        },
                        token: {
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }
                    },
                    message: "Login Successful",
                    meta: null
                })
            } else {
                throw {code: 400, message: "Credentials does not match"}
            }
        } catch (error) {
            next(error)
        }
    }


    getLoggedIn =  async (req, res, next) => {
        try{
            const loggedInUser = req.authUser 
            const response =  {
                _id: loggedInUser._id,
                name: loggedInUser.name,
                email: loggedInUser.email,
                role: loggedInUser.role,
                status: loggedInUser.status,
                image: loggedInUser?.image,
                phone: loggedInUser?.phone
            }
            // if(loggedInUser.role === "seller"){
            //     const myShop = await shopSvc.findOneShop({
            //         sellerId: loggedInUser._id
            //     })
            //     const ratings = myShop.ratings;
            //     const totalRatings = ratings.length;
            //     const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            //     const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0;

            //     const totalProducts = await productSvc.count({
            //         shopId: myShop._id,
            //         status: "active"
            //     })

            //     response.shop = {
            //         _id: myShop._id,
            //         name: myShop.name,
            //         about: myShop.about,
            //         profileImg: myShop.profileImg,
            //         bannerImg: myShop.bannerImg,
            //         phoneNumber: myShop.phoneNumber,
            //         email: myShop.email,
            //         addressLine1: myShop.addressLine1,
            //         addressLine2: myShop.addressLine2,
            //         createdAt: myShop.createdAt,
            //         ratingsCount: averageRating,
            //         productsCount: totalProducts,
            //     }
            // }
            res.json({
                result: response,
                message: "Your profile",
                meta: null
            })

            
        } catch(err) {
            next(err)
        }

    }

    adminAccess = async (req, res, next) => {
        try{
            res.json({
                result: "Iam here in admin controller",
                message: "Only by admin",
                meta: null
            })
        } catch(err) {
            next(err)
        }
    }

    updateMe = async (req, res, next) => {
        try{
            const data = {...req.body}

            if(req.file){
                data.image = req.file.filename
            }
            const loggedInUser = req.authUser 
            const updateResult = await authSvc.updateUser({...data}, loggedInUser._id)

            const {password, ...rest} = updateResult
            res.json({
                result: rest,
                message: "Your profile has been updated.",
                meta: null
            })
        }catch(err) {
            next(err)
        }
    }

    updateMyPassword = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser
            console.log(loggedInUser)
            const data = {...req.body}

            const isValidPassword = bcrypt.compareSync(data.oldPassword, loggedInUser.password)

            if(!isValidPassword){
                throw {code: 400, message: "Old Password do not match"}
            }

            data.password = bcrypt.hashSync(data.newPassword, 10)

            const updateResult = await authSvc.updateUser({...data}, loggedInUser._id)

            console.log(updateResult)

            res.json({
                result: null,
                message: "Password Changed Successfully",
                meta: null
            })

        }catch (err) {
            next(err)
        }
    }

    sendResetLink = async (req, res, next) => {
        try{
            const data = {...req.body}
            const user = await authSvc.findOneUser({email: data.email})
    
            if(!user){
                throw {code: 404, message: "User not found. Please check your entered email address."}
            }

            const resetToken = jwt.sign({email: user.email}, process.env.JWT_SECRET, {
                expiresIn: '5m'
            })

            await mailSvc.sendEmail(
                user.email,
                "Password Reset Link!",
                `Dear ${user.name} <br/>
                <p>Please click the link below or copy and paste the url in browser to change your account password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">
                    ${process.env.FRONTEND_URL}/reset-password/${resetToken}
                </a>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please do not reply to this email via any mail service.</em><small></p>
                `
            )

            res.json({
                result: null,
                message: "Password Reset Link Sent Successfully",
                meta: null
            })

        }catch (error) {
            next(error)
        }
    }
    resetPassword = async (req, res, next) => {
        try{
            const data = {...req.body}

            const verifyToken = await jwt.verify(data.resetToken,process.env.JWT_SECRET)

            if(verifyToken){
                const user = await authSvc.findOneUser({email: verifyToken.email})
                if(!user){
                    throw {code: 404, message: "User not found"}
                }
                const newPassword = bcrypt.hashSync(data.password, 10)
                const updatedUser = await authSvc.updateUser({password: newPassword}, user._id)
                
                res.json({
                    result: null,
                    message: "Password has been changed successfully",
                    meta: null
                })
            }
        }catch (err) {
            next(err)
        }
    }
}


const authCtrl = new AuthController()

module.exports = authCtrl
const productSvc = require("../product/product.service")
const userSvc = require("./user.service")

class UserController{
    index = async (req,res, next) => {
        try{
            const page = +req.query.page || 1
            const limit = +req.query.limit || 15
            const skip = (page - 1) * limit

            let filter = {}

            if(req.query.search){
                filter = {
                   name: new RegExp(req.query.search, 'i'),
                   email: new RegExp(req.query.search, 'i'),
                }
            }

            

            if(req.query.role){
                filter = {
                    ...filter,
                    role: req.query.role
                }
            }

            const data = await userSvc.listAll({
                limit: limit,
                skip: skip,
                filter: filter
            })

            const countData = await userSvc.count({
                filter: filter
            })

            res.json({
                result: data,
                message: "User List",
                meta: {
                    limit: limit,
                    page: page,
                    total: countData
                }
            })
        }catch (err){
            next(err)
        }
    }
    listUser = (req,res, next) => {
        res.json({
            result: "Iam here in list controller",
            message: "Success",
            meta: null
        })
    }

    getSellerDetail = async (req, res, next) => {
        try{
            const sellerId = req.params.sellerId
            const page = +req.query.page || 1
            const limit = +req.query.limit || 15
            const skip = (page - 1) * limit


            const details = await userSvc.findOneUser({_id: sellerId})

            if(!details){
                throw {code: 404, message: "User not found"}
            }

            if(details.status !== 'active'){
                throw {code: 400, message: "Your account has not been activated. Please activate your account."}
            }

            if(details.role !== 'seller'){
                throw {code: 400, message: "You are not a seller"}
            }

            const associatedProducts = await productSvc.listAll({
                limit: limit,
                skip: skip,
                filter: {
                    sellterId: details._id
                }
            })
            res.json({
                result: {
                    sellerDetail: details,
                    associatedProducts: associatedProducts
                },
                message: "Seller detail",
                meta: null
            })
        } catch(err) {
            next(err)
        }
    }

    delete = async (req, res, next) => {
        try{

        }catch (err){
            next(err)
        }
    }
}



const userCtrl = new UserController()

module.exports = userCtrl



const jwt = require("jsonwebtoken")
const ShopModel = require("./shop.model")

class ShopService {
    transformCreateDTO = (req) => {
        const loggedInUser = req.authUser
        const data = {...req.body}

        const activationToken = jwt.sign({sub: data.sellerId}, process.env.JWT_SECRET)

        const transformedData = {
            ...data,
            status: "pending",
            createdBy: loggedInUser,
            activationToken
        }

        return transformedData
    }

    findOneShop = async (filter) => {
        try{
            const shop = await ShopModel.findOne(filter)
                .populate("createdBy", ["_id","name","email","role"])
                .populate("updatedBy", ["_id","name","email","role"])
                .populate("sellerId", ["_id","name","email","role"])
            return shop
        }catch(err){
            throw err 
        }
    }

    createShop = async (payload) => {
        try{
            const shop = new ShopModel(payload)
            return await shop.save()
        }catch (error){
            throw error
        }
    }

    updateShop = async (id, data) => {
        try{
            const shop = ShopModel.findByIdAndUpdate(id,{$set: data}, {new: true}).lean()
            return shop
        }catch (err){
            throw err
        }
    }
}

const shopSvc = new ShopService

module.exports = shopSvc
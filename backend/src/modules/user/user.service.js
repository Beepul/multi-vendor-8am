const UserModel = require("./user.model")

class UserService {
    count = async ({filter}) => {
        try{
            const countData = await UserModel.countDocuments(filter)
            return countData
        } catch (error) {
            throw error
        }
    }

    listAll = async ({limit, skip, filter = {}}) => {
        try{
            const response = await UserModel.find(filter)
                .populate("createdBy", ["_id","name","email","role"])
                .populate("updatedBy", ["_id","name","email","role"])
                .sort({_id: "desc"})
                .skip(skip)
                .limit(limit)
                .select('-password')
            return response
        } catch (error) {
            throw error
        }
    }

    findOneUser = async (filter) => {
        try {
            const userObj = await UserModel.findOne(filter)
            return userObj
        } catch (error) {
            throw error 
        }
    }
}


const userSvc = new UserService()

module.exports = userSvc
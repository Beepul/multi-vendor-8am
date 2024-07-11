const { generateRandomString } = require('../../utilities/helpers')
const bcrypt = require('bcryptjs')
const UserModel = require('../user/user.model')

class AuthService {
    transformRegisterData = (req) => {
        try {
            let payload = req.body 

            payload.password = bcrypt.hashSync(payload.password, 10)
            payload.status = 'inactive'
            payload.activationToken = generateRandomString(100)

            if(req.file){
                payload.image = req.file.filename;
            }

            return payload 
        } catch (error) {
            throw error
        }
    }

    createUser = async (data) => {
        try {
            const user = new UserModel(data)
            return await user.save() // new user -> insert or old user -> update
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

    updateUser = async (data,userId) => {
        try {
            const result = await UserModel.findByIdAndUpdate(userId, {$set: data}, {new: true}).lean()

            return result 
        } catch (error) {
            throw error 
        }
    }
}

const authSvc = new AuthService()

module.exports = authSvc
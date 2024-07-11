const { default: slugify } = require('slugify');
const BrandModel = require('./brand.model');

class BrandService {
    transformCreateData = (req) => {
        const data = {
            ...req.body,
        }

        if(!req.file){
            throw {code: 400, message: 'Image is required'}
        }else {
            data.image = req.file.filename
        }

        data.slug = slugify(data.title, {
            lower: true,
        })

        data.createdBy = req.authUser._id

        return data
    }

    transformUpdateData = (req, existingData) => {
        const data = {
            ...req.body,
        }

        if(req.file){
            data.file = req.file.filename
        }else {
            data.image = existingData.image
        }

        data.updatedBy = req.authUser._id

        return data
    }

    store = async (data) => {
        try{
            const brand = new BrandModel(data)

            return await brand.save()
            
        } catch (error) {
            throw error
        }
    }

    count = async () => {
        try{
            const countData = await BrandModel.countDocuments()
            return countData
        } catch (error) {
            throw error
        }
    }

    listAll = async ({limit, skip}) => {
        try{
            const response = await BrandModel.find()
                .sort({_id: "desc"})
                .skip(skip)
                .limit(limit)
            return response
        } catch (error) {
            throw error
        }
    }

    findOne = async (filter) => {
        try{
            const data = await BrandModel.findOne(filter)
            if(!data) {
                throw {code: 400, message: 'Brand not found'}
            }
            return data
        }catch (error) {
            throw error
        }
    }

    update = async (filter, data) => {
        try {
            const updateResponse = await BrandModel.findOneAndUpdate(filter, {$set: data} )

            return updateResponse
        } catch (error) {
            throw error
        }
    }

    deleteOne = async (filter) => {
        try{
            const res = await BrandModel.findOneAndDelete(filter)
            if(!res) {
                throw {code: 404, message: "Brand does not exists"}
            }
            return res
        }catch (err) {
            throw err
        }
    }

    getForHome = async () => {
        try{
            const response = await BrandModel.find({
                status: "active",
            }).sort({_id: "desc"})
            .limit(10)
            return response
        } catch (error) {
            throw error
        }
    }

    
}

const brandSvc = new BrandService()

module.exports = brandSvc;
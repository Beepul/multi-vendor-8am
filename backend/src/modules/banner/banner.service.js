const BannerModel = require('./banner.model');

class BannerService {
    transformCreateData = (req) => {
        const data = {
            ...req.body,
        }

        if(!req.file || req.files.length <= 0){
            throw {code: 400, message: 'Image is required'}
        }else {
            data.image = req.file.filename
        }

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
            const banner = new BannerModel(data)

            return await banner.save()
            
        } catch (error) {
            throw error
        }
    }

    count = async () => {
        try{
            const countData = await BannerModel.countDocuments()
            return countData
        } catch (error) {
            throw error
        }
    }

    listAll = async ({limit, skip}) => {
        try{
            const response = await BannerModel.find()
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
            const data = await BannerModel.findOne(filter)
            if(!data) {
                throw {code: 400, message: 'Banner not found'}
            }
            return data
        }catch (error) {
            throw error
        }
    }

    update = async (filter, data) => {
        try {
            const updateResponse = await BannerModel.findOneAndUpdate(filter, {$set: data} )

            return updateResponse
        } catch (error) {
            throw error
        }
    }

    deleteOne = async (filter) => {
        try{
            const res = await BannerModel.findOneAndDelete(filter)
            if(!res) {
                throw {code: 404, message: "Banner does not exists"}
            }
            return res
        }catch (err) {
            throw err
        }
    }

    getForHome = async () => {
        try{
            const response = await BannerModel.find({
                status: "active",
            }).sort({_id: "desc"})
            .limit(10)
            return response
        } catch (error) {
            throw error
        }
    }

    
}

const bannerSvc = new BannerService()

module.exports = bannerSvc;
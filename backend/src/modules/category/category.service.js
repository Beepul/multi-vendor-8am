const { default: slugify } = require('slugify');
const CategoryModel = require('./category.model');

class CategoryService {
    uniqueSlug = async (slug) => {
        try{
            const catExists = await CategoryModel.findOne({
                slug: slug
            })

            if(catExists){
                const time = Date.now()
                slug = slug+"-"+time
                return await this.uniqueSlug(slug)
            }else {
                return slug
            }
        }catch (err) {
            throw err
        }
    }
    transformCreateData = async (req) => {
        const data = {
            ...req.body,
        }

        let slug = slugify(data.title, {
            lower: true 
        })
        
        slug = await this.uniqueSlug(slug)

        data.slug = slug

        if(!data.parentId || data.parentId === 'null' || data.parentId === '' || data.parentId === undefined || data.parentId === 'undefined'){
            data.parentId = null;
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

        if(!data.parentId || data.parentId === 'null' || data.parentId === '' || data.parentId === undefined || data.parentId === 'undefined'){
            data.parentId = null;
        }

        data.updatedBy = req.authUser._id

        return data
    }

    store = async (data) => {
        try{
            const category = new CategoryModel(data)

            return await category.save()
            
        } catch (error) {
            throw error
        }
    }

    count = async () => {
        try{
            const countData = await CategoryModel.countDocuments()
            return countData
        } catch (error) {
            throw error
        }
    }

    listAll = async ({limit, skip}) => {
        try{
            const response = await CategoryModel.find()
                .populate("parentId", ["_id", "title", "slug"])
                .populate("createdBy", ["_id","name","email","role"])
                .populate("updatedBy", ["_id","name","email","role"])
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
            const data = await CategoryModel.findOne(filter)
                .populate("parentId", ["_id", "title", "slug"])
                .populate("createdBy", ["_id","name","email","role"])
                .populate("updatedBy", ["_id","name","email","role"])
            if(!data) {
                throw {code: 400, message: 'Category not found'}
            }
            return data
        }catch (error) {
            throw error
        }
    }

    update = async (filter, data) => {
        try {
            const updateResponse = await CategoryModel.findOneAndUpdate(filter, {$set: data} )

            return updateResponse
        } catch (error) {
            throw error
        }
    }

    deleteOne = async (filter) => {
        try{
            const res = await CategoryModel.findOneAndDelete(filter)
            if(!res) {
                throw {code: 404, message: "Category does not exists"}
            }
            return res
        }catch (err) {
            throw err
        }
    }

    getForHome = async () => {
        try{
            const response = await CategoryModel.find({
                status: "active",
            })
            .populate("parentId", ["_id", "title", "slug"])
            .populate("createdBy", ["_id","name","email","role"])
            .populate("updatedBy", ["_id","name","email","role"])
            .sort({_id: "desc"})
            .limit(10)
            return response
        } catch (error) {
            throw error
        }
    }

    
}

const categorySvc = new CategoryService()

module.exports = categorySvc;
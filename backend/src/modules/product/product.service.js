const { default: slugify } = require('slugify');
const ProductModel = require('./product.model');
const shopSvc = require('../shop/shop.service');

class ProductService {
    uniqueSlug = async (slug) => {
        try{
            const productExists = await ProductModel.findOne({
                slug: slug
            })

            if(productExists){
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
        try{
            const data = {
                ...req.body,
            }
    
            if(req.files){
                let images = []
                req.files.map(image => {
                    images.push(image.filename)
                })
                data.images = images 
            }else {
                data.images = null
            }
    
            let slug = slugify(data.title, {
                lower: true,
            })
    
            slug = await this.uniqueSlug(slug)

            data.slug = slug
    
            // after discound 
            data.afterDiscount = data.price - data.price * data.discount / 100
    
            if(!data.brand || data.brand === 'null' || data.brand === ''){
                data.brand = null;
            }
    
            if(!data.sellerId || data.sellerId === 'null' || data.sellerId === ''){
                data.sellerId = null;
            }
    
            if(!data.categories || data.categories === 'null' || data.categories === ''){
                data.categories = null;
            }

            if(!data.colors || data.colors === "null" || data.colors === ''){
                data.colors = null
            }else{
                if (Array.isArray(data.colors)) {
                    const lowercaseColors = data.colors.map((color) => color.toLowerCase());
                    const uniqueColors = new Set(lowercaseColors);
        
                    if (uniqueColors.size !== lowercaseColors.length) {
                        throw { code: 409, message: "Duplicate color detected!" };
                    }
        
                    data.colors = Array.from(uniqueColors);
                }
            }

            if(req.authUser.role === 'seller'){
                const shop = await shopSvc.findOneShop({sellerId: req.authUser._id})
                data.shopId = shop._id
                data.status = 'inactive'
            }
    
            data.createdBy = req.authUser._id
    
            return data
        }catch(err){
            throw err
        }
        
    }

    transformUpdateData = (req, existingData) => {
        const data = {
            ...req.body,
        }

        
        let images = [...existingData.images]
        
        console.log("existing::", images)
        
        if(req.files && Array.isArray(req.files) && req.files.length > 0){
            const files = req.files.map(image => image.filename);
            images = files
            console.log("new::", images)
        }
        

        data.images = images 

        console.log("final::", data.images)

        // after discound 
        data.afterDiscount = data.price - data.price * data.discount / 100

        if(!data.brand || data.brand === 'null' || data.brand === ''){
            data.brand = null;
        }

        if(!data.sellerId || data.sellerId === 'null' || data.sellerId === ''){
            data.sellerId = null;
        }

        if(!data.categories || data.categories === 'null' || data.categories === ''){
            data.categories = null;
        }
        if(!data.colors || data.colors === "null" || data.colors === ''){
            data.colors = null
        }else{
            if (Array.isArray(data.colors)) {
                const lowercaseColors = data.colors.map((color) => color.toLowerCase());
                const uniqueColors = new Set(lowercaseColors);
    
                if (uniqueColors.size !== lowercaseColors.length) {
                    throw { code: 409, message: "Duplicate color detected!" };
                }
    
                data.colors = Array.from(uniqueColors);
            }
        }

        data.updatedBy = req.authUser._id

        return data
    }

    store = async (data) => {
        try{
            const product = new ProductModel(data)

            return await product.save()
            
        } catch (error) {
            throw error
        }
    }

    count = async ({filter}) => {
        try{
            const countData = await ProductModel.countDocuments(filter)
            return countData
        } catch (error) {
            throw error
        }
    }

    listAll = async ({limit, skip, filter={}}) => {
        try{
            const response = await ProductModel.find(filter)
                .populate("categories", ["_id", "title", "slug"])
                .populate("brand", ["_id", "title", "slug"])
                .populate("shopId", ["_id", "name", "about", "sellerId", "profileImg", "phoneNumber", "email", "addressLine1", "addressLine2", "ratings"])
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
            const data = await ProductModel.findOne(filter)
                .populate("categories", ["_id", "title", "slug"])
                .populate("brand", ["_id", "title", "slug"])
                .populate("shopId", ["_id", "name", "about", "sellerId", "profileImg", "phoneNumber", "email", "addressLine1", "addressLine2", "ratings"])
                .populate("createdBy", ["_id","name","email","role"])
                .populate("updatedBy", ["_id","name","email","role"])
       
            if(!data) {
                throw {code: 400, message: 'Product not found'}
            }
            return data
        }catch (error) {
            throw error
        }
    }

    update = async (filter, data) => {
        try {
            const updateResponse = await ProductModel.findOneAndUpdate(filter, {$set: data},  {new: true} )

            return updateResponse
        } catch (error) {
            throw error
        }
    }

    deleteOne = async (filter) => {
        try{
            const res = await ProductModel.findOneAndDelete(filter)
            if(!res) {
                throw {code: 404, message: "Product does not exists"}
            }
            return res
        }catch (err) {
            throw err
        }
    }

    getForHome = async () => {
        try{
            const response = await ProductModel.find({
                status: "active",
            })
            .populate("categories", ["_id", "title", "slug"])
            .populate("brand", ["_id", "title", "slug"])
            .populate("sellerId", ["_id", "name", "email", "role"])
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

const productSvc = new ProductService()

module.exports = productSvc;
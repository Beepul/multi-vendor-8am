const productSvc = require("./product.service");

class ProductController {
    create = async (req, res, next) => {
        try {
            const payload = await productSvc.transformCreateData(req)

            const createdProduct = await productSvc.store(payload)

            res.json({
                result: createdProduct,
                message: "Product Created Successfully",
                meta: null
            })
        } catch (error) {
            next(error); 
        }
    }
    index = async (req, res, next) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 15
            const skip = (page - 1) * limit

            const shopId = req.query.shop

            let filter = {}

            const loggedInUser = req.authUser 

            if(req.query.search){
                filter = {
                    title: new RegExp(req.query.search, 'i')
                }
            }

            // if(loggedInUser.role === 'seller'){
            //     filter = {
            //         ...filter,
            //         shopId: req.shopDetail._id
            //     }
            // }

            if(shopId){
                filter = {
                    ...filter,
                    shopId: shopId
                }
            }

            const data = await productSvc.listAll({
                limit: limit,
                skip: skip,
                filter: filter
            })

            const countData = await productSvc.count({
                filter: filter
            })

            res.json({
                result: data,
                message: "Product List",
                meta: {
                    limit: limit,
                    page: page,
                    total: countData
                }
            })
        }catch (error) {
            next(error)
        }
    }
    show = async (req, res, next) => {
        try{
            const loggedInUser = await req.authUser 
            const shop = await req.shopDetail

            const id = req.params.id

            let filter = {
                _id: id
            }

            
            if(loggedInUser.role === 'seller'){
                filter ={
                    ...filter,
                    shopId: shop._id,
                }
            }

            const detail = await productSvc.findOne(filter)

            res.json({
                result: detail,
                message: "Product Detail fetched",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    update = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser
            const shop = req.shopDetail

            let filter = {
                _id: req.params.id
            }

            if(loggedInUser.role === 'seller'){
                filter ={
                    shopId: shop._id,
                }
            }
            const existingData = await productSvc.findOne(filter)
            const payload = productSvc.transformUpdateData(req, existingData)
            console.log(payload)
            const updateStats = await productSvc.update({
                _id: req.params.id
            }, payload)
            res.json({
                result: updateStats,
                message: "Product Updated Successfully",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    delete = async (req, res, next) => {
        try{

            const loggedInUser = req.authUser
            
            let filter = {
                _id: req.params.id
            }

            if(loggedInUser.role === 'seller'){
                filter ={
                    sellerId: loggedInUser._id,
                }
            }

            const existing = await productSvc.findOne(filter)

            const status = await productSvc.deleteOne({
                _id: req.params.id
            })

            res.json({
                result: status,
                message: "Product deleted successfully",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }

    listForHome = async (req, res, next) => {
        try{
            const list = await productSvc.getForHome()
            res.json({
                result: list,
                message: "Product List",
                meta: null
            })
        }catch(err) {
            next(err)
        }
    }

    getProductDetailBySlug = async (req, res, next) => {
        try{
            const slug = req.params.slug 
            const filter = {
                slug: slug,
                status: "active"
            }

            const productDetail = await productSvc.findOne(filter)

            const relatedFilter = {
                categories: {$in: productDetail.categories},
                _id: {$ne: productDetail._id},
                status: "active"
            }

            const relatedProduct = await productSvc.listAll({limit: 12, skip: 0, filter: relatedFilter})

            res.json({
                result: {
                    detail: productDetail,
                    relatedProduct: relatedProduct
                },
                message: "Product List",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }

    
}

const productCtrl = new ProductController()

module.exports = productCtrl;
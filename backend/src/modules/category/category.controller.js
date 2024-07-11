const productSvc = require("../product/product.service");
const categorySvc = require("./category.service");

class CategoryController {
    create = async (req, res, next) => {
        try {
            const payload = await categorySvc.transformCreateData(req)

            const createdCategory = await categorySvc.store(payload)

            res.json({
                result: createdCategory,
                message: "Category Created Successfully",
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

            const search = req.query.s 

            let filter = {
                limit: limit,
                skip: skip,
            }

            if(search){
                filter = {
                    ...filter,
                    title: new RegExp(search, 'i'),
                }
            }

            const data = await categorySvc.listAll(filter)

            const countData = await categorySvc.count()

            res.json({
                result: data,
                message: "Category List",
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
    // listOptions = async (req, res, next) => {
    //     try {
    //         const page = +req.query.page || 1
    //         const limit = +req.query.limit || 15
    //         const skip = (page - 1) * limit

    //         const search = req.query.s 

    //         let filter = {
    //             limit: limit,
    //             skip: skip,
    //         }

    //         if(search){
    //             filter = {
    //                 ...filter,
    //                 title: new RegExp(search, 'i'),
    //             }
    //         }

    //         const data = await categorySvc.listAll(filter)

    //         const countData = await categorySvc.count()

    //         res.json({
    //             result: data,
    //             message: "Category List",
    //             meta: {
    //                 limit: limit,
    //                 page: page,
    //                 total: countData
    //             }
    //         })
    //     }catch (error) {
    //         next(error)
    //     }
    // }
    show = async (req, res, next) => {
        try{
            const detail = await categorySvc.findOne({
                _id: req.params.id
            })

            res.json({
                result: detail,
                message: "Category Detail fetched",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    update = async (req, res, next) => {
        try{
            const existingData = await categorySvc.findOne({
                _id: req.params.id
            })
            const payload = categorySvc.transformUpdateData(req, existingData)
            const updateStats = await categorySvc.update({
                _id: req.params.id
            }, payload)
            res.json({
                result: updateStats,
                message: "Category Updated Successfully",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    delete = async (req, res, next) => {
        try{
            const existing = await categorySvc.findOne({
                _id: req.params.id
            })

            const status = await categorySvc.deleteOne({
                _id: req.params.id
            })

            res.json({
                result: status,
                message: "Category deleted successfully",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }

    listForHome = async (req, res, next) => {
        try{
            const list = await categorySvc.getForHome()
            res.json({
                result: list,
                message: "Category List",
                meta: null
            })
        }catch(err) {
            next(err)
        }
    }

    getCategoryBySlug = async (req, res, next) => {
        try{
            const slug = req.params.slug
            const detail = await categorySvc.findOne({
                slug: slug,
                status: "active"
            })
            const page = +req.query.page || 1
            const limit = +req.query.limit || 15
            const skip = (page - 1) * limit

            let filter = {
                status: "active",
                categories: {$in: [detail._id]}
            }

            if(req.query.search){
                filter = {
                    ...filter,
                    title: new RegExp(req.query.search, 'i'),
                    summary: new RegExp(req.query.search, 'i'),
                    description: new RegExp(req.query.search, 'i'),
                }
            }
            const total = await productSvc.count(filter)
            const relatedProducts = await productSvc.listAll({
                limit: limit, 
                skip: skip, 
                filter: filter
            })
            res.json({
                result: {
                    catDetail: detail,
                    productList: relatedProducts
                },
                message: "Category details with related products",
                meta: {
                    page: page,
                    limit: limit,
                    total: total
                }
            })
        }catch(err) {
            next(err)
        }
    }
}

const categoryCtrl = new CategoryController()

module.exports = categoryCtrl;
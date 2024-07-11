const productSvc = require("../product/product.service");
const brandSvc = require("./brand.service");

class BrandController {
    create = async (req, res, next) => {
        try {
            const payload = brandSvc.transformCreateData(req)

            const createdBrand = await brandSvc.store(payload)

            res.json({
                result: createdBrand,
                message: "Brand Created Successfully",
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

            const data = await brandSvc.listAll(filter)

            const countData = await brandSvc.count()

            res.json({
                result: data,
                message: "Brand List",
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
            console.log(req.params.id)
            const detail = await brandSvc.findOne({
                _id: req.params.id
            })

            res.json({
                result: detail,
                message: "Brand Detail fetched",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    update = async (req, res, next) => {
        try{
            const existingData = await brandSvc.findOne({
                _id: req.params.id
            })
            const payload = brandSvc.transformUpdateData(req, existingData)
            const updateStats = await brandSvc.update({
                _id: req.params.id
            }, payload)
            res.json({
                result: updateStats,
                message: "Brand Updated Successfully",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    delete = async (req, res, next) => {
        try{
            const existing = await brandSvc.findOne({
                _id: req.params.id
            })

            const status = await brandSvc.deleteOne({
                _id: req.params.id
            })

            res.json({
                result: status,
                message: "Brand deleted successfully",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }

    listForHome = async (req, res, next) => {
        try{
            const list = await brandSvc.getForHome()
            res.json({
                result: list,
                message: "Brand List",
                meta: null
            })
        }catch(err) {
            next(err)
        }
    }

    getBrandBySlug = async (req, res, next) => {
        try{
            const slug = req.params.slug
            const detail = await brandSvc.findOne({
                slug: slug,
                status: "active"
            })
            const page = +req.query.page || 1
            const limit = +req.query.limit || 15
            const skip = (page - 1) * limit

            let filter = {
                status: "active",
                brand: detail._id
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
                    brandDetail: detail,
                    productList: relatedProducts
                },
                message: "Brand detail with related products",
                meta: {
                    limit: limit,
                    page: page,
                    total: total
                }
            })
        }catch(err){
            next(err)
        }
    }
}

const brandCtrl = new BrandController()

module.exports = brandCtrl;
const bannerSvc = require("./banner.service");

class BannerController {
    create = async (req, res, next) => {
        try {
            const payload = bannerSvc.transformCreateData(req)

            const createdBanner = await bannerSvc.store(payload)

            res.json({
                result: createdBanner,
                message: "Banner Created Successfully",
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

            const data = await bannerSvc.listAll({
                limit: limit,
                skip: skip
            })

            const countData = await bannerSvc.count()

            res.json({
                result: data,
                message: "Banner List",
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
            const detail = await bannerSvc.findOne({
                _id: req.params.id
            })

            res.json({
                result: detail,
                message: "Banner Detail fetched",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    update = async (req, res, next) => {
        try{
            const existingData = await bannerSvc.findOne({
                _id: req.params.id
            })
            const payload = bannerSvc.transformUpdateData(req, existingData)
            const updateStats = await bannerSvc.update({
                _id: req.params.id
            }, payload)
            res.json({
                result: updateStats,
                message: "Banner Updated Successfully",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    delete = async (req, res, next) => {
        try{
            const existing = await bannerSvc.findOne({
                _id: req.params.id
            })

            const status = await bannerSvc.deleteOne({
                _id: req.params.id
            })

            res.json({
                result: status,
                message: "Banner deleted successfully",
                meta: null
            })
        }catch (err) {
            next(err)
        }
    }

    listForHome = async (req, res, next) => {
        try{
            const list = await bannerSvc.getForHome()
            res.json({
                result: list,
                message: "Banner List",
                meta: null
            })
        }catch(err) {
            next(err)
        }
    }
}

const bannerCtrl = new BannerController()

module.exports = bannerCtrl;
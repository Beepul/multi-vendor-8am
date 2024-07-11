const productSvc = require("../product/product.service")
const cartDetailSvc = require("./cart-detail.service")

class CartDetailController {
    addToCart = async(req, res, next) => {
        try{
            const {productId, quantity} = req.body

            const productDetail = await productSvc.findOne({
                _id: productId
            })
            
            const newCartObj = cartDetailSvc.transformCartObject(productDetail, quantity, req.authUser)

            // existing product in cart
                // quantity <= 0 
                    // delete 
                // else 
                    // update
            // not existing product in cart
                // create new cart
            const existing = await cartDetailSvc.findOne({
                status: "pending",
                productId: productId,
                buyerId: req.authUser._id,
                orderId: null
            })

            if(existing){
                if(quantity <= 0){
                    const removed = await cartDetailSvc.removeFromCart(existing._id)
                    res.json({
                        result: removed,
                        message: "Cart item removed successfully",
                        meta: null
                    })
                } else {
                    existing.quantity = quantity
                    existing.amount = productDetail.afterDiscount * quantity
                    existing.productDetail.price = productDetail.price
                    existing.productDetail.discount = productDetail.discount 
                    existing.productDetail.afterDiscount = productDetail.afterDiscount

                    const update = await existing.save()

                    res.json({
                        result: update,
                        message: "Cart Updated successfully",
                        meta: null
                    })
                }
            }else {
                if(quantity >= 1) {
                    const cart = await cartDetailSvc.createCart(newCartObj)
                    res.json({
                        result: cart,
                        message: "Product added in the cart successfully",
                        meta: null
                    })
                }else {
                    throw {code: 422, message: "Quantity should be always greater than or equal to 1"}
                }
            }
        }catch(err){
            next(err)
        }
    }

    listCart = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser 
            let filter = {
                orderId: null,
            }
            let cartItems = null


            if(loggedInUser.role === 'admin'){
                cartItems = await cartDetailSvc.findAll(filter)
            }else if (loggedInUser.role === 'seller'){
                filter = {
                    ...filter,
                    sellerId: loggedInUser._id,
                    sellerId: {$ne: null}
                }
                cartItems = await cartDetailSvc.findAll(filter)
            }else if (loggedInUser.role === 'customer'){
                filter = {
                    ...filter,
                    buyerId: loggedInUser._id
                }
                cartItems = await cartDetailSvc.findAll(filter)
            }

            res.json({
                result: cartItems,
                message: "Your cart list",
                meta: null
            })

        }catch(err){
            next(err)
        }
    }

    placeOrder = async (req, res, next) => {
        try{
            let {cartId, discount} = req.body 

            if(cartId.length <= 0){
                throw {code: 400, message: "Cart items required"}
            }

            const cartDetail = await cartDetailSvc.findAll({
                buyerId: req.authUser._id,
                _id: {$in: [...cartId]},
                orderId: null,
                status: "pending"
            })

            let order={
                buyerId: req.authUser._id,
                cartDetail: cartId,
                subTotal: 0,
                discountAmt: 0,
                discountPer: 0,
                deliveryCharge: 100,
                totalAmount: 0,
                isPaid: false,
                paymentMethod: "cod",
                status: "pending",
                createdBy: req.authUser._id
            }

            if(!cartDetail){
                throw {code: 400, message: "Cart does not exist anymore"}
            }

            let subTotal = 0;

            cartDetail.map((cartItem) => {
                subTotal += +cartItem.amount;
            })

            let disAmt = subTotal * discount / 100;

            const total = subTotal - disAmt + order.deliveryCharge

            order.subTotal = subTotal;
            order.discountPer = discount;
            order.discountAmt = disAmt;
            order.totalAmount = total;

            const orderDetail = await cartDetailSvc.placeOrder(order, cartId)

            res.json({
                result: orderDetail,
                message: "Order placed successfully",
                meta: null
            })

            
        }catch (err){
            next(err)
        }
    }

    listMyOrder = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser 
            let filter = {}

            if(loggedInUser.role === 'admin'){

            }else {
                filter = {
                    buyerId: loggedInUser._id
                }
            }

            if(req.query.status && ['pending',  'confirmed', 'cancelled', 'delivered'].indexOf(req.query.status)){
                filter = {
                   ...filter,
                    status: req.query.status
                }
            }

            const orderData = await cartDetailSvc.getOrderList(filter)

            res.json({
                result: orderData,
                message: "Your order list",
                meta: null
            })

        }catch(err){
            next(err)
        }
    }

    myOrderList = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser 
            let filter = {
                sellerId: loggedInUser._id,
                sellerId: {$ne: null}
            }

            if(req.query.status && ['ordered', 'cancelled', "completed"].indexOf(req.query.status)){
                filter = {
                   ...filter,
                    status: req.query.status
                }
            }

            const productItems = await cartDetailSvc.findAll(filter)

            res.json({
                result: productItems,
                message: "Your order list",
                meta: null
            })

        }catch (err) {
            next(err)
        }
    }

    updateOrderStatus = async (req, res, next) => {
        try{
            const loggedInUser = req.authUser 

            let cartDetailStatus = null

            if(loggedInUser.role === 'seller'){
                cartDetailStatus = await cartDetailSvc.updateCartDetail({
                    _id: req.params.id,
                    sellerId: loggedInUser._id 
                }, {
                    status: "completed"
                })
            }else {
                cartDetailStatus = await cartDetailSvc.updateOrderDetail({
                    _id: req.params.id
                }, {
                    status: "completed"
                })
            }

            res.json({
                result: cartDetailStatus,
                message: "Order status updated successfully",
                meta: null
            })
        }catch (err){
            next(err)
        }
    }
}

const cartDetailCtrl = new CartDetailController

module.exports = cartDetailCtrl
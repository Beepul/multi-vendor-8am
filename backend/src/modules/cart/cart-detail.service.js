const CartDetailModel = require('./cart-detail.model');
const OrderModel = require('./order.model');

class CartDetailService {
    transformCartObject = (product, quantity, user) => {
        const currentCartProduct = {
            buyerId: user._id,
            productId: product._id,
            orderId: null,
            productDetail: {
                title: product.title,
                slug: product.slug,
                price: product.price,
                afterDiscount: product.afterDiscount,
                discount: product.discount
            },
            quantity: quantity,
            amount: (product.afterDiscount * quantity),
            sellerId: product.sellerId,
            status: "pending",
            isPaid: false,
            createdBy: user._id,
            updatedBy: user._id
        }

        return currentCartProduct;
    }

    findOne = async (filter) => {
        try{
            const result = await CartDetailModel.findOne(filter)

            return result
        }catch(err){
            throw err 
        }
    }

    removeFromCart = async (id) => {
        try{
            const remove = await CartDetailModel.findByIdAndDelete(id)
            if(remove){
                return remove 
            }else {
                throw {code: 404, message: "Cart data does not exists"}
            }
        }catch (err){
            throw err
        }
    }

    createCart = async (data) => {
        try{
            const cart = new CartDetailModel(data)
            return await cart.save()
        }catch(err){
            throw err
        }
    }

    findAll = async (filter) => {
        try{
            const result = await CartDetailModel.find(filter)
                .populate('orderId')
                .populate('buyerId', ['_id', 'name', 'email', 'role'])
                .populate('productId')

            return result
        }catch(err){
            throw err
        }
    }

    placeOrder = async (data, cartId) => {
        try{
            const order = new OrderModel(data)
            await order.save()

            await CartDetailModel.updateMany({
                _id: {$in: [...cartId]}
            }, {
                $set: {
                    orderId: order._id,
                    status: "ordered"
                }
            })

            return order
        }catch(err){
            throw err
        }
    }

    getOrderList = async (filter) => {
        try{
            const orderList = await OrderModel.find(filter)
                .populate("buyerId", ["_id","name","email","phone","address"])
                .populate("cartDetail")
                .sort({"createdAt": "desc"})

            return orderList
        }catch (err) {
            throw err
        }
    }

    updateCartDetail = async (filter, updateBody) => {
        try{
            const status = await CartDetailModel.updateOne(filter, {
                $set: updateBody
            })

            return status
        }catch (err){
            throw err
        }
    }

    updateOrderDetail = async (filter, updateBody) => {
        try{
            const status = await OrderModel.updateOne(filter, {
                $set: updateBody
            })

            await this.updateCartDetail({
                orderId: filter._id,
                status: "ordered"
            }, {
                status: "completed"
            })

            return status
        }catch (err){
            throw err
        }
    }
}

const cartDetailSvc = new CartDetailService

module.exports = cartDetailSvc;
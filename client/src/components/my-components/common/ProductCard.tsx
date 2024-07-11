import { HiOutlineEye, HiOutlineShoppingCart } from "react-icons/hi2"
import RatingReview from "./RatingReview"
import { useState } from "react"


const ProductCard = ({product}: {product: any}) => {
    const [rating, setRating] = useState(2.5)
    return (
        <>
            <div className="bg-white rounded-lg p-3 shadow-md">
                <div className="relative mb-3">
                    <img src={product.image} alt={product.title} />
                    <div className="flex flex-col items-center absolute top-0 right-0 gap-3 text-lg">
                        <HiOutlineShoppingCart />
                        <HiOutlineEye />
                    </div>
                </div>
                <div>
                    <p className="mb-3 text-blue-800">{product.seller}</p>
                    <h4 className="mb-3 font-semibold">{product.title.split('').slice(0,48).join('')}...</h4>
                    <span className="inline-block mb-3 text-yellow-400">
                        <RatingReview 
                            rating={rating} 
                            setRating={setRating} 
                            readOnly={true} 
                            />
                    </span>
                    <div className="flex justify-between items-center font-semibold">
                        <p><span className="mr-1">{product.afterDiscount}$</span><sup className="text-sm text-red-500 -top-1"><del>{product.price}$</del></sup></p>
                        <p className="text-blue-800 ">{product.soldCount} sold</p>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default ProductCard
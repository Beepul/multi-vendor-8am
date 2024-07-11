import { GoShieldLock } from "react-icons/go"
import { HiOutlineArrowPath, HiOutlineShoppingCart } from "react-icons/hi2"
import { MdOutlinePriceCheck } from "react-icons/md"
import ContainerComponent from "./Container.component"

const ServicesComponent = () => {
    const services = [
        {title: "Free Shipping", description: "From all orders over 100$", icon: <HiOutlineShoppingCart className="text-[30px] text-blue-800" />},
        {title: "Daily Surprise Offer", description: "Save upto 25%", icon: <HiOutlineArrowPath className="text-[30px] text-blue-800" />},
        {title: "Affordable Prices", description: "Get Factory direct price", icon: <MdOutlinePriceCheck className="text-[30px] text-blue-800" />},
        {title: "Secure Payment", description: "100% protected payments", icon: <GoShieldLock className="text-[30px] text-blue-800" />},
    ]
    return (<>
        <ContainerComponent cn="lg:pt-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 bg-white py-10 px-8 rounded-md shadow-md">
                {
                    services.map((service,index) => (
                        <div key={index} className="rounded-lg flex items-center gap-4 justify-center">
                            <span className="flex-1 max-w-[30%] flex justify-center lg:inline-block lg:flex-none lg:max-w-none">{service.icon}</span>
                            <div className="flex-1">
                                <p className="font-semibold text-lg">{service.title}</p>
                                <p className="text-sm">{service.description}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </ContainerComponent>
    </>)
}


export default ServicesComponent
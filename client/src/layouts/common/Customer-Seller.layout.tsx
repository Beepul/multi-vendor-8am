import { NavLink } from "react-router-dom"
import ContainerComponent from "../../components/my-components/Container.component"
import { HiOutlineInbox, HiOutlineShoppingBag, HiOutlineUser, HiShoppingBag, HiUser } from "react-icons/hi2"
import { ReactNode, useEffect, useRef, useState } from "react"
import { GoGear } from "react-icons/go"
import { useAuth } from "../../context/auth.context"
import { MdOutlineAdminPanelSettings, MdOutlineCategory, MdOutlineSpaceDashboard } from "react-icons/md"
import {AiOutlineProduct} from "react-icons/ai"
import { RiAddCircleLine } from "react-icons/ri";
import { TbBrandSuperhuman } from "react-icons/tb";
import { LuArrowLeftSquare } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import DashboardLinkComponent from "../../components/my-components/dashboard/Dashboard-link.component"
import { useGetMyShop } from "../../api/Seller.api"
import { useMyShop } from "../../context/shop.context"
import LoaderComponent from "../../components/my-components/common/Loader.component"


export type DashboardActiveStats = "profile" | "orders" | "inbox" | "settings" | "shop-settings" | "products" | "dashboard" | "add-product" | "categories" | "brands" | "add-category"

type Props = {
    children: ReactNode,
    active?: DashboardActiveStats
}

const CustomerAndSellerLayout = ({children, active="profile"}: Props) => {
    const {loggedInUser} = useAuth()
    const [showFUllSidebar, setShowFUllSidebar] = useState(true)

    const {isShopLoading,setIsShopLoading,setShopDetail,shopDetail} = useMyShop()

    const {error,isLoading,myShop} = useGetMyShop(loggedInUser?.role as string)
    
    

    useEffect(() => {
        if(myShop){
            setShopDetail(myShop.result)
            setIsShopLoading(false)
        }
    },[myShop])

    if(loggedInUser?.role === 'seller' && isLoading){
        return (
            <div className="min-h-[550px] flex items-center justify-center">
                <LoaderComponent svgCn="h-24 w-24" color="#1e40af"/>
            </div>
        )
    }

    if(loggedInUser?.role === 'seller' && error){
        return (
            <div className="min-h-[550px] flex items-center justify-center">
                <p className="text-2xl font-semibold max-w-[350px]">Could not get your shop details, Please try again later</p>
            </div>
        )
    }

    return (
        <section className={`bg-gray-50 ${loggedInUser?.role === "seller" ? 'py-0' : 'py-10'} `}>
            <ContainerComponent cn={`${loggedInUser?.role === 'seller' && 'max-w-full lg:py-0'}`} fluid >
                <div className="flex gap-7">
                    <aside 
                        className="bg-white shadow-xl rounded-md overflow-hidden">
                        <div className={`flex items-center justify-between bg-blue-700 p-4 text-white ${showFUllSidebar && 'px-7'} transition-all duration-300`}>
                            {showFUllSidebar && <p className="font-semibold">Menus</p> }
                            <button
                                onClick={() => setShowFUllSidebar(!showFUllSidebar)}
                                className={`${!showFUllSidebar && 'rotate-180'} transition-all duration-300`}
                            >
                                <LuArrowLeftSquare className="text-xl" />
                            </button>
                        </div> 
                        <ul className={`p-4 ${showFUllSidebar && 'px-7'} transition-all duration-300`}>
                            {
                                loggedInUser?.role === 'customer' ? (
                                    <li>
                                        <DashboardLinkComponent 
                                            link={'/'+loggedInUser?.role}
                                            showFUllSidebar={showFUllSidebar}
                                            active={active}
                                            compareActive="profile"
                                            linkText="Profile"
                                            icon={<HiOutlineUser className="text-xl"/>}
                                        />
                                    </li>
                                ) : loggedInUser?.role === 'seller' ? (
                                    <li>
                                        <DashboardLinkComponent 
                                            link={'/'+loggedInUser?.role}
                                            showFUllSidebar={showFUllSidebar}
                                            active={active}
                                            compareActive="dashboard"
                                            linkText="Dashboard"
                                            icon={<MdOutlineSpaceDashboard className="text-xl"/>}
                                        />
                                    </li>
                                ) : <></>
                            }
                            <li>
                                <DashboardLinkComponent 
                                    link={`/${loggedInUser?.role}/orders`}
                                    showFUllSidebar={showFUllSidebar}
                                    active={active}
                                    compareActive="orders"
                                    linkText="All Orders"
                                    icon={<HiOutlineShoppingBag className="text-xl"/>}
                                />
                            </li>
                            <li>
                                <DashboardLinkComponent 
                                    link={'/account/inbox'}
                                    showFUllSidebar={showFUllSidebar}
                                    active={active}
                                    compareActive="inbox"
                                    linkText="Inbox"
                                    icon={<HiOutlineInbox className="text-xl"/>}
                                />
                            </li>
                            {
                                loggedInUser?.role === "seller" &&
                                <>
                                    <li>
                                        <DashboardLinkComponent 
                                            link={'/seller/products'}
                                            showFUllSidebar={showFUllSidebar}
                                            active={active}
                                            compareActive="products"
                                            linkText="All Products"
                                            icon={<AiOutlineProduct className="text-xl"/>}
                                        />
                                    </li>
                                    <li>
                                        <DashboardLinkComponent 
                                            link={'/seller/categories'}
                                            showFUllSidebar={showFUllSidebar}
                                            active={active}
                                            compareActive="categories"
                                            linkText="All Categories"
                                            icon={<MdOutlineCategory className="text-xl"/>}
                                        />
                                    </li>
                                    <li>
                                        <DashboardLinkComponent 
                                            link={'/seller/brands'}
                                            showFUllSidebar={showFUllSidebar}
                                            active={active}
                                            compareActive="brands"
                                            linkText="All Brands"
                                            icon={<TbBrandSuperhuman className="text-xl"/>}
                                        />
                                    </li>
                                    <li>
                                        <DashboardLinkComponent 
                                            link={'/seller/shop-settings'}
                                            showFUllSidebar={showFUllSidebar}
                                            active={active}
                                            compareActive="shop-settings"
                                            linkText="Shop Settings"
                                            icon={<MdOutlineAdminPanelSettings className="text-xl"/>}
                                        />
                                    </li>
                                
                                </>
                            }
                            <li>
                                <DashboardLinkComponent 
                                    link={'/account/settings'}
                                    showFUllSidebar={showFUllSidebar}
                                    active={active}
                                    compareActive="settings"
                                    linkText="Settings"
                                    icon={<GoGear className="text-xl"/>}
                                />
                            </li>
                        </ul>
                    </aside>
                    <main className={`px-7 rounded-lg flex-1`}>
                        {children}
                    </main>
                </div>    
            </ContainerComponent> 
        </section>
    )
}

export default CustomerAndSellerLayout
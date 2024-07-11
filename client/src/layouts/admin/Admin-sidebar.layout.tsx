import { LazyLoadImage } from "react-lazy-load-image-component"
import logo from "../../assets/market-matrix-logo-yellow.png"
import { Button } from "../../components/ui/button"
import { AlignJustify, Home, Proportions } from "lucide-react"
import DashboardLinkComponent from "../../components/my-components/dashboard/Dashboard-link.component"
import { MdOutlineAdminPanelSettings, MdOutlineLibraryAdd, MdOutlineProductionQuantityLimits, MdOutlineSpaceDashboard } from "react-icons/md"
import { NavLink } from "react-router-dom"
import { TfiLayoutCtaCenter } from "react-icons/tfi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { CommandSeparator } from "../../components/ui/command"
import { LiaLuggageCartSolid } from "react-icons/lia";
import { AiOutlineProduct, AiOutlineUserAdd } from "react-icons/ai"
import { TbBrandProducthunt, TbCategory2, TbCategoryPlus, TbCircleLetterB, TbLetterB } from "react-icons/tb"
import { BsNodePlus } from "react-icons/bs";
import { PiUsersThree } from "react-icons/pi";




const AdminSideBarLayout = ({active}: {active: string}) => {
    let showFUllSidebar = true
    return (<>
        <aside className="min-h-screen bg-blue-950 py-4 px-8 text-white w-64">
            <ul>
                <li className="pb-2 mb-2">
                    <span className="text-xs text-gray-300 font-semibold mb-2 inline-block">Overview</span>
                    <div className="pl-3">
                        <NavLink to={'/admin'} className={`flex items-center gap-1 text-sm ${active === 'dashboard' && 'text-yellow-300'}`}>
                            <MdOutlineSpaceDashboard className="text-lg"/>
                            Dashboard
                        </NavLink>
                    </div>
                </li>
                <li className="pb-4">
                    <span className="text-xs text-gray-300 font-semibold mb-2 inline-block">Shop</span>
                    <div className="pl-3 mb-4">
                        <NavLink to={'/admin/users'} className={`flex items-center gap-1 text-sm ${active === 'users' && 'text-yellow-300'}`}>
                            <PiUsersThree className="text-lg"/>
                            Users
                        </NavLink>
                    </div>
                    <div className="pl-3 mb-4">
                        <NavLink to={'/admin/add-user'} className={`flex items-center gap-1 text-sm ${active === 'user' && 'text-yellow-300'}`}>
                            <AiOutlineUserAdd className="text-lg"/>
                            Add User
                        </NavLink>
                    </div>
                    <div className="pl-3 mb-4">
                        <NavLink to={'/admin/orders'} className={`flex items-center gap-1 text-sm ${active === 'orders' && 'text-yellow-300'}`}>
                            <LiaLuggageCartSolid className="text-lg"/>
                            Orders
                        </NavLink>
                    </div>
                    <div className="pl-3 mb-4">
                        <NavLink to={'/admin/products'} className={`flex items-center gap-1 text-sm ${active === 'products' && 'text-yellow-300'}`}>
                            <TbBrandProducthunt className="text-lg"/>
                            Products
                        </NavLink>
                    </div>
                    <div className="pl-3 mb-4">
                        <NavLink to={'/admin/add-product'} className={`flex items-center gap-1 text-sm ${active === 'add-product' && 'text-yellow-300'}`}>
                            <MdOutlineLibraryAdd className="text-lg"/>
                            Add Product
                        </NavLink>
                    </div>
                    <div className="pl-3 mb-4">
                        <NavLink to={'/admin/categories'} className={`flex items-center gap-1 text-sm ${active === 'categories' && 'text-yellow-300'}`}>
                            <TbCategory2 className="text-lg"/>
                            Categories
                        </NavLink>
                    </div>
                    <div className="pl-3">
                        <NavLink to={'/admin/brands'} className={`flex items-center gap-1 text-sm ${active === 'brands' && 'text-yellow-300'}`}>
                            <TbCircleLetterB className="text-lg"/>
                            Brands
                        </NavLink>
                    </div>
                    
                </li>
                <li>
                    <span className="text-xs text-gray-300 font-semibold mb-2 inline-block">UI</span>
                    <div className="pl-3">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" className="border-0">
                                <AccordionTrigger className="font-normal hover:no-underline py-0 pb-2">
                                    <div className="flex items-center gap-1">
                                        <Home size={16}/>
                                        Layouts
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-6">
                                    <NavLink to={'/admin/banner'} className={`flex items-center gap-1 text-sm ${active === 'banner' && 'text-yellow-300'}`}>
                                        <TfiLayoutCtaCenter className="text-lg"/>
                                        Banner
                                    </NavLink>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </li>
                <li>
                    <span className="text-xs text-gray-300 font-semibold mb-2 inline-block">Settings</span>
                    <div className="pl-3">
                        <NavLink to={'/admin/settings'} className={`flex items-center gap-1 text-sm ${active === 'settings' && 'text-yellow-300'}`}>
                            <MdOutlineAdminPanelSettings className="text-lg"/>
                            Account Settings
                        </NavLink>
                    </div>
                </li>
            </ul>
        </aside>
    </>)
}

export default AdminSideBarLayout
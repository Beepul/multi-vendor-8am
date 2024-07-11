import { NavLink } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip"
import { DashboardActiveStats } from "../../../layouts/common/Customer-Seller.layout"

type Props = {
    link: string,
    showFUllSidebar: boolean,
    active: DashboardActiveStats,
    compareActive: DashboardActiveStats,
    linkText: string,
    icon: any
}

const DashboardLinkComponent = ({link, showFUllSidebar, active, linkText, icon, compareActive}: Props) => {
    return (
        <>
            <NavLink to={link} className={`flex items-center gap-2 font-medium py-3 ${showFUllSidebar && 'pr-20'} ${active === compareActive ? 'text-blue-800' : ''} transition-all duration-300`}>
                {showFUllSidebar ? (
                    <>
                        {icon}
                        <span className="transition-all duration-300">{linkText}</span>
                    </>
                ) : (
                    <>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    {icon} 
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{linkText}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                )}
            </NavLink>
        </>
    )
}

export default DashboardLinkComponent
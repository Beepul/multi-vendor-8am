import { NavLink } from "react-router-dom"

type Props = {
    icon: any,
    title: string,
    stats: string,
    link?: string,
    linkTitle?: string
}
const OverviewCardComponent = ({icon, title, stats, link, linkTitle}: Props) => {
    return (
        <>
            <div className="bg-white shadow-lg py-5 px-6 rounded-md">
                <div className="flex gap-2 flex-col">
                    <div className="flex gap-5 items-center">
                        <span className="text-2xl p-4 bg-indigo-50 rounded-full h-fit">
                            {icon}
                        </span>
                        <div className="flex-1">
                            <p className="font-semibold text-2xl pb-2 border-b border-gray-100 mb-2 ">{stats}</p>
                            <p className="font-semibold text-lg ">{title}</p>
                        </div>
                    </div>
                    {(link && linkTitle) ? (<>
                        <NavLink to={link} className={'w-fit text-blue-800 font-medium text-sm'}>{linkTitle}</NavLink>
                    </>) : null}
                </div>
            </div>
        </>
    )
}

export default OverviewCardComponent
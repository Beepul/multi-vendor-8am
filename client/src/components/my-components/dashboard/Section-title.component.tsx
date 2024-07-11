import { NavLink } from "react-router-dom"
import { useAuth } from "../../../context/auth.context"

const SectionTitleComponent = ({title,link,linkText}: {title: string, link?: string, linkText?: any}) => {
    const {loggedInUser} = useAuth()
    return (
        <>
            <div className="pb-5 border-b border-gray-200 mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{title}</h2>
                {(link && linkText) && (
                    <NavLink to={link} className={'bg-blue-800 py-2 px-3 leading-none rounded border border-blue-800 text-white hover:bg-transparent hover:text-blue-800 focus:bg-blue-800 focus:text-white transition-all duration-300 text-sm'}>{linkText}</NavLink>
                )}
            </div>
        </>
    )
}

export default SectionTitleComponent
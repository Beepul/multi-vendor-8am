import { Outlet } from "react-router-dom"
import HeaderLayout from "./Header.layout"
import FooterLayout from "./Footer.layout"

const PublicLayout = () => {
    return (
        <>
            <HeaderLayout />
            <Outlet />
            <FooterLayout />
        </>
    )
}

export default PublicLayout
import { Outlet } from "react-router-dom"
import AdminHeaderLayout from "./Admin-header.layout"
import AdminFooterLayout from "./Admin-footer.layout"
import AdminSideBarLayout from "./Admin-sidebar.layout"
import { ReactNode } from "react"


const AdminLayout = ({active, children}: {active: string, children: ReactNode}) => {
    return (
        <>
            <section>
                <AdminHeaderLayout />
                <main className="flex">
                    <AdminSideBarLayout active={active} />
                    <div className="bg-slate-50 flex-1 px-10">
                        {children}
                    </div>
                </main>
            </section>
        </>
    )
}

export default AdminLayout
import AdminSideBarLayout from "./Admin-sidebar.layout"
import { ReactNode } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { logoYellow } from "../../assets"
import { Button } from "../../components/ui/button"
import { useAuth } from "../../context/auth.context"


const AdminLayout = ({active, children}: {active: string, children: ReactNode}) => {
    const {loggedInUser} = useAuth()
    return (
        <>
            <section className="">
                <main className="relative">
                    <div className="fixed top-0 left-0 bottom-0 bg-blue-950">
                        <div className="flex items-center justify-between gap-16 bg-blue-950 py-4 px-8 w-64">
                            <LazyLoadImage src={logoYellow} alt="Market Matrix" width={80} />
                            <Button size={'icon'} variant={'ghost'} className="p-0 h-auto hover:bg-transparent flex flex-col gap-[5px] group w-[22px] items-end ">
                                <span className="border-[1.5px] border-white w-full"/>
                                <span className="border-[1.5px] border-white w-2/4 group-hover:w-full transition-all duration-300"/>
                                <span className="border-[1.5px] border-white w-3/4 group-hover:w-full transition-all duration-300"/>
                            </Button>
                        </div>
                        <AdminSideBarLayout active={active} />
                    </div>
                    <div className="bg-slate-50">
                        <div className="py-4 px-10 bg-white flex justify-end">
                            {loggedInUser?.name}
                        </div>
                        <div className="pl-72 pr-10 min-h-[92vh]">
                            {children}
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}

export default AdminLayout
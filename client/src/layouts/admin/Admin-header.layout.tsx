import { AlignJustify } from "lucide-react"
import { useAuth } from "../../context/auth.context"
import { Button } from "../../components/ui/button"
import { LazyLoadImage } from "react-lazy-load-image-component"
import logo from "../../assets/market-matrix-logo-yellow.png"

const AdminHeaderLayout = () => {
    const {loggedInUser} = useAuth()
    return (<>
        <header className="flex justify-between items-center shadow-md">
            <div className="flex items-center justify-between gap-16 bg-blue-950 py-4 px-8 w-64">
                <LazyLoadImage src={logo} alt="Market Matrix" width={70} />
                <Button size={'icon'} variant={'ghost'} className="p-0 h-auto hover:bg-transparent flex flex-col gap-[5px] group w-[22px] items-end ">
                    <span className="border-[1.5px] border-white w-full"/>
                    <span className="border-[1.5px] border-white w-2/4 group-hover:w-full transition-all duration-300"/>
                    <span className="border-[1.5px] border-white w-3/4 group-hover:w-full transition-all duration-300"/>
                </Button>
            </div>
            <div className="py-4 px-10">
                {loggedInUser?.name}
            </div>
        </header>
    </>)
}

export default AdminHeaderLayout
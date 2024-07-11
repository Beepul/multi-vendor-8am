import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { useAuth } from "../../../context/auth.context"
import { Button } from "../../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { NavLink } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../ui/alert-dialog"
import LoaderComponent from "./Loader.component"
import { Brand, Category, Product } from "../../../types"

type Props = {
    openDropDown: boolean
    setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    data: Brand | Category | Product,
    dataType: 'brand' | 'category' | 'product'
    deleteHandler: (id: string) => void
    deleteLoading: boolean
}

const TableActions = ({
    openDropDown,
    setOpenDropDown,
    openDialog,
    setOpenDialog,
    data,
    dataType,
    deleteHandler,
    deleteLoading,
}: Props) => {
    const {loggedInUser} = useAuth()

    return (
        <DropdownMenu open={openDropDown} onOpenChange={setOpenDropDown}>
            <DropdownMenuTrigger asChild onClick={() => setOpenDropDown(!openDropDown)}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <Eye height={14} />View
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <NavLink to={"/"+loggedInUser?.role+`/edit-${dataType}/`+data._id} className="flex gap-1 items-center w-full">
                        <Edit height={13}/> Edit
                    </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                        <AlertDialogTrigger asChild>
                            <button className="flex gap-1 items-center">
                                <Trash height={14}/> Delete
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your category
                                    and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild onClick={(e) => e.preventDefault()}>
                                    <button 
                                        onClick={() => {
                                            deleteHandler(data._id)
                                        }}
                                        disabled={deleteLoading}
                                        className={`${deleteLoading ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center gap-2`}
                                    >
                                        Continue
                                        {
                                            deleteLoading && (
                                                <LoaderComponent 
                                                    color="#ffffff"
                                                    svgCn="h-4 w-4"
                                                />
                                            )
                                        }
                                    </button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default TableActions
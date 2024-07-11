import { useEffect, useMemo, useState } from "react"
import { useGetAllBrands } from "../../api/Brand.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import DataTableComponent from "../../components/my-components/common/data-table.component"
import AllBrandsComponent from "../../components/my-components/dashboard/AllBrands.component"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { Brand, Category } from "../../types"
import { getFormattedDate, getFormattedTime } from "../../lib/utils"
import { LazyLoadImage } from "react-lazy-load-image-component"
import imagePlaceholder from "../../assets/placeholder-image.png"
import { TiTick } from "react-icons/ti"
import { Cross, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../../components/ui/button"
import { HiArrowsUpDown } from "react-icons/hi2"
import { useDeleteCategory, useGetAllCategories } from "../../api/Category.api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { NavLink } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { toast } from "react-toastify"
import TableActions from "../../components/my-components/common/table-actions.component"

const AdminAllCategoriesPage = () => {
    const {loggedInUser} = useAuth()
    // const {allCats, isLoading, error, refetch} = useGetAllCategories()

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // current page number --> page
        pageSize: 5, // number of data per page --> limit
    })

    const {error,isLoading,allCats, refetch} = useGetAllCategories({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    })

    const catCols = useMemo<ColumnDef<Category>[]>(() => {
        return [
            {
                header: "Image",
                accessorKey: "image",
                cell: ({row}) => {
                    const image:string = row.getValue("image")
                    const imageURL = import.meta.env.VITE_IMAGE_URL + "/uploads/category/" + image;

                    return (
                        <div className="">
                            <LazyLoadImage 
                                src={imageURL}
                                className="w-20 h-20 object-cover"
                                alt=""
                                crossOrigin="anonymous"
                                onError={(e) => e.currentTarget.src = imagePlaceholder}
                                effect="blur"
                            />
                        </div>
                    )
                }
            },
            {
                accessorKey: "title",
                header: ({ column }) => {
                    return (
                      <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                        Title
                        <HiArrowsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )
                },
                cell: ({row}) => {
                    const title: string = row.getValue("title")

                    return <>
                        <span className="inline-block min-w-[150px] capitalize">{title.length > 25 ? title.split("").slice(0,25).join("")+'...' : title}</span>
                    </>
                }
            },
            {
                header: ({ column }) => {
                    return (
                        <div className="flex justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Status
                                <HiArrowsUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )
                },
                accessorKey: "status",
                cell: ({row}) => {
                    const status:string = row.getValue("status")
                    return <>
                        <div className="text-center min-w-[120px]">
                            <span className={`capitalize text-white py-1 px-2 rounded-lg text-xs ${status === "inactive" ? 'bg-red-400' : 'bg-green-400'}`}>{status === "inactive" ? "Unpublish" : "Published"}</span>
                        </div>
                    </>
                }
            },
            {
                header: () => <div className="text-center">Parent Category</div>,
                accessorKey: "parentId",
                cell: ({row}) => {
                    return (
                        <div className="text-center capitalize">
                            {row.original.parentId?.title}
                        </div>
                    )
                }
            },
            {
                header: "Created At",
                accessorKey: "createdAt",
                cell: ({row}) => {
                    return (
                        <>
                            <p className="capitalize">{getFormattedTime(row.original.createdAt)}</p>
                            <p className="capitalize">{getFormattedDate(row.original.createdAt)}</p>
                        </>
                    )
                }
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    const [openDialog, setOpenDialog] = useState(false)
                    const [openDropDown, setOpenDropDown] = useState(false)
                    const category = row.original

                    const {deleteCategory,deleteErr,deleteLoading,deleteSuccess} = useDeleteCategory()

                    const handleCategoryDelete = (id:string) => {
                        deleteCategory(id)
                        // console.log(id)
                    }

                    useEffect(() => {
                        if(!deleteSuccess && deleteErr){
                            toast.error((deleteErr as any).message, {
                                draggable: true, 
                                closeOnClick: true 
                            })
                            return 
                        }
                        if(deleteSuccess){
                            toast.success("Category deleted successfully", {
                                draggable: true, 
                                closeOnClick: true 
                            })
                            setOpenDialog(!openDialog)
                            setOpenDropDown(!openDropDown)
                            return 
                        }
                    }, [deleteSuccess, deleteErr])
                    return (
                        <TableActions 
                            openDialog={openDialog}
                            setOpenDialog={setOpenDialog}
                            openDropDown={openDropDown}
                            setOpenDropDown={setOpenDropDown}
                            data={category}
                            dataType="category"
                            deleteHandler={handleCategoryDelete}
                            deleteLoading={deleteLoading}
                        />
                    )
                },
            }
        ]
    }, [])

    useEffect(() => {
        refetch()
    },[pagination])

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={loggedInUser?.role === 'seller' ? 'All Of Your Categories' : 'All Categories'}
                    link={`/${loggedInUser?.role}/add-category`}
                    linkText="Add new category"
                />
                {
                    isLoading ? <>
                        <div className="min-h-[400px] flex items-center justify-center">
                            <LoaderComponent color="#1e40af" svgCn="h-24 w-24" />
                        </div>
                    </> : error ? <>
                        <div className="min-h-[400px] flex items-center justify-center">
                            <p className="text-lg font-semibold text-blue-800">Something went wrong!</p>
                        </div>
                    </> : 
                        <div className="">
                            <DataTableComponent 
                                columns={catCols as ColumnDef<unknown, any>[]}
                                data={(allCats?.result || []) as any[]}
                                pagination={pagination}
                                setPagination={setPagination}
                                meta={allCats?.meta}
                                searchable={{field: "title"}}
                            />
                        </div>
                }
            </section>
        </>
    )
}

export default AdminAllCategoriesPage


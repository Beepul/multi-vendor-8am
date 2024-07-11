import { useEffect, useMemo, useState } from "react"
import { useDeleteBrand, useGetAllBrands } from "../../api/Brand.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import DataTableComponent from "../../components/my-components/common/data-table.component"
import AllBrandsComponent from "../../components/my-components/dashboard/AllBrands.component"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { Brand } from "../../types"
import { getFormattedDate, getFormattedTime } from "../../lib/utils"
import { LazyLoadImage } from "react-lazy-load-image-component"
import imagePlaceholder from "../../assets/placeholder-image.png"
import { TiTick } from "react-icons/ti"
import { Cross, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../../components/ui/button"
import { HiArrowsUpDown } from "react-icons/hi2"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { NavLink } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { toast } from "react-toastify"
import TableActions from "../../components/my-components/common/table-actions.component"


const AdminAllBrandsPage = () => {
    const {loggedInUser} = useAuth()

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // current page number --> page
        pageSize: 5, // number of data per page --> limit
    })

    const {brandsData, isLoading, error, refetch} = useGetAllBrands({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    })

    const brandCols = useMemo<ColumnDef<Brand>[]>(() => {
        return [
            {
                header: "Image",
                accessorKey: "image",
                cell: ({row}) => {
                    const image:string = row.getValue("image")
                    const imageURL = import.meta.env.VITE_IMAGE_URL + "/uploads/brands/" + image;

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
                            <span className={`capitalize text-white py-1 px-2 rounded-lg text-xs ${status === "inactive" ? 'bg-red-400' : 'bg-green-400'}`}>{status}</span>
                        </div>
                    </>
                }
            },
            {
                header: () => <div className="text-center">Home Section</div>,
                accessorKey: "homeSection",
                cell: ({row}) => {
                    const isVisible = row.getValue("homeSection")
                    return (
                        <div className="text-center">
                            <span className={`${!isVisible ? 'bg-red-400' : 'bg-green-400'} inline-block p-2 rounded-md`}>
                                {
                                    isVisible ? 
                                        <TiTick className="text-lg text-white" /> 
                                    : <>
                                        <Cross 
                                            className="text-white fill-white rotate-45" 
                                            height={16} 
                                            width={16} 
                                            strokeWidth={0} 
                                        />
                                    </>
                                }
                            </span>
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
                    const brand = row.original

                    const {deleteBrand,deleteErr,deleteLoading,deleteSuccess} = useDeleteBrand()

                    const handleBrandDelete = (id:string) => {
                        deleteBrand(id)
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
                            toast.success("Brand deleted successfully", {
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
                            data={brand}
                            dataType="brand"
                            deleteHandler={handleBrandDelete}
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
                    title={loggedInUser?.role === 'seller' ? 'All Of Your Brands' : 'All Brands'}
                    link={`/${loggedInUser?.role}/add-brand`}
                    linkText="Add new brand"
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
                                columns={brandCols as ColumnDef<unknown, any>[]}
                                data={(brandsData?.result || []) as any[]}
                                pagination={pagination}
                                setPagination={setPagination}
                                meta={brandsData?.meta}
                                searchable={{field: "title"}}
                            />
                        </div>
                }
            </section>
        </>
    )
}

export default AdminAllBrandsPage


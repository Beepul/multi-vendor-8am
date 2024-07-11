import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/auth.context"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useDeleteProduct, useGetAllProducts } from "../../api/Product.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { useMyShop } from "../../context/shop.context"
import { useEffect, useMemo, useState } from "react"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { Brand, Product } from "../../types"
import DataTableComponent from "../../components/my-components/common/data-table.component"
import { Button } from "../../components/ui/button"
import { HiArrowsUpDown } from "react-icons/hi2"
import {LazyLoadImage as Image} from "react-lazy-load-image-component"
import imagePlaceholder from "../../assets/placeholder-image.png"
import { TiTick, TiTickOutline } from "react-icons/ti";
import { Cross, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { CiMedicalCross } from "react-icons/ci"
import { getFormattedDate, getFormattedTime } from "../../lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import PreviewProductComponent from "../../components/my-components/PreviewProduct.component"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { toast } from "react-toastify"
import TableActions from "../../components/my-components/common/table-actions.component"


const AllProductsPage = () => {
    const {loggedInUser} = useAuth()
    const {shopDetail} = useMyShop()

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // current page number --> page
        pageSize: 5, // number of data per page --> limit
    })

    const {error,isLoading,isSuccess,myProducts, refetch} = useGetAllProducts({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        shopId: loggedInUser?.role === 'seller' ? shopDetail?._id : null 
    })

    const productColumns = useMemo<ColumnDef<Product>[]>(() => {
        return [
            {
                header:() => <div className="text-center">Image</div>,
                accessorKey: "images",
                cell: ({ cell, row }) => {
                    const images: string[] = row.getValue("images")
                    const imageURL = import.meta.env.VITE_IMAGE_URL + "/uploads/product/" + (images[0] || images[1]);
                    
                    return <div className="flex justify-center min-w-[100px]">
                        <Image 
                            src={imageURL}
                            className="w-20 h-20 object-cover"
                            alt=""
                            crossOrigin="anonymous"
                            onError={(e) => e.currentTarget.src = imagePlaceholder}
                            effect="blur"
                        />
                    </div>
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
                header: () => <div className="text-center">Stock</div>,
                accessorKey: "stock",
                cell: ({row}) => {
                    return (
                        <div className={`${row.original.stock <= 0 ? 'min-w-[100px]' : ''} text-center`}>
                            {
                                row.original.stock <= 0 ? <span className={`capitalize text-white py-1 px-2 rounded-lg text-xs bg-red-400`}>Out of stock</span> :
                                <p className="text-center">{row.original.stock}</p>
                            }
                        </div>
                    )
                }
            },
            {
                header:() => <div className="text-center">Price</div>,
                accessorKey: "price",
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue("price"))
               
                    // Format the amount as a dollar amount
                    const formatted = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(amount)
               
                    return <div className="text-center font-medium min-w-[100px]">{formatted}</div>
                },
            },
            {
                header: () => <div className="text-center">Discount</div>,
                accessorKey: "discount",
                cell: ({row}) => {
                    return <div className="text-center">{row.getValue("discount")}%</div>
                }
            },
            {
                header: () => <div className="text-center">After Discount</div>,
                accessorKey: "afterDiscount",
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue("afterDiscount"))
               
                    // Format the amount as a dollar amount
                    const formatted = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(amount)
               
                    return <div className="text-center font-medium min-w-[120px]">{formatted}</div>
                },
            },
            {
                header: () => <div className="">Brand</div>,
                accessorKey: "brand",
                cell: ({row}) => {
                    const brand: Brand | null = row.getValue("brand")
                    if(brand) return <div className="capitalize min-w-[100px]">{brand.title}</div>
                }
            },
            {
                header: () => <div className="text-center">Colors</div>,
                accessorKey: "colors",
                cell: ({row}) => {
                    const colors = row.original.colors
                    return <div className="capitalize min-w-[100px] text-center">
                        {
                            colors?.map((color,i) => (
                                <span key={i}>{color}{colors[colors.length - 1] != color && ', '}</span>
                            ))
                        }
                    </div>
                }
            },
            {
                header: "Featured",
                accessorKey: "isFeatured",
                cell: ({row}) => {
                    const isFeatured = row.getValue("isFeatured")

                    return <div className="text-center"><span className={`${!isFeatured ? 'bg-red-400' : 'bg-green-400'} inline-block p-2 rounded-md`}>{isFeatured ? <TiTick className="text-lg text-white" /> : <><Cross className="text-white fill-white rotate-45" height={16} width={16} strokeWidth={0} /></>}</span></div>
                }
            },
            {
                header:({column}) => {
                    return (
                        <div className="flex justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                            Created At
                            <HiArrowsUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )
                },
                accessorKey: "createdAt",
                cell: ({row}) => {
                    const date: string = row.getValue("createdAt")

                    const formattedDate = getFormattedDate(date)
                    const time = getFormattedTime(date)

                    return <div className="text-center min-w-[120px]">{time}<br/>{formattedDate}</div>
                }
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    const [openDialog, setOpenDialog] = useState(false)
                    const [openDropDown, setOpenDropDown] = useState(false)
                    const product = row.original

                    const {deleteErr,deleteLoading,deleteSuccess, deleteProduct} = useDeleteProduct()

                    const handleProductDelete = (id:string) => {
                        deleteProduct(id)
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
                            toast.success("Product deleted successfully", {
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
                            data={product}
                            dataType="product"
                            deleteHandler={handleProductDelete}
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

    console.log(myProducts)

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={loggedInUser?.role === 'seller' ? 'All Of Your Products' : 'All Products'}
                    link={`/${loggedInUser?.role}/add-product`}
                    linkText="Add new product"
                />
                {
                    isLoading ? 
                        <div className="min-h-[500px] flex items-center justify-center">
                            <LoaderComponent svgCn="h-24 w-24" color="#1e40af" />
                        </div> : 
                    error ? 
                        <div className="min-h-[500px] flex items-center justify-center">
                            <p className="text-center text-lg font-semibold capitalize">{(error as any).message}</p>
                        </div> 
                    : <>
                        <div>
                            <DataTableComponent 
                                columns={productColumns as ColumnDef<unknown, any>[]}
                                data={myProducts?.result || []}
                                pagination={pagination}
                                setPagination={setPagination}
                                meta={myProducts?.meta}
                                searchable={{field: "title"}}
                            />
                            {/* <ProductTableComponent /> */}
                        </div>
                    </>
                }
            </section>
        </>
    )
}

export default AllProductsPage


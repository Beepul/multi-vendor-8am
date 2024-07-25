import { useEffect, useMemo, useState } from "react"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { useDeleteUser, useGetAllUsers } from "../../api/User.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import DataTableComponent from "../../components/my-components/common/data-table.component"
import { User } from "../../types"
import { Button } from "../../components/ui/button"
import { HiArrowsUpDown } from "react-icons/hi2"
import { getFormattedDate, getFormattedTime } from "../../lib/utils"
import TableActions from "../../components/my-components/common/table-actions.component"
import { toast } from "react-toastify"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { imagePlaceholder } from "../../assets"



const AdminAllUsersPage = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // current page number --> page
        pageSize: 5, // number of data per page --> limit
    })

    const {usersData, isLoading, error, refetch} = useGetAllUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    })

    const userCols = useMemo<ColumnDef<User>[]>(() => {
        return [
            {
                header: "Image",
                accessorKey: "image",
                cell: ({row}) => {
                    const image:string = row.getValue("image")
                    const imageURL = import.meta.env.VITE_IMAGE_URL + "/uploads/users/" + image;

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
                accessorKey: "name",
                header: ({ column }) => {
                    return (
                      <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                        Name
                        <HiArrowsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )
                },
                cell: ({row}) => {
                    const name: string = row.getValue("name")

                    return <>
                        <span className="inline-block min-w-[150px] capitalize">{name.length > 25 ? name.split("").slice(0,25).join("")+'...' : name}</span>
                    </>
                }
            },
            {
                accessorKey: "email",
                header: ({ column }) => {
                    return (
                      <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                        Email
                        <HiArrowsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )
                },
                cell: ({row}) => {
                    const email: string = row.getValue("email")

                    return <>
                        <span className="inline-block min-w-[150px]">{email.length > 25 ? email.split("").slice(0,25).join("")+'...' : email}</span>
                    </>
                }
            },
            {
                accessorKey: "phone",
                header: ({ column }) => {
                    return (
                      <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                        Phone
                        <HiArrowsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )
                },
                cell: ({row}) => {
                    const phone: string = row.getValue("phone")

                    return <>
                    {
                        phone ? (
                            <span className="inline-block min-w-[150px]">{phone.length > 25 ? phone.split("").slice(0,25).join("")+'...' : phone}</span>
                        ) : (
                            <>null</>
                        )
                    }
                    </>
                }
            },
            {
                accessorKey: "role",
                header: ({ column }) => {
                    return (
                      <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                        Role
                        <HiArrowsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )
                },
                cell: ({row}) => {
                    const role: string = row.getValue("role")

                    return <>
                        <span className="inline-block min-w-[150px] capitalize">{role.length > 25 ? role.split("").slice(0,25).join("")+'...' : role}</span>
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
                accessorKey: "activationToken",
                header: ({ column }) => {
                    return (
                      <div>Activation Token</div>
                    )
                },
                cell: ({row}) => {
                    const activationToken: string = row.getValue("activationToken")

                    return <>
                        {
                            activationToken ? (
                                <span className="inline-block min-w-[150px] capitalize">{activationToken.length > 25 ? activationToken.split("").slice(0,25).join("")+'...' : activationToken}</span>
                            ) : (
                                <>null</>
                            )
                        }
                    </>
                }
            },
            {
                header: "Created At",
                accessorKey: "createdAt",
                cell: ({row}) => {
                    return (
                        <div className="min-w-[120px]">
                            <p className="capitalize">{getFormattedTime(row.original.createdAt)}</p>
                            <p className="capitalize">{getFormattedDate(row.original.createdAt)}</p>
                        </div>
                    )
                }
            },
            {
                header: "Updated At",
                accessorKey: "updatedAt",
                cell: ({row}) => {
                    const updatedAt = row.original.createdAt
                    return (
                        <>
                            {
                                updatedAt ? (
                                    <div className="min-w-[120px]">
                                        <p className="capitalize">{getFormattedTime(updatedAt)}</p>
                                        <p className="capitalize">{getFormattedDate(updatedAt)}</p>
                                    </div>
                                ) : (
                                    <>null</>
                                )
                            }
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
                    const user = row.original

                    const {deleteUser,deleteErr,deleteLoading,deleteSuccess} = useDeleteUser()

                    const handleUserDelete = (id:string) => {
                        deleteUser(id)
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
                            data={user}
                            dataType="user"
                            deleteHandler={handleUserDelete}
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
                    title={'All Users'}
                    link={`/admin/add-user`}
                    linkText="Create User"
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
                                columns={userCols as ColumnDef<unknown, any>[]}
                                data={(usersData?.result || []) as any[]}
                                pagination={pagination}
                                setPagination={setPagination}
                                meta={usersData?.meta}
                                searchable={{field: "title"}}
                            />
                        </div>
                }
            </section>
        </>
    )
}

export default AdminAllUsersPage
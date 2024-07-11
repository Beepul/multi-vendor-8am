import { useParams } from "react-router-dom"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { IoArrowBackSharp } from "react-icons/io5"
import { useEffect } from "react"
import { useGetCategoryById } from "../../api/Category.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import CategoryFormComponent from "../../components/my-components/dashboard/CategoryForm.component"

const AdminEditCategory = () => {
    const {id} = useParams()
    const {loggedInUser} = useAuth()

    const {category, isLoading, isSuccess, error, refetch} = useGetCategoryById(id as string)

    useEffect(() => {
        refetch()
    }, [id])

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Edit Category: '+ (isLoading ? 'Loading...' : (category?.title ? category?.title : ''))}
                    link={`/${loggedInUser?.role}/categories`}
                    linkText={<IoArrowBackSharp className="text-xl" />}
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
                            <CategoryFormComponent 
                                mode="editMode"
                                propCat={category}
                            />
                        </div>
                    </>
                }
            </section>
        </>
    )
}

export default AdminEditCategory
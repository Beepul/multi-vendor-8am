import { useParams } from "react-router-dom"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { IoArrowBackSharp } from "react-icons/io5"
import { useEffect } from "react"
import { useGetCategoryById } from "../../api/Category.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import CategoryFormComponent from "../../components/my-components/dashboard/CategoryForm.component"
import { useGetBrandById } from "../../api/Brand.api"
import BrandFormComponent from "../../components/my-components/dashboard/BrandForm.component"

const AdminEditBrand = () => {
    const {id} = useParams()
    const {loggedInUser} = useAuth()

    const {brand, isLoading, isSuccess, error, refetch} = useGetBrandById(id as string)

    useEffect(() => {
        refetch()
    }, [id])

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Edit Brand: '+ (isLoading ? 'Loading...' : (brand?.title ? brand?.title : ''))}
                    link={`/${loggedInUser?.role}/brands`}
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
                            <BrandFormComponent 
                                mode="editMode"
                                propBrand={brand}
                            />
                        </div>
                    </>
                }
            </section>
        </>
    )
}

export default AdminEditBrand
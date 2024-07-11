import { useParams } from "react-router-dom"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { IoArrowBackSharp } from "react-icons/io5"
import { useAuth } from "../../context/auth.context"
import ProductFormComponent from "../../components/my-components/dashboard/ProductForm.component"
import { useGetProductById } from "../../api/Product.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { useEffect } from "react"

const EditProductPage = () => {
    const {id} = useParams()

    const {loggedInUser} = useAuth()

    const {product, isLoading, isSuccess, error, refetch} = useGetProductById(id as string)

    useEffect(() => {
        refetch()
    }, [id])

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Edit Product: ' + (isLoading ? 'Loading...' : product?.title)}
                    link={`/${loggedInUser?.role}/products`}
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
                            <ProductFormComponent 
                                purpose="edit"
                                product={product}
                            />
                        </div>
                    </>
                }
            </section>
        </>
    )
}

export default EditProductPage
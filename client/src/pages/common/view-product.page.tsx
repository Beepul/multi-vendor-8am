import { useParams } from "react-router-dom"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import { Edit } from "lucide-react"
import { useGetProductById } from "../../api/Product.api"
import PreviewProductComponent from "../../components/my-components/PreviewProduct.component"
import LoaderComponent from "../../components/my-components/common/Loader.component"

const ViewProductPage = () => {
    const {id} = useParams()

    const {loggedInUser} = useAuth()

    const {product, isLoading, isSuccess, error} = useGetProductById(id as string)

    return (
        <>
            <section className="py-7">
                <SectionTitleComponent 
                    title={'Product Detail: ' + (isLoading ? 'Loading...' : product?.title)}
                    link={`/${loggedInUser?.role}/edit-product/${id}`}
                    linkText={<span className="flex items-center">Edit <Edit height={13}/></span>}
                />
                <div>
                    {
                        isLoading ? 
                        <div className="flex items-center justify-center w-full min-h-[500px]">
                            <LoaderComponent svgCn="h-24 w-24" color="#1e40af" />
                        </div> : product ? 
                        <PreviewProductComponent product={product} mode="overview"  />
                        : <div className="flex items-center justify-center w-full min-h-[500px]">
                            <p>{(error as any).message}</p>
                        </div> 
                    }
                </div>
            </section>
        </>
    )
}

export default ViewProductPage
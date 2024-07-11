import AllBrandsComponent from "../../components/my-components/dashboard/AllBrands.component"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"


const SellerAllBrandsPage = () => {
    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Available Brands'}
                />
                <AllBrandsComponent />
            </section>
        </>
    )
}

export default SellerAllBrandsPage
import AllCategoriesComponent from "../../components/my-components/dashboard/AllCategories.component"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"

const SellerAllCategoriesPage = () => {
    const {loggedInUser} = useAuth()
    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Available Categories'}
                />
                <AllCategoriesComponent />
            </section>
        </>
    )
}

export default SellerAllCategoriesPage
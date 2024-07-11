import { IoArrowBackSharp } from "react-icons/io5"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import CategoryFormComponent from "../../components/my-components/dashboard/CategoryForm.component"



const AdminAddCategoryPage = () => {
    const {loggedInUser} = useAuth()

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Create New Category'}
                    link={`/${loggedInUser?.role}/categories`}
                    linkText={<IoArrowBackSharp className="text-xl" />}
                />
                <div>
                    <CategoryFormComponent mode="createMode"/>
                </div>
            </section>
        </>
    )
}

export default AdminAddCategoryPage
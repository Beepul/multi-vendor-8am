import { IoArrowBackSharp } from "react-icons/io5"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"
import BrandFormComponent from "../../components/my-components/dashboard/BrandForm.component"

const AdminAddBrandPage = () => {
    const {loggedInUser} = useAuth()

    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Create New Brand'}
                    link={`/${loggedInUser?.role}/brands`}
                    linkText={<IoArrowBackSharp className="text-xl" />}
                />
                <div>
                    <BrandFormComponent 
                        mode="createMode"
                    />
                </div>
            </section>
        </>
    )
}

export default AdminAddBrandPage
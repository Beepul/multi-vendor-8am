import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"
import { useAuth } from "../../context/auth.context"

const AdminAllBannerPage = () => {
    const {loggedInUser} = useAuth()
    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title='Banner List'
                    link={`/admin/add-banner`}
                    linkText="Add new banner"
                />
                
            </section>
        </>
    )
}

export default AdminAllBannerPage
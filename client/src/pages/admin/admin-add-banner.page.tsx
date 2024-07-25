import { IoArrowBackSharp } from "react-icons/io5"
import SectionTitleComponent from "../../components/my-components/dashboard/Section-title.component"

const AdminAddBannerPage = () => {
    return (
        <>
            <section className="py-5">
                <SectionTitleComponent 
                    title={'Create New Banner'}
                    link={`/admin/banner`}
                    linkText={<IoArrowBackSharp className="text-xl" />}
                />
                <div>
                    
                </div>
            </section>
        </>
    )
}

export default AdminAddBannerPage
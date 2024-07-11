import HomeBanner from "../../components/my-components/Banner.component"
import HomePageProducts from "../../components/my-components/Home-page-products.component"
import HomeCategory from "../../components/my-components/Home-category.component"
import ServicesComponent from "../../components/my-components/Services.component"

const PublicHome = () => {
    return (
        <>
            <HomeBanner />
            <main className="bg-gray-50 pb-16">
                <ServicesComponent />
                <HomePageProducts 
                    sectionTitle="New Arrivals" 
                    sectionDescription="All Our Best Products Are Choosen By Consumers" />
                <HomePageProducts 
                    sectionTitle="Best Selling Products" 
                    sectionDescription="All Our Best Products Are Choosen By Consumers" />
                <HomeCategory />
                <HomePageProducts 
                    sectionTitle="Featured Products" 
                    sectionDescription="All Our Best Products Are Choosen By Consumers" />

            </main>
        </>
    )
}


export default PublicHome
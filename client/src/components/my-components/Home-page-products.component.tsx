import ContainerComponent from "./Container.component"
import HomeSectionTitle from "./Home-section-title.component"
import ProductCard from "./common/ProductCard"

const HomePageProducts = ({sectionTitle,sectionDescription}: {sectionTitle:string,sectionDescription: string}) => {
    const products = [
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s",
            seller: "Amazon Ltd",
            title: "iPhone 14 pro max 256 gb ssd and 8 bg ram something with amoled display",
            rating: 5,
            price: 14000,
            discount: 10,
            afterDiscount: 12600,
            soldCount: 80
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s",
            seller: "Amazon Ltd",
            title: "iPhone 14 pro max 256 gb ssd and 8 bg ram something with amoled display",
            rating: 5,
            price: 14000,
            discount: 10,
            afterDiscount: 12600,
            soldCount: 70
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s",
            seller: "Amazon Ltd",
            title: "iPhone 14 pro max 256 gb ssd and 8 bg ram something with amoled display",
            rating: 5,
            price: 14000,
            discount: 10,
            afterDiscount: 12600,
            soldCount: 65
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s",
            seller: "Amazon Ltd",
            title: "iPhone 14 pro max 256 gb ssd and 8 bg ram something with amoled display",
            rating: 5,
            price: 14000,
            discount: 10,
            afterDiscount: 12600,
            soldCount: 62
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s",
            seller: "Amazon Ltd",
            title: "iPhone 14 pro max 256 gb ssd and 8 bg ram something with amoled display",
            rating: 5,
            price: 14000,
            discount: 10,
            afterDiscount: 12600,
            soldCount: 60
        },
    ]
    return (
        <>
            <ContainerComponent>
                <HomeSectionTitle 
                    title={sectionTitle}
                    description={sectionDescription}
                    cn="mb-10"
                />
                <div className="flex gap-6 mb-4">
                    {
                        products.map((prod,ind) => (
                            <ProductCard product={prod} key={ind}/>
                        ))
                    }
                </div>
            </ContainerComponent>
        </>
    )
}

export default HomePageProducts
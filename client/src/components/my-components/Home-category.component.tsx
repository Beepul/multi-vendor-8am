import { NavLink } from "react-router-dom"
import ContainerComponent from "./Container.component"
import HomeSectionTitle from "./Home-section-title.component"
import { CiImageOff } from "react-icons/ci"

import fallbackImage from "../../assets/placeholder-image.png" 

const HomeCategory = () => {
    const categories = [
        {
            title: "Category One",
            slug: "category-one",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s" 
        },
        {
            title: "Category One",
            slug: "category-one",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s" 
        },
        {
            title: "Category Three",
            slug: "category-one",
            image: "dssdh"
        },
        {
            title: "Category Four",
            slug: "category-one",
            image: "www.dog-pics.com" 
        },
        {
            title: "Category five",
            slug: "category-one",
            image: null
        },
        {
            title: "Category One",
            slug: "category-one",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s" 
        },
        {
            title: "Category One",
            slug: "category-one",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TdXSYwMm6ZBsBlNR9dD5NBd8dvTbiu3c5A&s" 
        },
        {
            title: "Category Three",
            slug: "category-one",
            image: "dssdh"
        },
        {
            title: "Category Four",
            slug: "category-one",
            image: "www.dog-pics.com" 
        },
        {
            title: "Category five",
            slug: "category-one",
            image: null
        },
    ]
    return (
        <>
            <ContainerComponent cn="lg:pb-12">
                <HomeSectionTitle 
                    title="Popular Categories"
                    description="Most Of The Products Are Sold From These Categories"
                    cn="mb-10"
                />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
                    {
                        categories.map((cat,ind) => (
                            <div key={ind} className="rounded-lg bg-white pb-2 overflow-hidden shadow-md">
                                <NavLink to={"/products?c="+cat.slug} className={"group"}>
                                    <span>
                                        <img 
                                            src={cat.image || fallbackImage} 
                                            alt={cat.title}
                                            onError={(e) => {
                                                e.currentTarget.src = fallbackImage
                                            }} 
                                            
                                            className="w-full max-h-20 object-contain" /> 
                                    </span>
                                    <h4 className="text-center font-medium text-gray-600 group-hover:text-yellow-500 transition-all duration-300 text-sm">
                                        {cat.title}
                                    </h4>
                                </NavLink>
                            </div>
                        ))
                    }
                </div>
            </ContainerComponent>
        </>
    )
}

export default HomeCategory
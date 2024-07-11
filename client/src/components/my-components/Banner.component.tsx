import { NavLink } from 'react-router-dom'
import BannerImage from '../../assets/pexels-ruslan-alekso-2016810 (1).jpg'
import { Button } from '../ui/button'
import { HiArrowRight, HiCalendarDays, HiHandRaised } from 'react-icons/hi2'
const HomeBanner = () => {
    return(
        <>
            <section className="bg-gray-50 relative">
                <img src={BannerImage} alt="" className='absolute inset-0 max-h-full w-full object-cover z-[8] h-full'/>
                <div className='md:bg-gradient-to-r from-slate-100 bg-[#21212152] absolute inset-0 z-[9] h-full w-full'></div>
                <div className="mx-auto max-w-7xl p-4 lg:px-8 relative z-10">
                    <div className="py-32 max-w-2xl">
                        <h1 className=" text-3xl font-bold sm:text-5xl mb-6 tracking-wide text-white lg:text-gray-800">
                            Understand User Flow Increase Conversion.
                        </h1>

                        <p className="mb-10 text-md text-white lg:text-gray-800 sm:text-xl">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus
                            numquam ea!
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button className="leading-none gap-2 hover:bg-yellow-400 transition-all duration-300 bg-yellow-300 text-gray-800 px-12 py-6">Get Started <HiArrowRight /></Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomeBanner
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from "@headlessui/react"
import { useState } from "react"
import { FaChartPie } from "react-icons/fa"
import { HiArrowPath, HiArrowRight, HiBars3, HiChevronDown, HiOutlineCursorArrowRays, HiOutlineFingerPrint, HiOutlinePhone, HiOutlinePlayCircle, HiOutlineShoppingCart, HiOutlineSquaresPlus, HiOutlineUserCircle, HiXMark } from "react-icons/hi2"
import { Input } from "../../components/ui/input"
import { HiSearch } from "react-icons/hi"
import { Button } from "../../components/ui/button"
import { NavLink, useNavigate } from "react-router-dom"
import Logo from "../../assets/market-matrix-logo-blue.png"
import { useAuth } from "../../context/auth.context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"

const products = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: FaChartPie },
    { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: HiOutlineCursorArrowRays },
    { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: HiOutlineFingerPrint },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: HiOutlineSquaresPlus },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: HiArrowPath },
]
const callsToAction = [
    { name: 'Watch demo', href: '#', icon: HiOutlinePlayCircle },
    { name: 'Contact sales', href: '#', icon: HiOutlinePhone },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}
  

const HeaderLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const {loggedInUser, setLoggedInUser} = useAuth()

    const navigate = useNavigate()

    // console.log("here",loggedInUser)

    return (<>
        <header>
            <div className="mx-auto max-w-7xl p-4 lg:px-8">
                <div className="flex items-center justify-between">
                    <NavLink to="/" className="-m-1.5 p-1.5 inline-block w-56">
                        <h1 className="sr-only">Market Matrix</h1>
                        <img className="h-14 w-auto" src={Logo} alt="" />
                    </NavLink>
                    <form className="flex items-center min-w-[30%] border-2 border-gray-200 rounded-md focus-within:border-yellow-400 ">
                        <Input placeholder="Search Product..." type="text" className="border-0 focus-visible:ring-offset-0 focus-visible:ring-0"  />
                        <button type="submit" className="text-gray-600 px-4 text-lg"><HiSearch /></button>
                    </form>
                    <div className="w-56 flex items-center justify-end">
                        {
                            loggedInUser?.role === "customer" ? (
                                <NavLink to={'/seller/register'} className="text-sm font-semibold flex items-center rounded-md leading-none gap-2 hover:bg-yellow-400 transition-all duration-300 bg-yellow-300 text-gray-800 px-6 py-4">Become Seller <HiArrowRight /></NavLink>
                            ) : (
                                <a href="tel:+000 000 000" className="text-sm"><span className="font-semibold text-blue-800">Contact:</span> +000 000 000</a>
                            )
                        }
                    </div>
                    <NavLink to={'/admin'} >Admin</NavLink>
                    <NavLink to={'/seller'} >seller</NavLink>
                </div>
            </div>
            <div className="bg-blue-800">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                            <Popover className="relative">
                                <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white group hover:text-yellow-300 transition-all duration-300 focus:outline-none">
                                    Categories
                                    <HiChevronDown className="flex-none text-white group-hover:text-yellow-300 transition-all duration-300" aria-hidden="true" />
                                </PopoverButton>

                                <Transition
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <PopoverPanel className="absolute -left-8 top-full z-20 mt-3 w-screen max-w-sm rounded-md overflow-hidden bg-white shadow-lg ring-1 ring-gray-900/5">
                                        <div className="px-4 py-5">
                                        {products.map((item,index) => (
                                            <div
                                                key={item.name}
                                                className={`group relative flex items-center gap-x-4 rounded-md p-2 text-sm leading-6 hover:bg-gray-50 ${index === 0 ? 'pt-0' : index === products.length+1 ? 'pb-0' : ''}`}
                                                >
                                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-gray-50 group-hover:bg-white">
                                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                            </div>
                                            <div className="flex-auto">
                                                <a href={item.href} className="block font-semibold text-gray-900 group-hover:text-blue-800">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                                </a>
                                                <p className="mt-1 text-gray-600 group-hover:text-blue-800">{item.description}</p>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    </PopoverPanel>
                                </Transition>
                            </Popover>

                            
                        </PopoverGroup>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <HiBars3 className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <NavLink to={'/'} className="text-sm font-semibold leading-6 text-white hover:text-yellow-300 transition-all duration-300">
                            Home
                        </NavLink>
                        <NavLink to="/products" className="text-sm font-semibold leading-6 text-white hover:text-yellow-300 transition-all duration-300">
                            Products
                        </NavLink>
                        <NavLink to="/about-us" className="text-sm font-semibold leading-6 text-white hover:text-yellow-300 transition-all duration-300">
                            About Us
                        </NavLink>
                        <NavLink to="/contact-us" className="text-sm font-semibold leading-6 text-white hover:text-yellow-300 transition-all duration-300">
                            Contact Us
                        </NavLink>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-8">
                        <a href="#" className="text-2xl font-semibold leading-6 text-white hover:text-yellow-300 transition-all duration-300 relative">
                            <HiOutlineShoppingCart />
                            <span className="bg-yellow-300 text-[12px] leading-none text-gray-900 h-4 w-6 rounded-full flex items-center justify-center absolute bottom-[60%] -right-3">0</span>
                        </a>
                        {
                            !loggedInUser ? (
                                <NavLink to="/login" className="text-2xl font-semibold leading-6 text-white hover:text-yellow-300 transition-all duration-300">
                                    <HiOutlineUserCircle />
                                </NavLink> ) : (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            {
                                                loggedInUser.image ? (
                                                    <div className={"cursor-pointer"}>
                                                        <img src={import.meta.env.VITE_IMAGE_URL+"/uploads/users/"+loggedInUser.image} alt="" crossOrigin="anonymous" className="h-8 w-8 rounded-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="cursor-pointer uppercase font-semibold bg-yellow-300 hover:bg-yellow-200 transition-all duration-300 leading-none text-blue-800 h-8 w-8 rounded-full flex items-center justify-center">
                                                        {loggedInUser.name.split("")[0]}
                                                    </div>
                                                )
                                            }
                                            {/* <Button>Open</Button> */}
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Quick Links</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem><NavLink className={'inline-block w-full'} to={'/'+loggedInUser.role}>Profile</NavLink></DropdownMenuItem>
                                            <DropdownMenuItem><NavLink className={'inline-block w-full'} to={`/${loggedInUser.role}/orders`}>Orders</NavLink></DropdownMenuItem>
                                            <DropdownMenuItem><NavLink className={'inline-block w-full'} to={`/account/inbox`}>Inbox</NavLink></DropdownMenuItem>
                                            <DropdownMenuItem><NavLink className={'inline-block w-full'} to={`/account/settings`}>Settings</NavLink></DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem><Button variant={'link'} className="p-0 h-auto hover:no-underline" onClick={() => {
                                                setLoggedInUser(null)
                                                localStorage.removeItem("mm_accessToken")
                                                localStorage.removeItem("mm_refreshToken")
                                                navigate('/')
                                            }}>Log Out</Button></DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </> 
                            )
                        }
                    </div>
                </nav>
                <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt=""
                        />
                        </a>
                        <button
                        type="button"
                        className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                        >
                        <span className="sr-only">Close menu</span>
                        <HiXMark className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                            <Disclosure as="div" className="-mx-3">
                            {({ open }) => (
                                <>
                                <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                    Product
                                    <HiChevronDown
                                    className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                    aria-hidden="true"
                                    />
                                </DisclosureButton>
                                <DisclosurePanel className="mt-2 space-y-2">
                                    {[...products, ...callsToAction].map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                    ))}
                                </DisclosurePanel>
                                </>
                            )}
                            </Disclosure>
                            <a
                            href="#"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                            Features
                            </a>
                            <a
                            href="#"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                            Marketplace
                            </a>
                            <a
                            href="#"
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                            Company
                            </a>
                        </div>
                        <div className="py-6">
                            <a
                            href="#"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                            Log in
                            </a>
                        </div>
                        </div>
                    </div>
                    </DialogPanel>
                </Dialog>
            </div>
        </header>
    </>)
}

export default HeaderLayout
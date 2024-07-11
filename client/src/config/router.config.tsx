import { Route, Routes, useLocation } from "react-router-dom"
import 'react-lazy-load-image-component/src/effects/blur.css';
import PublicHome from "../pages/public/home.page"
import AdminHome from "../pages/admin/admin-home.page"
import PublicLayout from "../layouts/public"
import AdminLayout from "../layouts/admin"
import NotFoundPage from "../pages/public/404.page"
import PublicRegisterPage from "../pages/public/public-register.page"
import SellerRegisterPage from "../pages/seller/seller-register.page"
import LoginPage from "../pages/public/public-login.page"
import PublicActivationPage from "../pages/public/public-activate.page"
import { useAuth } from "../context/auth.context"
import { useAutoLogin } from "../api/Auth.api"
import { useEffect, useRef } from "react"
import LoaderComponent from "../components/my-components/common/Loader.component"
import CustomerProfilePage from "../pages/customer/customer-profile.page"
import CustomerAndSellerLayout from "../layouts/common/Customer-Seller.layout"
import CustomerOrdersPage from "../pages/customer/customer-orders.page"
import MyInboxPage from "../pages/common/my-inbox.page"
import AccountSettingsPage from "../pages/common/account-settings.page"
import PublicPasswordResetPage from "../pages/public/public-password-reset.page"
import PermissionConfig from "./permission.config"
import SellerActivationPage from "../pages/seller/seller-activation-page"
import PublicProducts from "../pages/public/public-products"
import SellerOrdersPage from "../pages/seller/seller-orders.page"
import ShopSettingsPage from "../pages/seller/shop-settings.page"
import SellerDashBoardPage from "../pages/seller/seller-dashboard.page"
import AllProductsPage from "../pages/common/all-products.page"
import AddProductPage from "../pages/common/add-product.page"
import EditProductPage from "../pages/common/edit-product.page"
import ViewProductPage from "../pages/common/view-product.page"
import SellerAllBrandsPage from "../pages/seller/seller-all-brands.page"
import SellerAllCategoriesPage from "../pages/seller/seller-all-categories.page"
import AdminAllCategoriesPage from "../pages/admin/admin-all-categories.page";
import AdminAddCategoryPage from "../pages/admin/admin-add-category.page";
import AdminAddBrandPage from "../pages/admin/admin-add-brand.page";
import AdminAllBrandsPage from "../pages/admin/admin-all-brands.page";
import AdminEditCategory from "../pages/admin/admin-edit-category.page";
import AdminEditBrand from "../pages/admin/admin-edit-brand.page";

const RouterConfig = () => {
    const {setLoggedInUser,setUserLoading, isUserLoading, loggedInUser} = useAuth()

    const token = localStorage.getItem("mm_accessToken")

    const {data, isLoading, isSuccess, error} = useAutoLogin(token as string)

    useEffect(() => {
        if(!isSuccess && error){
            console.log(error)
        }
        if(isSuccess && data){
            setLoggedInUser(data.result)
        }
        setUserLoading(isLoading)
    },[data, isSuccess, error, isLoading])

    const location = useLocation()
    const prevLocation = useRef(location.pathname)

    useEffect(() => {
        prevLocation.current = location.pathname
    }, [location.pathname])

    // console.log("PrevLocation::",prevLocation)
    // console.log("user::", loggedInUser)
    // console.log("loading-user::", isUserLoading)


    if(isUserLoading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoaderComponent 
                    svgCn="h-24 w-24"
                    color="#1e40af"
                />
            </div>
        )
    }
    
    return (
        <>
            <Routes>
                <Route path="/" element={<PublicLayout/>}>
                    <Route index element={<PublicHome />}></Route>
                    <Route path="account/inbox" element={
                        <PermissionConfig allowAccess={["customer","seller"]} prevLocation={prevLocation.current}>
                            <CustomerAndSellerLayout active="inbox">
                                <MyInboxPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="account/settings" element={
                        <PermissionConfig allowAccess={["customer","seller"]} prevLocation={prevLocation.current}>
                            <CustomerAndSellerLayout active="settings">
                                <AccountSettingsPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="products" element={ <PublicProducts />}></Route>
                    <Route path="*" element={<NotFoundPage />}></Route>
                </Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/reset-password/:resetToken" element={<PublicPasswordResetPage />}></Route>
                <Route path="/register" element={<PublicRegisterPage />}></Route>
                <Route path="/activate/:activationToken" element={<PublicActivationPage />}></Route>
                <Route path="/customer" element={<PublicLayout />}>
                    <Route index element={
                        <PermissionConfig allowAccess={["customer"]} prevLocation={prevLocation.current} >
                            <CustomerAndSellerLayout>
                                <CustomerProfilePage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="orders" element={
                        <PermissionConfig allowAccess={["customer"]} prevLocation={prevLocation.current}>
                            <CustomerAndSellerLayout active="orders">
                                <CustomerOrdersPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                </Route>
                <Route path="/seller" element={<PublicLayout />}>
                    <Route index element={
                        <PermissionConfig allowAccess={["seller"]} prevLocation={prevLocation.current}>
                            <CustomerAndSellerLayout active="dashboard">
                                <SellerDashBoardPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="register" element={
                        <PermissionConfig allowAccess={["customer"]} prevLocation={prevLocation.current}>
                            <SellerRegisterPage />
                        </PermissionConfig>
                    }></Route>
                    <Route path="activate-shop/:token" element={
                        <PermissionConfig allowAccess={["customer"]}>
                            <SellerActivationPage />
                        </PermissionConfig>
                    }></Route>
                    <Route path="shop-settings" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="shop-settings">
                                <ShopSettingsPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="orders" element={
                        <PermissionConfig allowAccess={["seller"]} prevLocation={prevLocation.current}>
                            <CustomerAndSellerLayout active="orders">
                                <SellerOrdersPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="products" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="products">
                                <AllProductsPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="add-product" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="products">
                                <AddProductPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="view-product/:id" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="products">
                                <ViewProductPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="edit-product/:id" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="products">
                                <EditProductPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="brands" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="brands">
                                <SellerAllBrandsPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    <Route path="categories" element={
                        <PermissionConfig allowAccess={['seller']}>
                            <CustomerAndSellerLayout active="categories">
                                <SellerAllCategoriesPage />
                            </CustomerAndSellerLayout>
                        </PermissionConfig>
                    }></Route>
                    {/* <Route path="profile" element={<ProfilePage />}></Route> */}
                </Route>
                <Route path="/admin/*" element={
                    <PermissionConfig allowAccess={["admin"]} prevLocation={prevLocation.current}>
                        <Routes>
                            <Route index element={
                                <AdminLayout active="dashboard">
                                    <AdminHome />
                                </AdminLayout>
                            }></Route>
                            <Route path="products" element={
                                <AdminLayout active="products">
                                    <AllProductsPage />
                                </AdminLayout>
                            }></Route>
                             <Route path="edit-product/:id" element={
                                <AdminLayout active="products">
                                    <EditProductPage />
                                </AdminLayout>
                            }></Route>
                            <Route path="brands" element={
                                <AdminLayout active="brands">
                                    <AdminAllBrandsPage />
                                </AdminLayout>
                            }></Route>
                            <Route path="add-product" element={
                                <AdminLayout active="add-product">
                                    <AddProductPage />
                                </AdminLayout>
                            }></Route>
                            <Route path="add-category" element={
                                <AdminLayout active="categories">
                                    <AdminAddCategoryPage />
                                </AdminLayout>
                            }></Route>
                            <Route path="edit-category/:id" element={
                                <AdminLayout active="categories">
                                    <AdminEditCategory />
                                </AdminLayout>
                            }></Route>
                            <Route path="add-brand" element={
                                <AdminLayout active="add-brand">
                                    <AdminAddBrandPage />
                                </AdminLayout>
                            }></Route>
                            <Route path="edit-brand/:id" element={
                                <AdminLayout active="brands">
                                    <AdminEditBrand />
                                </AdminLayout>
                            }></Route>
                            <Route path="categories" element={
                                <AdminLayout active="categories">
                                    <AdminAllCategoriesPage />
                                </AdminLayout>
                            }></Route>
                            <Route path="settings" element={
                                <AdminLayout active="settings">
                                    <div className="py-16 pb-10 flex flex-col gap-16">
                                        <CustomerProfilePage />
                                        <AccountSettingsPage />
                                    </div>
                                </AdminLayout>
                            }></Route>
                            <Route path="*" element={<NotFoundPage />}></Route>
                        </Routes>
                    </PermissionConfig>}>
                </Route>
            </Routes>
        </>
    )
}

export default RouterConfig
import { TbBusinessplan, TbTransform } from "react-icons/tb";
import { useAuth } from "../../context/auth.context"
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";

import OverviewCardComponent from "../../components/my-components/dashboard/Overview-card.component";
import DoughnutComponent from "../../components/my-components/dashboard/Doughnut.component";
import { useMyShop } from "../../context/shop.context";



const catData = [
    {label: "Clothes", value: 20},
    {label: "Kitchen", value: 30},
    {label: "Electronics", value: 15},
    {label: "Pants", value: 50},
    {label: "Kids", value: 40},
]
const brandData = [
    {label: "Apple", value: 40},
    {label: "Samsung", value: 20},
    {label: "Oppo", value: 55},
    {label: "Toyota", value: 70},
    {label: "Bus", value: 10},
]


const SellerDashBoardPage = () => {
    const {loggedInUser} = useAuth()
    const {shopDetail} = useMyShop()

    
    return (
        <>
            {loggedInUser?.role === 'seller' && (
                <div className="text-center py-4 bg-blue-700 text-white rounded-md mb-4">
                    <h2 className="text-2xl font-semibold capitalize">{shopDetail?.name}</h2>
                </div>
            )}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <div className="grid grid-cols-3 gap-7">
                    <OverviewCardComponent 
                        icon={<TbBusinessplan className="text-blue-800"/>}
                        stats="$900"
                        title="Profit / Loss"
                    />
                    <OverviewCardComponent 
                        icon={<TbTransform className="text-blue-800"/>}
                        stats="3"
                        title="All Orders"
                        link="/seller/orders"
                        linkTitle="View Orders"
                    />
                    <OverviewCardComponent 
                        icon={<AiOutlineProduct className="text-blue-800"/>}
                        stats="3"
                        title="All Products"
                        link="/seller/products"
                        linkTitle="View Products"
                    />
                </div>
            </section>
            <section className="grid grid-cols-3 gap-7 mb-10">
                <main className="col-span-2">
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4">Top Products</h2>
                        <div>
                            top products
                        </div>
                    </div>
                    <div className="">
                        <h2 className="text-2xl font-semibold mb-4">Latest Orders</h2>
                        <div>
                            Latest orders
                        </div>
                    </div>
                </main>
                <aside className="">
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Top Categories</h2>
                        <div className="max-w-[80%] mx-auto">
                            <DoughnutComponent 
                                chartData={{
                                    labels: catData.map((c,i) => c.label),
                                    datasets: [
                                        {
                                            label: "sold",
                                            data: catData.map((c,i) => c.value),
                                            borderRadius: 5,
                                            backgroundColor: [
                                                '#1E40AF',
                                                '#FDE047',
                                                '#7EC8E3',
                                                '#FFA384',
                                                '#2FF3E0',
                                            ]
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Top Brands</h2>
                        <div className="max-w-[80%] mx-auto">
                            <DoughnutComponent 
                                chartData={{
                                    labels: brandData.map((b,i) => b.label),
                                    datasets: [
                                        {
                                            label: "sold",
                                            data: brandData.map((b,i) => b.value),
                                            borderRadius: 5,
                                            backgroundColor: [
                                                '#7EC8E3',
                                                '#2FF3E0',
                                                '#FFA384',
                                                '#1E40AF',
                                                '#FDE047',
                                            ]
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                </aside>
            </section>
            <section className="grid grid-cols-2 mb-10">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Latest Transactions</h2>
                    <div>
                        Latest Transactions
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Latest Reviews</h2>
                    <div>
                        latest reviews
                    </div>
                </div>
            </section>
            
        </>
    )
}

export default SellerDashBoardPage
import { ReactNode, createContext, useContext, useState } from "react";
import { Shop } from "../types";

type ContextType = {
    shopDetail: Shop | null,
    setShopDetail: React.Dispatch<React.SetStateAction<Shop | null>>,
    isShopLoading: boolean,
    setIsShopLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ShopContext = createContext<ContextType>({
    shopDetail: null,
    setShopDetail: () => null,
    isShopLoading: true ,
    setIsShopLoading: () => true
})

export const ShopProvider = ({children}: {children: ReactNode}) => {
    const [shopDetail, setShopDetail] = useState<Shop | null>(null)
    const [isShopLoading, setIsShopLoading] = useState(true)
    return (
        <ShopContext.Provider value={{shopDetail, setShopDetail, isShopLoading, setIsShopLoading}}>
            {children}
        </ShopContext.Provider>
    )
}

export const useMyShop = () => {
    const shop = useContext(ShopContext)
    return shop
}
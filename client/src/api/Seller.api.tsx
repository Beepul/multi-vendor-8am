import { useMutation, useQuery } from "react-query"
import axiosInstance from "../config/axios.config"
import { Shop } from "../types";

type ResigterShopPayload = {
    profileImg: File | null;
    bannerImg: File | null;
    sellerId: string | undefined;
    about?: string | undefined;
    addressLine2?: string | undefined;
    name: string;
    phoneNumber: string;
    addressLine1: string;
}

export const useRegisterShop = () => {
    const registerShop = async (payload: ResigterShopPayload) => {
        const res = await axiosInstance.post('/shop/create-shop', payload , {
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })
        return res 
    }
    const {mutateAsync, isLoading, error, isSuccess} = useMutation(registerShop)

    return {
        registerShop: mutateAsync,
        isLoading,
        error,
        isSuccess
    }
}

export const useActivateShop = (token: string) => {
    const activateShop = async () => {
        const res = await axiosInstance.get('/shop/activate/'+token, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }
    const {isSuccess, error, isLoading} = useQuery("activate-shop", activateShop, {
        enabled: !!token
    })

    return {
        isSuccess,
        error,
        isLoading
    }
}


export const useResendShopActivationLink = () => {
    const resendActivationLink = async (data: {email: string}) => {
        const res = await axiosInstance.put('/shop/resend-activation-link', data, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res
    }
    const {mutateAsync: resendActivationFn, isLoading, isSuccess, error} = useMutation(resendActivationLink)

    return {
        resendActivationFn,
        isLoading,
        isSuccess,
        error,
    }
}

type myShopResType = {
    result: Shop,
    message: string,
    meta: any 
}
export const useGetMyShop = (role: string) => {
    const getMyShop = async () => {
        const res: myShopResType = await axiosInstance.get('/shop/my', {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {data, isLoading, isSuccess, error} = useQuery(['my_shop'], getMyShop, {
        enabled: role === 'seller' ? true : false
    })

    return {
        myShop: data, 
        isLoading,
        isSuccess,
        error
    }
}
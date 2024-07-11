import { useMutation, useQuery, useQueryClient } from "react-query"
import axiosInstance from "../config/axios.config"
import { Product } from "../types"

export type CreateProductPayload = {
    title: string,
    summary: string,
    description?: string,
    price: number,
    discount?: number,
    categories?: string[],
    brand?: string,
    isFeatured: boolean,
    images: any[]
}

export const useCreateProduct = () => {
    const createProduct = async (payload: FormData) => {
        const res = await axiosInstance.post('/product/', payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })
        return res 
    }

    const {mutateAsync, isLoading, isSuccess, error} = useMutation(createProduct)

    return {
        createProduct: mutateAsync,
        isLoading,
        isSuccess,
        error
    }
}


export type AllProdsResType = {message: string, meta: any, result: Product[]}

export const useGetAllProducts = (query: {page: number, limit: number, shopId?: string | null}) => {
    const getAllProducts = async () => {
        const params = new URLSearchParams()
        if(query.shopId && query.shopId !== null){
            params.append("shop", query.shopId)
        }
        params.append("page", query.page.toString())
        params.append("limit", query.limit.toString())

        const res: AllProdsResType  = await axiosInstance.get(`/product?${params}`, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {data,isLoading,isSuccess,error, refetch} = useQuery(['single_product'], getAllProducts)



    return {
        myProducts: data,
        isLoading,
        isSuccess,
        error,
        refetch
    }
}

export const useGetProductById = (id: string) => {
    console.log(id)
    const getProductById = async () => {
        const res: {message: string, meta: any, result: Product} = await axiosInstance.get('/product/'+id, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {data, isLoading, isSuccess, error , refetch} = useQuery(['product', id], getProductById, {
        enabled: !!id,
    })

    return {
        product: data?.result,
        isLoading,
        isSuccess,
        error,
        refetch
    }
}


export const useEditProduct = () => {
    const editProduct = async (data: {id: string, payload: FormData}) => {
        const res = await axiosInstance.put('/product/'+data.id, data.payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })
        return res 
    }

    const {mutateAsync, isLoading, isSuccess, error} = useMutation(editProduct)

    return {
        editProduct: mutateAsync,
        isEditLoading:isLoading,
        isEditSuccess: isSuccess,
        editError: error
    }
}



export const useDeleteProduct = () => {
    const queryClient = useQueryClient()

    const deleteProduct = async (id:string) => {
        const res = await axiosInstance.delete('/product/'+id, {
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {mutateAsync, isSuccess, isLoading, error} = useMutation(deleteProduct, {
        onSuccess: (data,variables) => {
            queryClient.invalidateQueries(['product', variables])
            queryClient.invalidateQueries(['single_product'])
        }
    })

    return {
        deleteProduct: mutateAsync,
        deleteSuccess: isSuccess,
        deleteLoading: isLoading,
        deleteErr: error
    }
}
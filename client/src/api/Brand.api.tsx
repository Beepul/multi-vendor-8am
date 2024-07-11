import { useMutation, useQuery, useQueryClient } from "react-query"
import axiosInstance from "../config/axios.config"
import { Brand } from "../types"

export const useCreateBrand = () => {
    const queryClient = useQueryClient()

    const createBrand = async (payload: FormData) => {
        const res = await axiosInstance.post('/brand', payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })

        return res 
    }

    const {mutateAsync, isLoading, isSuccess, error} = useMutation(createBrand, {
        onSuccess() {
            queryClient.invalidateQueries(["all-brands","admin-brands"])
        },
    })

    return {
        createBrand: mutateAsync,
        isLoading,
        isSuccess,
        error
    }
}

type AllBrandResTYpe = {
    meta: any,
    result: Brand[], 
    message: string 
}

export const useGetAllBrands = (query: {page: number, limit: number}) => {
    const getAllBrands = async () => {

        const params = new URLSearchParams()
        params.append("page", query.page.toString())
        params.append("limit", query.limit.toString())

        const res: AllBrandResTYpe = await axiosInstance.get(`/brand?${params}`, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
            }
        })
        return res 
    }

    const {data, isLoading, error, refetch} = useQuery(["all-brands","admin-brands"], getAllBrands)

    return {
        brandsData: data,
        isLoading,
        error,
        refetch
    }
}



export const useDeleteBrand = () => {
    const queryClient = useQueryClient()

    const deleteBrand = async (id:string) => {
        const res = await axiosInstance.delete('/brand/'+id, {
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {mutateAsync, isSuccess, isLoading, error} = useMutation(deleteBrand, {
        onSuccess: (data,variables) => {
            queryClient.invalidateQueries(['brand', variables])
            queryClient.invalidateQueries(["all-brands","admin-brands"])
        }
    })

    return {
        deleteBrand: mutateAsync,
        deleteSuccess: isSuccess,
        deleteLoading: isLoading,
        deleteErr: error
    }
}



export const useGetBrandById = (id: string) => {

    const getBrandById = async () => {
        const res: {message: string, meta: any, result: Brand} = await axiosInstance.get('/brand/'+id, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {data, isLoading, isSuccess, error , refetch} = useQuery(['brand', id], getBrandById, {
        enabled: !!id,
    })

    return {
        brand: data?.result,
        isLoading,
        isSuccess,
        error,
        refetch
    }
}


export const useEditBrand = () => {
    const queryClient = useQueryClient();

    const editBrand = async (data: {id: string, payload: FormData}) => {
        const res = await axiosInstance.put('/brand/'+data.id, data.payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })
        return res 
    }

    const {mutateAsync, isLoading, isSuccess, error} = useMutation(editBrand,{
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['brand', variables.id]);
            queryClient.invalidateQueries(["all-brands","admin-brands"])
        }
    })

    return {
        editBrand: mutateAsync,
        isEditLoading:isLoading,
        isEditSuccess: isSuccess,
        editError: error
    }
}



interface Option {
    value: string;
    label: string;
}


export const fetchBrandOptions = async (val: string): Promise<Option[]> => {
    
    if(!val) return []
    
    const res: AllBrandResTYpe = await axiosInstance.get(`/brand?s=${val}`, {
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("mm_accessToken")
        }
    })

    return res.result.map((brand) => {
        return {
            value: brand._id,
            label: brand.title
        }
    })
}
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query"
import axiosInstance from "../config/axios.config"
import { Category } from "../types"
import { CategoryDTOType } from "../components/my-components/dashboard/CategoryForm.component"

export const useCreateCat = () => {
    const createCat = async (payload: FormData) => {
        const res = await axiosInstance.post('/category', payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })

        return res 
    }

    const {mutateAsync, isLoading, isSuccess, error} = useMutation(createCat)

    return {
        createCat: mutateAsync,
        isLoading,
        isSuccess,
        error
    }
}


type AllCategoryResTYpe = {
    meta: any,
    result: Category[], 
    message: string 
}

export const useGetAllCategories = (query: {page: number, limit: number}) => {
    const getAllCategories = async () => {
        const params = new URLSearchParams()
        params.append("page", query.page.toString())
        params.append("limit", query.limit.toString())

        const res: AllCategoryResTYpe = await axiosInstance.get(`/category?${params}`, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
            }
        })
        return res 
    }

    const {data, isLoading, error,refetch} = useQuery(["all-cats","admin-cats"], getAllCategories)

    return {
        allCats: data,
        isLoading,
        error,
        refetch
    }
}



export const useGetCategoryById = (id: string) => {

    const getCategoryById = async () => {
        const res: {message: string, meta: any, result: Category} = await axiosInstance.get('/category/'+id, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {data, isLoading, isSuccess, error , refetch} = useQuery(['category', id], getCategoryById, {
        enabled: !!id,
    })

    return {
        category: data?.result,
        isLoading,
        isSuccess,
        error,
        refetch
    }
}




export const useEditCategory = () => {
    const queryClient = useQueryClient();

    const editCategory = async (data: {id: string, payload: FormData}) => {
        const res = await axiosInstance.put('/category/'+data.id, data.payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            }
        })
        return res 
    }

    const {mutateAsync, isLoading, isSuccess, error} = useMutation(editCategory,{
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['category', variables.id]);
            queryClient.invalidateQueries(["all-cats","admin-cats"])
        }
    })

    return {
        editCategory: mutateAsync,
        isEditLoading:isLoading,
        isEditSuccess: isSuccess,
        editError: error
    }
}


export const useDeleteCategory = () => {
    const queryClient = useQueryClient()

    const deleteCategory = async (id:string) => {
        const res = await axiosInstance.delete('/category/'+id, {
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {mutateAsync, isSuccess, isLoading, error} = useMutation(deleteCategory, {
        onSuccess: (data,variables) => {
            queryClient.invalidateQueries(['category', variables])
            queryClient.invalidateQueries(['all-cats', 'admin-cats'])
        }
    })

    return {
        deleteCategory: mutateAsync,
        deleteSuccess: isSuccess,
        deleteLoading: isLoading,
        deleteErr: error
    }
}


interface Option {
    value: string;
    label: string;
}


export const fetchCatOptions = async (val: string): Promise<Option[]> => {
    
    if(!val) return []
    
    const res: AllCategoryResTYpe = await axiosInstance.get(`/category?s=${val}`, {
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("mm_accessToken")
        }
    })

    return res.result.map((cat) => {
        return {
            value: cat._id,
            label: cat.title
        }
    })
}
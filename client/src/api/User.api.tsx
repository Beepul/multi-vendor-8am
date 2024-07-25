import { useMutation, useQuery, useQueryClient } from "react-query"
import axiosInstance from "../config/axios.config"
import { User } from "../types"




type AllUserResTYpe = {
    meta: any,
    result: User[], 
    message: string 
}

export const useGetAllUsers = (query: {page: number, limit: number}) => {
    const getAllUsers = async () => {

        const params = new URLSearchParams()
        params.append("page", query.page.toString())
        params.append("limit", query.limit.toString())

        const res: AllUserResTYpe = await axiosInstance.get(`/user?${params}`, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken"),
            }
        })
        return res 
    }

    const {data, isLoading, error, refetch} = useQuery(["all-users","admin-users"], getAllUsers)

    return {
        usersData: data,
        isLoading,
        error,
        refetch
    }
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    const deleteUser = async (id:string) => {
        const res = await axiosInstance.delete('/user/'+id, {
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("mm_accessToken")
            }
        })
        return res 
    }

    const {mutateAsync, isSuccess, isLoading, error} = useMutation(deleteUser, {
        onSuccess: (data,variables) => {
            queryClient.invalidateQueries(['user', variables])
            queryClient.invalidateQueries(["all-users","admin-users"])
        }
    })

    return {
        deleteUser: mutateAsync,
        deleteSuccess: isSuccess,
        deleteLoading: isLoading,
        deleteErr: error
    }
}
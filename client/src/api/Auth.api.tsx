import { useMutation, useQuery } from "react-query"
import axiosInstance from "../config/axios.config"
import { toast } from 'react-toastify';
import { LoginDTOType } from "../pages/public/public-login.page";
import { User, UserWithToken } from "../types";
import { UpdateDTOType } from "../pages/customer/customer-profile.page";
import { PasswordDTOType } from "../pages/common/account-settings.page";

type RegisterUserType = {
    name: string,
    email: string,
    phone: string,
    password: string,
    image: string | null 
}


export const useRegisterUser = () => {
    const registerUser = async (data: RegisterUserType) => {
        const res = await axiosInstance.post('/auth/register', data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return res
    }
    const mutation = useMutation(registerUser, {
        onSuccess: () => {
            toast.success("Account has been registered successfully. Please check your email to activate your account.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        },
        onError: (error: any) => {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    });

    return {
        createUser: mutation.mutateAsync,
        isLoading: mutation.isLoading,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        reset: mutation.reset,
    };
}

export const useAccountActivate = (activationToken: string) => {
    const activateAccount = async () => {
        const res = await axiosInstance.get('/auth/activate/'+activationToken)
        return res 
    }

    const {data,isLoading, error, isSuccess} = useQuery(['activateMyAccount', activationToken], activateAccount, {
        enabled: !!activationToken
    })
    
    return {
        data,
        isLoading,
        error,
        isSuccess
    }
}

export const useResendActivationLink = () => {
    const resendActivationLink = async (data: {email: string}) => {
        const res = await axiosInstance.put('/auth/resend-activation-link', data)
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

type LoginReturnType = {
    result: UserWithToken,
    message: string,
    meta: any
}
export const useLoginUser = () => {
    const loginUser = async (data: LoginDTOType): Promise<LoginReturnType> => {
        const res: LoginReturnType = await axiosInstance.post('/auth/login', data)
        return res
    }

    const {mutateAsync, isLoading, isSuccess ,error, data} = useMutation(loginUser)

    return {
        loginUser: mutateAsync,
        isLoading,
        isSuccess,
        error,
        user: data?.result
    }
}

type AutoLoginReturnType = {
    result: User,
    message: string,
    meta: any
}

export const useAutoLogin = (token:string) => {
    const autoLogin = async (): Promise<AutoLoginReturnType> => {
        const res: AutoLoginReturnType = await axiosInstance.get('/auth/me', {
            headers: {
                Authorization: 'Bearer '+token
            }
        })
        return res
    }

    const {data, isLoading, isSuccess ,error} = useQuery("auto_login", autoLogin)

    return {
        data,
        isLoading,
        isSuccess,
        error
    }
}

type UpdateProfileReturnType = {
    result: User,
    message: string,
    meta: any
}
export const useUpdateProfile = () => {
    const updateProfile = async (data: {name: string, phone: string, image: any}) => {
        const res: UpdateProfileReturnType = await axiosInstance.put('/auth/update-my-detail', data, {
            headers: {
                Authorization: 'Bearer '+localStorage.getItem("mm_accessToken"),
                "Content-Type": "multipart/form-data"
            },
            
        })
        return res
    }

    const {mutateAsync, isLoading, error, isSuccess, data} = useMutation(updateProfile)

    return {
        updateProfile: mutateAsync,
        isLoading,
        error,
        isSuccess,
        data: data?.result
    }
}

export const useUpdatePassword = () => {
    const updatePass = async (payload: PasswordDTOType) => {
        const res = await axiosInstance.put('/auth/update-my-password', payload, {
            headers: {
                Authorization: "Bearer "+localStorage.getItem("mm_accessToken")
            }
        })
        return res
    }

    const {mutateAsync, isLoading, error, isSuccess} = useMutation(updatePass)

    return {
        updatePassword: mutateAsync,
        isLoading,
        error,
        isSuccess 
    }
}

export const useGetResetLink = () => {
    const getPasswordLink = async (payload: {email: string}) => {
        const res = await axiosInstance.post('/auth/get-resetLink', payload)
        return res
    }

    const {mutateAsync, isSuccess, error, isLoading} = useMutation(getPasswordLink)

    return {
        getResetLink: mutateAsync,
        isSuccess,
        error,
        isLoading
    }
}

export const useResetPassword = () => {
    const resetPassword = async (payload: {password: string; confirmPassword: string; resetToken: string}) => {
        const res = await axiosInstance.put('/auth/reset-password', payload)
        return res
    }

    const {mutateAsync, isSuccess, isLoading, error} = useMutation(resetPassword)

    return {
        resetPassword: mutateAsync,
        isSuccess,
        isLoading,
        error
    }
}
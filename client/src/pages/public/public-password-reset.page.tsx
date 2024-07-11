import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { InputTextField } from "../../components/my-components/common/form"
import { useForm } from "react-hook-form"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { Button } from "../../components/ui/button"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import Logo from '../../assets/market-matrix-logo-blue.png'
import ContainerComponent from "../../components/my-components/Container.component"
import { useResetPassword } from "../../api/Auth.api"
import { toast } from "react-toastify"

const PasswordDTO = Yup.object({
    password: Yup.string().required().min(8).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,{message: "Password must include A-Z, a-z, 0-9, and special characters like: #,$,@"}),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password")], "Password does not match"),
})

type PasswordDTOType = Yup.InferType<typeof PasswordDTO> 

const PublicPasswordResetPage = () => {
    const {resetToken} = useParams()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const {control, handleSubmit ,setValue, formState: {errors}} = useForm({
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
        resolver: yupResolver(PasswordDTO)
    })

    const navigate = useNavigate()

    const {error,isLoading,isSuccess,resetPassword} = useResetPassword()

    const handlePasswordChange = (data: PasswordDTOType) => {
        const transformedData = {...data, resetToken: resetToken as string}
        resetPassword(transformedData)
    }

    useEffect(() => {
        if(!isSuccess && error){
            let errmsg = ''
            if((error as any).message === 'jwt expired'){
                errmsg = 'Token has been expired!'
            } else if ((error as any).message === 'invalid signature'){
                errmsg = 'Invalid Token!'
            }else {
                errmsg = (error as any).message
            }
            toast.error(errmsg, {closeOnClick: true, draggable: true})
            return
        }
        if(isSuccess){
            toast.success("Password has been changed successfully", {
                closeOnClick: true,
                draggable: true
            })
            setValue("confirmPassword","")
            setValue("password","")
            navigate('/login')
        }
    },[isSuccess,error])

    return (
        <>
            <ContainerComponent>
                <section className="flex items-center justify-center min-h-screen">
                    <div className="flex-1">
                        <img
                            className="mx-auto h-24 w-auto"
                            src={Logo}
                            alt="Your Company"
                        />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <form className="max-w-[450px] flex-1 mb-6" onSubmit={handleSubmit(handlePasswordChange)}>
                            <h2 className="mb-6 text-lg font-semibold">Update Your Password</h2>
                            <div className="mb-6">
                                <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    Your New Password
                                </label>
                                <div className="mt-2 relative">
                                    <InputTextField 
                                    name="password"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    control={control}
                                    errMsg={errors?.password?.message}
                                    />
                                    <button 
                                    type="button" 
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute top-[10px] right-2 text-gray-500 cursor-pointer">
                                    {
                                        isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />
                                    }
                                    </button>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                                <div className="mt-2 relative">
                                    <InputTextField 
                                    name="confirmPassword"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    control={control}
                                    errMsg={errors?.confirmPassword?.message}
                                    />
                                    <button 
                                    type="button" 
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute top-[10px] right-2 text-gray-500 cursor-pointer">
                                    {
                                        isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />
                                    }
                                    </button>
                                </div>
                            </div>
                            
                            <Button variant={'outline'} disabled={isLoading} className={`border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white focus:bg-transparent focus:text-blue-700 px-9 py-5 gap-2 ${isLoading && 'cursor-not-allowed bg-blue-400'}`}>
                                Update
                                {
                                    isLoading && <LoaderComponent color="#ffffff"/>
                                }
                            </Button>
                        </form>
                    </div>
                </section>
            </ContainerComponent>
        </>
    )
}

export default PublicPasswordResetPage
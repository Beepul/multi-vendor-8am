import { useEffect, useState } from "react"
import { InputTextField } from "../../components/my-components/common/form"
import { useForm } from "react-hook-form"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { Button } from "../../components/ui/button"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useUpdatePassword } from "../../api/Auth.api"
import { toast } from "react-toastify"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import ForgotPasswordComponent from "../../components/my-components/Forgot-Password.component"
import { useAuth } from "../../context/auth.context"
import CustomerProfilePage from "../customer/customer-profile.page"

const PasswordDTO = Yup.object({
    oldPassword: Yup.string().required(),
    newPassword: Yup.string().required().min(8).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,{message: "Password must include A-Z, a-z, 0-9, and special characters like: #,$,@"}),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("newPassword")], "Password does not match"),
})

export type PasswordDTOType = Yup.InferType<typeof PasswordDTO> 

const AccountSettingsPage = () => {
    const {loggedInUser} = useAuth()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isModelOpen, setIsModelOpen] = useState(false)

    const {control, handleSubmit , setValue,formState: {errors}} = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        resolver: yupResolver(PasswordDTO)
    })

    const {error,isLoading,isSuccess,updatePassword} = useUpdatePassword()

    const handlePasswordChange = (data: PasswordDTOType) => {
        updatePassword(data)
    }

    useEffect(() => {
        if(!isSuccess && error){
            toast.error((error as any).message, {
                closeOnClick: true,
                draggable: true
            })
            return
        }
        if(isSuccess){
            toast.success("Password has been updated successfully", {
                closeOnClick: true,
                draggable: true
            })
            setValue("confirmPassword", "")
            setValue("newPassword", "")
            setValue("oldPassword", "")
            return
        }
    },[isSuccess,error])
    return (
        <>
            {loggedInUser?.role === "seller" && <div className="mb-16 pb-16 border-b border-gray-300"><CustomerProfilePage /></div>}
            <section>
                <form className="max-w-[450px] mb-6" onSubmit={handleSubmit(handlePasswordChange)}>
                    <h2 className="mb-6 text-2xl font-semibold">Update Your Password</h2>
                    <div className="mb-6">
                        <label htmlFor="oldPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Your Old Password
                        </label>
                        <div className="mt-2 relative">
                            <InputTextField 
                            name="oldPassword"
                            type={isPasswordVisible ? 'text' : 'password'}
                            control={control}
                            errMsg={errors?.oldPassword?.message}
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
                        <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Your New Password
                        </label>
                        <div className="mt-2 relative">
                            <InputTextField 
                            name="newPassword"
                            type={isPasswordVisible ? 'text' : 'password'}
                            control={control}
                            errMsg={errors?.newPassword?.message}
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
                    <span onClick={() => setIsModelOpen(true)} className="cursor-pointer block mb-6 text-sm text-blue-700 underline float-right">Forgot your old password?</span>
                    <Button variant={'outline'} disabled={isLoading} className={`border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white focus:bg-transparent focus:text-blue-700 px-9 py-5 gap-2 ${isLoading && 'cursor-not-allowed bg-blue-400'}`}>
                        Update
                        {
                            isLoading && <LoaderComponent color="#ffffff"/>
                        }
                    </Button>
                </form>
                <ForgotPasswordComponent 
                    isModalOpen={isModelOpen}
                    setIsModalOpen={setIsModelOpen}
                />
            </section>
        </>
    )
}

export default AccountSettingsPage
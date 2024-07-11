import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { InputTextField } from "./common/form"
import { Button } from "../ui/button"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuth } from "../../context/auth.context"
import { useEffect, useState } from "react"
import { useGetResetLink } from "../../api/Auth.api"
import { toast } from "react-toastify"
import LoaderComponent from "./common/Loader.component"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

const ForgotPasswordDTO = Yup.object({
    email: Yup.string().required().email()
}) 

type ForgotPasswordDTOType = Yup.InferType<typeof ForgotPasswordDTO>

type Props = {
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ForgotPasswordComponent = ({isModalOpen, setIsModalOpen}: Props) => {
    const {loggedInUser} = useAuth()

    const {control, handleSubmit ,formState: {errors}, setValue} = useForm({
        defaultValues: {
            email: ""
        },
        resolver: yupResolver(ForgotPasswordDTO)
    })

    const {error,getResetLink,isLoading,isSuccess} = useGetResetLink()

    const handleForgotSubmit = (data:ForgotPasswordDTOType) => {
        getResetLink(data)
    }

    useEffect(() => {
        if(loggedInUser){
            setValue("email", loggedInUser.email)
        }
    },[loggedInUser])
    useEffect(() => {
        if(!isSuccess && error){
            toast.error((error as any).message, {
                closeOnClick: true,
                draggable: true
            })
            return 
        }
        if(isSuccess){
            toast.success("Password reset link has been sent to your mail.", {
                closeOnClick: true, 
                draggable: true
            })
            setIsModalOpen(false)
            return
        }
    },[isSuccess,error])
    return (
        <>
            <AlertDialog open={isModalOpen} >
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="sr-only">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Recover Your Account's Password</AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter your email address to receive a link to change your password.
                    </AlertDialogDescription>
                    <form onSubmit={handleSubmit(handleForgotSubmit)}>
                        <div className="mb-4 mt-2">
                            <InputTextField 
                                control={control}
                                name="email"
                                placeholder="Enter your email"
                                type="email"
                                errMsg={errors?.email?.message}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant={"primary"} disabled={isLoading} className={`${isLoading && 'cursor-not-allowed bg-blue-500'} gap-2`}>
                                Submit
                                {isLoading && <LoaderComponent color="#ffffff" />}
                            </Button>
                            <AlertDialogCancel onClick={() => setIsModalOpen(false)} className="border-blue-800 text-blue-800">Cancel</AlertDialogCancel>
                        </div>
                    </form>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ForgotPasswordComponent
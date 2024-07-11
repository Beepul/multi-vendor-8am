import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useActivateShop, useResendShopActivationLink } from "../../api/Seller.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { toast } from "react-toastify"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Button } from "../../components/ui/button"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { InputTextField } from "../../components/my-components/common/form"
import { useAuth } from "../../context/auth.context"

const emailDTO = Yup.object({
    email: Yup.string().email().required()
})

type EmailDTOType = Yup.InferType<typeof emailDTO>

const SellerActivationPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const {loggedInUser} = useAuth()

    const { token } = useParams()

    const navigate = useNavigate()

    const {error,isLoading,isSuccess} = useActivateShop(token as string)

    const {control,handleSubmit,formState: {errors}, reset} = useForm({
        defaultValues: {
            email: ""
        },
        resolver: yupResolver(emailDTO)
    })

    const {resendActivationFn,isLoading:resendLoading,isSuccess: resendSuccess,error: resendError} = useResendShopActivationLink()


    const handleEmailSubmit = (data: EmailDTOType) => {
        resendActivationFn(data)
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Your Shop has been activated successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            if(loggedInUser){
                loggedInUser.role = 'seller'
            }
        }

        if (!isSuccess && error) {
            toast.error((error as any).message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }, [isSuccess, error, loggedInUser]);

    useEffect(() => {
        if (resendSuccess) {
            toast.success("Activation Link has been sent to your email.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            reset()
            setIsDialogOpen(false)
            navigate('/')
        }

        if (!resendSuccess && resendError) {
            toast.error((resendError as any).message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    },[resendSuccess,resendError])

    if(isLoading){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderComponent color="#1e40af" svgCn="h-20 w-20" />
            </div>
        )
    }

    if(!isSuccess && error){
        return (
            <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-blue-800 text-4xl">Opps!</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Something went wrong</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Something went wrong while activating your shop account, Please try re-sending activation link by clicking the button bellow.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <AlertDialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
                            <AlertDialogTrigger asChild>
                                <Button variant={"primary"}>Send Activation Link</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Send Activation Link</AlertDialogTitle>
                                    <form onSubmit={handleSubmit(handleEmailSubmit)}>
                                        <label htmlFor="email" className="mb-1 text-sm text-gray-600">Enter your email</label>
                                        <InputTextField 
                                            control={control}
                                            name="email"
                                            type="email"
                                            errMsg={errors?.email?.message}
                                        />
                                        <div className="flex items-center  gap-4 py-4">
                                            <Button variant={'primary'} disabled={resendLoading} className={`${resendLoading && 'cursor-not-allowed bg-blue-700'}`}>Send
                                                {
                                                    resendLoading && <LoaderComponent color="#ffffff" />
                                                }
                                            </Button>
                                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                                        </div>
                                    </form>
                                </AlertDialogHeader>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <>
            <Navigate to={'/seller'} />
        </>
    )
}

export default SellerActivationPage
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useAccountActivate, useResendActivationLink } from "../../api/Auth.api"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Button } from "../../components/ui/button"
import { InputTextField } from "../../components/my-components/common/form"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

const emailDTO = Yup.object({
    email: Yup.string().email().required()
})

type EmailDTOType = Yup.InferType<typeof emailDTO>

const PublicActivationPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { activationToken } = useParams()
    const navigate = useNavigate()

    const {data,isLoading,error, isSuccess} = useAccountActivate(activationToken as string)

    const {control,handleSubmit,formState: {errors}} = useForm({
        defaultValues: {
            email: ""
        },
        resolver: yupResolver(emailDTO)
    })

    const {resendActivationFn,isLoading:resendLoading,isSuccess: resendSuccess,error: resendError} = useResendActivationLink()

    const handleEmailSubmit = (data: EmailDTOType) => {
        resendActivationFn(data)
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Account activated successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
    }, [isSuccess, error]);

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
            setIsDialogOpen(false)
            navigate('/login')
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

    if(isLoading) {
        return <>
            <div className="min-h-screen flex items-center justify-center">
                <LoaderComponent 
                    svgCn="h-24 w-24"
                    color="#1E40AF"
                />
            </div>
        </>
    }
    if(error){
        return <>
            <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-blue-800 text-4xl">Opps!</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Something went wrong</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Something went wrong while activating your account, Please try re-sending activation link by clicking the button bellow.</p>
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
                                            {/* <AlertDialogAction type="submit">Send</AlertDialogAction> */}
                                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                                        </div>
                                    </form>
                                </AlertDialogHeader>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </main>

        </>
    }
    return (
        <>
            <Navigate to={'/login'} />
        </>
    )
}

export default PublicActivationPage
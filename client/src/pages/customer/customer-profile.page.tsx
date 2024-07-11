import { HiOutlineCamera } from "react-icons/hi2"
import ProfilePic from "../../assets/profile-placeholder.png"
import { useAuth } from "../../context/auth.context"
import { InputTextField } from "../../components/my-components/common/form"
import { useForm } from "react-hook-form"
import { Button } from "../../components/ui/button"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { useUpdateProfile } from "../../api/Auth.api"
import { toast } from "react-toastify"
import LoaderComponent from "../../components/my-components/common/Loader.component"


const UpdateDTO = Yup.object({
    username: Yup.string().required().min(2).max(50),
    phonenumber: Yup.string().required().min(7).max(10)
})

export type UpdateDTOType = Yup.InferType<typeof UpdateDTO>

const AllowImage = ['image/png','image/jpg','image/jpeg','image/webp']

const CustomerProfilePage = () => {
    const {loggedInUser, setLoggedInUser} = useAuth()

    const [profilePic, setProfilePic] = useState(null)
    const [imageError, setImageError] = useState<string | null>(null)

    const {control,handleSubmit, formState: {errors},setValue} = useForm({
        defaultValues: {
            username: "",
            phonenumber: "",
        },
        resolver: yupResolver(UpdateDTO)
    })

    const {updateProfile,isLoading,error,isSuccess, data} = useUpdateProfile()

    const handleUpdate = (data: UpdateDTOType) => {
        const transformedData = {
            name: data.username,
            phone: data.phonenumber,
            image: profilePic || loggedInUser?.image
        }
        updateProfile(transformedData)
    }

    const handleImageChange = (e: any) => {
        const selectedFile = e.target.files[0]
        if(!AllowImage.includes(selectedFile.type)){
          setImageError("Please select a valid image")
          return
        }
        if(selectedFile.size > 500000){
          setImageError("Image size is too large. Try keeping it minimum 500kb.")
          return
        }
        setProfilePic(selectedFile)
        setImageError(null)
    }

    useEffect(() => {
        if(loggedInUser){
            setValue("username", loggedInUser.name)
            setValue("phonenumber", loggedInUser?.phone || "")
        }
    }, [loggedInUser])

    useEffect(() => {
        if(!isSuccess && error){
            toast.error((error as any).message, {
                draggable: true,
                closeOnClick: true,
            })
            return 
        }
        if(isSuccess && data){
            toast.success("Your profile has been updated successfully.", {
                closeOnClick: true,
                draggable: true
            })
            setLoggedInUser(data)
        }
    }, [isSuccess, error, data])
    return (
        <>
            <div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="flex flex-col gap-3 items-center justify-center mb-8">
                        <span className="h-28 w-28 relative">
                            {
                                profilePic ? (
                                    <img src={URL.createObjectURL(profilePic)} 
                                    alt=""
                                    onError={(e) => e.currentTarget.src = ProfilePic} 
                                    className="object-cover h-28 w-28 rounded-full border-4 border-blue-400" />
                                ) : (
                                    <img src={import.meta.env.VITE_IMAGE_URL+"/uploads/users/"+loggedInUser?.image || ProfilePic} 
                                        crossOrigin="anonymous"
                                        alt=""
                                        onError={(e) => e.currentTarget.src = ProfilePic} 
                                        className="object-cover h-28 w-28 rounded-full border-4 border-blue-400" />
                                )
                            }
                            <label htmlFor="image" className="cursor-pointer absolute bottom-1 -right-2  bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center hover:outline-3 hover:outline hover:outline-blue-400 transition-all duration-300">
                                <HiOutlineCamera className="text-lg" />
                            </label>
                            <input type="file" id="image" className="sr-only" 
                                onChange={handleImageChange}
                            />
                        </span>
                        {imageError && (<span className="text-sm text-red-500">{imageError}</span>)}
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <InputTextField 
                                name="username"
                                control={control}
                                errMsg={errors?.username?.message}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <span className="bg-white pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">{loggedInUser?.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="phonenumber" className="block text-sm font-medium leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <div className="mt-2">
                                <InputTextField 
                                name="phonenumber"
                                control={control}
                                errMsg={errors?.phonenumber?.message}
                                />
                            </div>
                        </div>
                    </div>
                    <Button 
                        variant={'outline'} 
                        disabled={isLoading}
                        className={`border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white focus:bg-transparent focus:text-blue-700 px-9 py-5 gap-1 ${isLoading ? 'cursor-not-allowed bg-blue-300' : ''}`}>
                        Update
                        {isLoading && <LoaderComponent color="#1e40af"/>}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default CustomerProfilePage
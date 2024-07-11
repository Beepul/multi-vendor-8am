import { HiPhoto, HiUserCircle } from "react-icons/hi2"
import ContainerComponent from "../../components/my-components/Container.component"
import { useForm } from "react-hook-form"
import * as Yup from 'yup'
import { InputTextField, TextAreaField } from "../../components/my-components/common/form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/auth.context"
import { useRegisterShop } from "../../api/Seller.api"
import { toast } from "react-toastify"
import LoaderComponent from "../../components/my-components/common/Loader.component"

const SellerRegisterDTO = Yup.object({
  name:  Yup.string().required().min(2).max(50),
  about:  Yup.string().max(200).optional(),
  sellerId:  Yup.string().required(),
  phoneNumber:  Yup.string().required().min(7).max(15),
  addressLine1: Yup.string().required().max(100),
  addressLine2: Yup.string().max(100).optional(),
}) 

type SellerRegisterDTOType = Yup.InferType<typeof SellerRegisterDTO>

const AllowImage = ['image/png','image/jpg','image/jpeg','image/webp']

const SellerRegisterPage = () => {
    const {loggedInUser} = useAuth()

    const {control,handleSubmit , formState: {errors}, setValue, reset} = useForm({
      defaultValues: {
        name: "", 
        about: "", 
        sellerId: "", 
        phoneNumber: "", 
        addressLine1: "",
        addressLine2: "",
      },
      resolver: yupResolver(SellerRegisterDTO)
    }) 

    const [profilePic, setProfilePic] = useState<{image: null | File,error: string | null}>({
      image: null,
      error: null
    })
    const [coverPic, setCoverPic] = useState<{image: null | File,error: string | null}>({
      image: null,
      error: null
    })

    const {error,isLoading,isSuccess,registerShop} = useRegisterShop()

    const handleShopRegister = (data: SellerRegisterDTOType) => {
      const transformedData = {
        ...data,
        profileImg: profilePic.image,
        bannerImg: coverPic.image,
        sellerId: loggedInUser?._id
      }
      registerShop(transformedData)
    }

    const handleUploadImage = (image: File,type: "profile" | "cover") => {
      if(type === "profile"){
        if(!AllowImage.includes(image.type)){
          setProfilePic({
            image: null,
            error: "Please select a valid image"
          })
          return
        }
        if(image.size > 500000){
          setProfilePic({
            image: null,
            error: "Image size is too large. Try keeping it minimum 500kb."
          })
          return
        }
        setProfilePic({
          image: image,
          error: null
        })
      }else{
        if(!AllowImage.includes(image.type)){
          setCoverPic({
            image: null,
            error: "Please select a valid image"
          })
          return
        }
        if(image.size > 500000){
          setCoverPic({
            image: null,
            error: "Image size is too large. Try keeping it minimum 500kb."
          })
          return
        }
        setCoverPic({
          image: image,
          error: null
        })
      }
    }
    const onInvalid = (errors: any) => console.error(errors)

    useEffect(() => {
      if(loggedInUser) setValue("sellerId", loggedInUser._id)
    }, [loggedInUser])

    useEffect(() => {
      if(!isSuccess && error){
        toast.error((error as any).message, {
          closeOnClick: true,
          draggable: true
        })
        return 
      }
      if(isSuccess){
        toast.success(`Your shop has been registerd. Activation link has been sent to your email: ${loggedInUser?.email}`)
        reset()
        setProfilePic({error: null,image:null})
        setCoverPic({error: null, image: null})
        return
      }
    },[isSuccess, error])
    return (
        <>
          <div>
            <ContainerComponent>
              <form onSubmit={handleSubmit(handleShopRegister, onInvalid)}>
                <div className="space-y-12">
                  <div className="pb-16">
                    <div className="text-center mt-10">
                      <h2 className="text-4xl font-semibold mb-4 text-gray-900">Register Your Shop</h2>
                      <p className="mt-1 leading-6 text-gray-600">
                        Please fill all the required field as per your legal documents.
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto mt-16 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="col-span-full">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                          Shop Name
                        </label>
                        <div className="mt-2">
                          <InputTextField 
                            control={control}
                            type="text"
                            name="name"
                            placeholder="Enter your shop name"
                            errMsg={errors.name?.message}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                          About
                        </label>
                        <p className=" text-sm leading-6 text-gray-400">Write a few sentences about your shop.</p>
                        <div className="mt-2">
                          <TextAreaField 
                            control={control}
                            name="about"
                            errMsg={errors.about?.message}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                          Phone Number
                        </label>
                        <div className="mt-2">
                          <InputTextField 
                            control={control}
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter your shop phone number"
                            errMsg={errors.phoneNumber?.message}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="addressLine1" className="block text-sm font-medium leading-6 text-gray-900">
                          Address Line 1
                        </label>
                        <div className="mt-2">
                          <InputTextField 
                            control={control}
                            type="text"
                            name="addressLine1"
                            placeholder="Enter your shop address"
                            errMsg={errors.addressLine1?.message}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="addressLine2" className="block text-sm font-medium leading-6 text-gray-900">
                          Address Line 2 <span className="text-gray-500 font-normal">(optional)</span>
                        </label>
                        <div className="mt-2">
                          <InputTextField 
                            control={control}
                            type="text"
                            name="addressLine2"
                            placeholder="Enter your second shop address if any"
                            errMsg={errors.addressLine2?.message}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                          Shop Profile Picture
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">
                          {
                            profilePic.image ? <img className="h-16 w-16 rounded-full object-cover" src={URL.createObjectURL(profilePic.image)} alt="" /> :
                            <HiUserCircle className="h-16 w-16 text-gray-300" aria-hidden="true" />
                          }
                          <label htmlFor="profile-upload" className=" cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Change
                          </label>
                          <input 
                            id="profile-upload" 
                            name="profile-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={(e) => {
                              if(e.target.files){
                                handleUploadImage(e.target.files[0],"profile")
                              }
                            }}
                            />
                          <span className="text-sm text-red-400">{profilePic.error}</span>
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                          Cover photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          <div className="w-full">
                            {
                              coverPic.image ? <img className="w-full max-h-[350px] object-cover" src={URL.createObjectURL(coverPic.image)} alt="" /> : 
                              <HiPhoto className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                            }
                            <div className="mt-4 text-center text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="cover-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input 
                                  id="cover-upload" 
                                  name="cover-upload" 
                                  type="file" 
                                  className="sr-only" 
                                  onChange={(e) => {
                                    if(e.target.files){
                                      handleUploadImage(e.target.files[0],"cover")
                                    }
                                  }}
                                  />
                              </label>
                            </div>
                            <p className="text-xs text-center mt-1 text-gray-600">PNG, JPG, JPEG, Webp up to 500kb</p>
                            <span className="text-xs text-red-400 text-center inline-block w-full">{coverPic.error}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex items-center gap-2 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isLoading && 'cursor-not-allowed bg-blue-600'}`}
                      >
                        Submit
                        {isLoading && 
                          <LoaderComponent color="#ffffff" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </ContainerComponent>
          </div>
        </>
    )
}

export default SellerRegisterPage
import { useEffect, useRef, useState } from "react"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { MdOutlineFileUpload } from "react-icons/md"
import Logo from "../../assets/market-matrix-logo-blue.png"
import { InputTextField } from "../../components/my-components/common/form"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery } from "react-query"
import { useRegisterUser } from "../../api/Auth.api"
import { toast } from "react-toastify"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { useAuth } from "../../context/auth.context"

const registerDTO = Yup.object({
  username: Yup.string().required().min(2).max(50),
  phonenumber: Yup.string().required().min(7).max(10),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(8).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,{message: "Password must include A-Z, a-z, 0-9, and special characters like: #,$,@"}),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Password doesnot match").required(),
})

type RegisterUserType = Yup.InferType<typeof registerDTO>

const AllowImage = ['image/png','image/jpg','image/jpeg','image/webp']


const PublicRegisterPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [profilePic, setProfilePic] = useState(null)
    const [preview, setPreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null)

    const {loggedInUser} = useAuth()

    const navigate = useNavigate()

    const imgRef = useRef<HTMLInputElement | null>(null)

    const {control, handleSubmit, formState: {errors}, reset} = useForm({
      resolver: yupResolver(registerDTO),
      defaultValues: {
        username: "",
        phonenumber: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    })

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
        setPreview(URL.createObjectURL(selectedFile))
        setProfilePic(selectedFile)
        setImageError(null)
    }

    const handleUploadImage = () => {
        if(imgRef.current){
            imgRef.current.click();
        }
    };

    const {createUser,isLoading, isSuccess} = useRegisterUser() 

    const registerUser = (data: RegisterUserType) => {
      const transformedData = {
        name: data.username,
        email: data.email,
        phone: data.phonenumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        image: profilePic,
      }
      if(profilePic){
        if(!AllowImage.includes((profilePic as any).type)){
          setImageError("Please select a valid image")
          return
        }
        if((profilePic as any).size > 500000){
          setImageError("Image size is too large. Try keeping it minimum 500kb.")
          return
        }
      }
      createUser(transformedData)
      setImageError(null)
    }

    useEffect(() => {
      if (isSuccess) {
        reset({
          username: "",
          confirmPassword: "",
          email: "",
          password: "",
          phonenumber: ""
        })
        setProfilePic(null)
        setPreview(null)
      }
    }, [isSuccess, reset])

    useEffect(() => {
      if(loggedInUser){
        navigate('/')
      }
    },[loggedInUser])

    return (
        <>
          <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
              <img
                className="mx-auto h-16 w-auto"
                src={Logo}
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Create a new account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
              <form className="space-y-6" onSubmit={handleSubmit(registerUser)}>
                <div className="grid grid-cols-2 gap-6">
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
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <InputTextField 
                      name="email"
                      type="email"
                      control={control}
                      errMsg={errors?.email?.message}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
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
                <div>
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

                <div>
                    <label htmlFor="profileimg" className="block text-sm font-medium leading-6 text-gray-900">
                        Upload your profile
                    </label>
                    <div className="mt-2 p-6 flex items-center justify-center border border-dashed border-gray-300 flex-col gap-2 rounded-xl">
                        {!preview && <span className=" flex items-center justify-center h-16 w-16 border border-gray-300 rounded-full">
                            <MdOutlineFileUpload className="text-3xl text-gray-400" />
                        </span>}
                        {preview && <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-full" />}
                        <span className="text-sm text-gray-400 mb-3">Upload image: jpg, jpeg, png, webp. 500kb</span>
                        <Button type="button" onClick={handleUploadImage}>Choose profile</Button>
                    </div>
                    {imageError && (
                      <span className="text-red-500 text-sm">{imageError}</span>
                    )}
                    <input 
                      id="profileimg" 
                      ref={imgRef} 
                      type="file" 
                      onChange={handleImageChange} 
                      className="sr-only" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex w-full items-center gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isLoading ? 'cursor-not-allowed bg-indigo-500' : 'cursor-pointer'}`}
                  >
                    Sign Up
                    {
                      isLoading && (
                        <LoaderComponent color="#ffffff" />
                      )
                    }
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <NavLink to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Login here
                </NavLink>
              </p>
            </div>
          </div>
        </>
    )
}

export default PublicRegisterPage
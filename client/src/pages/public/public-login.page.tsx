import { useEffect, useState } from "react"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import Logo from "../../assets/market-matrix-logo-blue.png"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { InputTextField } from "../../components/my-components/common/form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useLoginUser } from "../../api/Auth.api"
import LoaderComponent from "../../components/my-components/common/Loader.component"
import { toast } from "react-toastify"
import ForgotPasswordComponent from "../../components/my-components/Forgot-Password.component"
import { useAuth } from "../../context/auth.context"

const LoginDTO = Yup.object({
  email: Yup.string().required().email(),
  password: Yup.string().required()
})

export type LoginDTOType = Yup.InferType<typeof LoginDTO>

const LoginPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {loggedInUser,setLoggedInUser} = useAuth()

  const location = useLocation()

  console.log("location state::",location.state)

  const {control, handleSubmit , formState: {errors}} = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: yupResolver(LoginDTO)
  })

  const navigate = useNavigate()

  const {loginUser, isLoading, isSuccess, error, user} = useLoginUser()

  const handleLogin = (data: LoginDTOType) => {
    loginUser(data)
  }

  useEffect(() => {
    if(error){
      toast.error((error as any).message, {
        closeOnClick: true,
        draggable: true,
      })
      return
    }
    if(isSuccess){
      if(user?.detail.status !== "active"){
        toast.error("Please activate your account to continue.", {
          closeOnClick: true,
          draggable: true
        })
        return
      }
      localStorage.setItem("mm_accessToken", user?.token.accessToken as string)
      localStorage.setItem("mm_refreshToken", user?.token.refreshToken as string)

      toast.success("loggin successful", {
        closeOnClick: true,
        draggable: true
      })
      
      setLoggedInUser(user.detail)

      if(user.detail.role !== 'admin'){
        navigate(location.state?.from || '/')
      }else {
        navigate(location.state?.from || '/admin')
      }
    }
  },[isSuccess,error])

  useEffect(() => {
    if(loggedInUser){
      navigate('/')
    }
  },[loggedInUser])

  return (
      <>
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-16 w-auto"
              src={Logo}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <InputTextField 
                    control={control}
                    name="email"
                    type="email"
                    errMsg={errors?.email?.message} 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <span 
                      onClick={() => setIsModalOpen(true)}
                      className="text-blue-800 hover:text-blue-600 underline cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <InputTextField 
                    control={control}
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    errMsg={errors?.password?.message}
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute top-[9px] right-2 text-gray-500 cursor-pointer">
                    {
                      isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />
                    }
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full items-center gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isLoading ? 'cursor-not-allowed bg-indigo-500' : 'cursor-pointer'}`}
                >
                  Sign in
                  {
                      isLoading && (
                        <LoaderComponent color="#ffffff"/>
                      )
                  }
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              <NavLink to={'/register'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Don't have an account?
              </NavLink>
            </p>
          </div>
        </div>
        <ForgotPasswordComponent 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </>
  )
}

export default LoginPage
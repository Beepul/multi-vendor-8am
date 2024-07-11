import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    timeoutErrorMessage: "Server time out",
    headers: {
        "Content-Type": "application/json"
    }
})

const onFulfilled = (response: any) => response.data

const onRejected = (error: any) => {
    if(error.code === "ERR_BAD_REQUEST" || error.code === "ERR_BAD_RESPONSE"){
        throw error.response.data 
    }else {
        throw error
    }
}

axiosInstance.interceptors.response.use(onFulfilled,onRejected)


export default axiosInstance
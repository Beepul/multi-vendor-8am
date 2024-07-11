import { toast } from "react-toastify"
import { useAuth } from "../context/auth.context"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { ReactNode, useEffect, useRef } from "react"
import LoaderComponent from "../components/my-components/common/Loader.component"

type Role = 'customer' | 'seller' | 'admin';

type Props = {
    children: ReactNode,
    allowAccess: Role[]
    prevLocation?: string
}

const PermissionConfig = ({children, allowAccess, prevLocation}: Props) => {
    const {loggedInUser} = useAuth()

    const location = useLocation()

    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!loggedInUser) {
            if (!toastShownRef.current) {
                toast.error("Please login to continue.");
                toastShownRef.current = true;
            }
        } else if (loggedInUser && !allowAccess.includes(loggedInUser.role)) {
            if (!toastShownRef.current) {
                toast.error("You do not have access to this resource.", { closeOnClick: true, draggable: true });
                toastShownRef.current = true;
            }
        }
    }, [loggedInUser, allowAccess]);

    if(loggedInUser && allowAccess.includes(loggedInUser.role)){
        return <>{children}</>
    } else if (loggedInUser && !allowAccess.includes(loggedInUser.role)){
        // toast.error("You do not have access to this resources.", {closeOnClick:true,draggable: true})
        const redirectTo = prevLocation === location.pathname ? '/' + loggedInUser.role : prevLocation;
        return <Navigate to={redirectTo || '/'} />
    } else {
        // toast.error("Please login to continue.")
        return <Navigate to={'/login'} state={{from: location.pathname}} replace />
    }
}

export default PermissionConfig
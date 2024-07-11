import { ReactNode, createContext, useContext, useState } from "react";
import { User } from "../types";

type ContextType = {
    loggedInUser: User | null,
    setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>,
    isUserLoading: boolean,
    setUserLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const dummySetLoggedInUser: React.Dispatch<React.SetStateAction<User | null>> = () => {};

const AuthContext = createContext<ContextType>({
    loggedInUser: null, 
    setLoggedInUser: () => dummySetLoggedInUser,
    isUserLoading: true,
    setUserLoading: () => true
})

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
    const [isUserLoading, setUserLoading] = useState(true)

    return (
        <AuthContext.Provider value={{loggedInUser, setLoggedInUser, isUserLoading, setUserLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}

export default AuthContext
import { ReactNode } from "react";
import { AuthProvider } from "./auth.context";
import { TooltipProvider } from "../components/ui/tooltip";
import { ShopProvider } from "./shop.context";

const CombinedProviders = ({children}: {children: ReactNode}) => {
    return (
        <AuthProvider>
            <ShopProvider>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </ShopProvider>
        </AuthProvider>
    )
}

export default CombinedProviders
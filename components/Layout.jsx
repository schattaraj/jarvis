import { useRouter } from "next/router";
import Navigation from "./navigation";
import Sidebar from "./sidebar";
import { useContext, useEffect } from "react";
import { Context } from "../contexts/Context";

export default function Layout({ children }) {
   const context = useContext(Context)
    const router = useRouter()
    const backgroundRoutes = ['/admin','/BusinessActivity','/marketAnalytics','/compareStocks']
    const isBackgroundRoutes = backgroundRoutes.includes(router.pathname)
    return (
        <div className={isBackgroundRoutes ? "container-scroller background" : "container-scroller"}>
            <Navigation />
            <div className="container-fluid page-body-wrapper">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

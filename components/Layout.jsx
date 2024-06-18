import { useRouter } from "next/router";
import Navigation from "./navigation";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
    const router = useRouter()
    return (
        <div className="container-scroller background">
            <Navigation />
            <div className="container-fluid page-body-wrapper">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

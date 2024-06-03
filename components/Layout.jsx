import Navigation from "./navigation";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
    return (
        <div className="container-scroller">
            <Navigation />
            <div className="container-fluid page-body-wrapper">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

import {
    Outlet,
} from "react-router-dom";

import Sidebar from "../components/app/Sidebar";
import Topbar from "../components/app/Topbar";
import MobileNav from "../components/app/MobileNav";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-command-black text-command-white">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                        <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-6 lg:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            <MobileNav />
        </div>
    );
};

export default AppLayout;

import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    const location =
        useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-command-black text-command-white">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-command-green" />

                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-command-muted">
                        Loading workspace
                    </span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-command-black flex items-center justify-center">
                <div className="text-sm text-command-muted font-mono">
                    Checking access...
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    logout as logoutRequest,
} from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({
    children,
}) => {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const loadUser = async () => {
        try {
            const data =
                await getCurrentUser();
            setUser(
                data.user || data
            );
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const refreshUser = async () => {
        try {
            const data =
                await getCurrentUser();

            const currentUser =
                data.user || data;

            setUser(currentUser);

            return currentUser;
        } catch (error) {
            setUser(null);
            return null;
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user),
        refreshUser,
        logout,
    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return context;
};

export default AuthContext;

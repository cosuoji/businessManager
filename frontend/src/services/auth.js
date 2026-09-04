import api from "./api";

export const register = async (
    userData
) => {
    return api.post(
        "/auth/register",
        userData
    );
};

export const login = async (
    credentials
) => {
    return api.post(
        "/auth/login",
        credentials
    );
};

export const logout = async () => {
    return api.post("/auth/logout");
};

export const getCurrentUser =
    async () => {
        return api.get("/auth/me");
    };

export const forgotPassword =
    async (email) => {
        return api.post(
            "/auth/forgot-password",
            { email }
        );
    };

export const resetPassword = async (
    token,
    password
) => {
    return api.post(
        `/auth/reset-password/${token}`,
        {
            password,
        }
    );
};

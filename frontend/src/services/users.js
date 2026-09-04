import api from "./api";

export const updateCurrentUser =
    async (userData) => {
        return api.patch(
            "/auth/me",
            userData
        );
    };

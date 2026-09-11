import api from "./api";

export const getAdminMe = async () => {
    return api.get("/admin/me");
};

export const getAdminUsers = async ({
    page = 1,
    limit = 20,
    search = "",
    plan = "",
    status = "",
} = {}) => {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (search) {
        params.set("search", search);
    }

    if (plan) {
        params.set("plan", plan);
    }

    if (status) {
        params.set("status", status);
    }

    return api.get(
        `/admin/users?${params.toString()}`
    );
};

export const getAdminUser = async (id) => {
    return api.get(`/admin/users/${id}`);
};

export const suspendAdminUser = async (id) => {
    return api.post(
        `/admin/users/${id}/suspend`
    );
};

export const restoreAdminUser = async (id) => {
    return api.post(
        `/admin/users/${id}/restore`
    );
};

export const grantProToUser = async (
    id,
    days
) => {
    return api.post(
        `/admin/users/${id}/grant-pro`,
        { days }
    );
};

export const revokeProFromUser = async (id) => {
    return api.post(
        `/admin/users/${id}/revoke-pro`
    );
};

export const getAdminAuditLogs = async ({
    page = 1,
    limit = 20,
    action = "",
    adminId = "",
    targetType = "",
    targetId = "",
} = {}) => {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (action) {
        params.set("action", action);
    }

    if (adminId) {
        params.set("adminId", adminId);
    }

    if (targetType) {
        params.set("targetType", targetType);
    }

    if (targetId) {
        params.set("targetId", targetId);
    }

    return api.get(
        `/admin/audit-logs?${params.toString()}`
    );
};

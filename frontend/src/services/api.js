const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const apiRequest = async (
    endpoint,
    options = {}
) => {
    const {
        headers = {},
        responseType = "json",
        ...requestOptions
    } = options;

    const response = await fetch(
        `${API_URL}/v1${endpoint}`,
        {
            ...requestOptions,

            credentials: "include",

            headers: {
                "Content-Type":
                    "application/json",
                ...headers,
            },
        }
    );

    if (!response.ok) {
        let data = null;

        try {
            data =
                responseType === "blob"
                    ? await response.json()
                    : await response.json();
        } catch {
            data = null;
        }

        const error = new Error(
            data?.message ||
                "Something went wrong."
        );

        error.status =
            response.status;

        error.data = data;

        throw error;
    }

    if (responseType === "blob") {
        return await response.blob();
    }

    return await response.json();
};

export const api = {
    get: (
        endpoint,
        options = {}
    ) =>
        apiRequest(endpoint, {
            ...options,
            method: "GET",
        }),

    post: (
        endpoint,
        body,
        options = {}
    ) =>
        apiRequest(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: (
        endpoint,
        body,
        options = {}
    ) =>
        apiRequest(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    patch: (
        endpoint,
        body,
        options = {}
    ) =>
        apiRequest(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: (
        endpoint,
        options = {}
    ) =>
        apiRequest(endpoint, {
            ...options,
            method: "DELETE",
        }),
};

export default api;

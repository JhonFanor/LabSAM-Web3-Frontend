let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
        const resp = await fetch("http://localhost:8080/api/auth/token/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (!resp.ok) {
            localStorage.removeItem("access_token");
            return null;
        }

        const { access_token } = await resp.json();
        localStorage.setItem("access_token", access_token);
        return access_token;
        })();

        refreshPromise.finally(() => {
        refreshPromise = null;
        });
    }

    return refreshPromise;
}

export const FetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit = {},
  retry = true
): Promise<Response> => {
    let token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No hay sesión activa. Inicia sesión.");
    }

    const buildHeaders = (t: string | null) => {
        const headers: Record<string, string> = {
        ...(init.headers as Record<string, string> || {}),
        };
        if (!(init.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        }
        if (t) {
        headers["Authorization"] = `Bearer ${t}`;
        }
        return headers;
    };

    const doRequest = (t: string | null) =>
        fetch(input, {
        ...init,
        headers: buildHeaders(t),
        credentials: "include",
        });

    let response = await doRequest(token);

    if (response.status === 401 && retry) {
        const newToken = await refreshToken();
        if (!newToken) {
        throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
        }
        return doRequest(newToken);
    }

    return response;
};

export const FetchWithOptionalAuth = async (
  input: RequestInfo,
  init: RequestInit = {},
  retry = true
): Promise<Response> => {
    let token = localStorage.getItem("access_token") || null;

    const buildHeaders = (t: string | null) => {
        const headers: Record<string, string> = {
        ...(init.headers as Record<string, string> || {}),
        };
        if (!(init.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        }
        if (t) {
        headers["Authorization"] = `Bearer ${t}`;
        }
        return headers;
    };

    const doRequest = (t: string | null) =>
        fetch(input, {
        ...init,
        headers: buildHeaders(t),
        credentials: "include",
        });

    let response = await doRequest(token);

    if (response.status === 401 && retry && token) {
        const newToken = await refreshToken();
        if (!newToken) {
        localStorage.removeItem("access_token");
        return doRequest(null);
        }
        return doRequest(newToken);
    }

    return response;
};

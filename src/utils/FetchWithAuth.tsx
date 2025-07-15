export const FetchWithAuth = async (input: RequestInfo, init: RequestInit = {}, retry = true ): Promise<Response> => {
  let token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No hay sesión activa. Inicia sesión.");
  }

  const doRequest = async (tokenToUse: string) => {
    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${tokenToUse}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  let response = await doRequest(token);

  if (response.status === 401 && retry) {
    const refresh = await fetch("http://localhost:8080/api/auth/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refresh.ok) {
      localStorage.removeItem("access_token");
      throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }

    const { access_token } = await refresh.json();
    localStorage.setItem("access_token", access_token);

    return doRequest(access_token);
  }

  return response;
};

export const FetchWithOptionalAuth = async (
  input: RequestInfo,
  init: RequestInit = {},
  retry = true
): Promise<Response> => {
  const token = localStorage.getItem("access_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers ? init.headers as Record<string, string> : {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const doRequest = async (customHeaders: Record<string, string>) => {
    return fetch(input, {
      ...init,
      headers: customHeaders,
      credentials: "include",
    });
  };

  let response = await doRequest(headers);

  if (response.status === 401 && retry && token) {
    const refresh = await fetch("http://localhost:8080/api/auth/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refresh.ok) {
      localStorage.removeItem("access_token");

      delete headers["Authorization"];
      return doRequest(headers);
    }

    const { access_token } = await refresh.json();
    localStorage.setItem("access_token", access_token);

    headers["Authorization"] = `Bearer ${access_token}`;
    return doRequest(headers);
  }

  return response;
};
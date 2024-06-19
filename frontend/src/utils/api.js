import CustomError from './CustomError';

export async function loginUser(creds) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/login`,
        { method: "POST", body: JSON.stringify(creds), headers: { 'Content-Type': 'application/json' }, }
    )
    const data = await res.json()

    if (!res.ok) {
        throw new CustomError(data.message, res.statusText, res.status);
    }

    return { ok: true, data: data };
}

export async function signupUser(creds) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/register`,
        { method: "POST", body: JSON.stringify(creds), headers: { 'Content-Type': 'application/json' }, }
    )
    const data = await res.json()

    if (!res.ok) {
        throw new CustomError(data.message, res.statusText, res.status);
    }

    return { ok: true, data: data };
}

export async function getUserData() {
    const token = localStorage.getItem("authToken")
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/user`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    )
    const data = await res.json()

    if (!res.ok) {
        throw new CustomError(data.message, res.statusText, res.status);
    }

    return { ok: true, data: data };

}
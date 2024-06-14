import CustomError from './CustomError';

export async function loginUser(creds){
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/login`,
        { method: "post", body: JSON.stringify(creds), headers: { 'Content-Type': 'application/json' }, }
    )
    const data = await res.json()

    if (!res.ok) {
        throw new CustomError(data.message, res.statusText, res.status);
    }

    return {ok: true, data: data};
}
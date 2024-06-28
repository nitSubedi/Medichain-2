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
    );
    const data = await res.json()

    if (!res.ok) {
        throw new CustomError(data.message, res.statusText, res.status);
    }

    return { ok: true, data: data };

}

export async function updatePatientData(patientAddress, contractName, newData) {
    const token = localStorage.getItem("authToken");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/updatePatientData`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            patientAddress,
            contractName,
            newData
        })
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(`Error updating patient data: ${data.message}`);
    }

    return { ok: true, data: data };
}

export async function getPatientData(patientAddress) {
    const token = localStorage.getItem("authToken");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/patientData?patientAddress=${patientAddress}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(`Error fetching patient data: ${data.message}`);
    }

    return { ok: true, data: data };
}

export async function grantReadAccess(patientAddress, providerAddress) {
    const token = localStorage.getItem("authToken");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/grantReadAccess`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientAddress, providerAddress })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to grant read access');
    }

    return await res.json();
}

export async function revokeReadAccess(patientAddress, providerAddress) {
    const token = localStorage.getItem("authToken");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/revokeReadAccess`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientAddress, providerAddress })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to revoke read access');
    }

    return await res.json();
}

export async function grantUpdateAccess(patientAddress, providerAddress) {
    const token = localStorage.getItem("authToken");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/grantUpdateAccess`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientAddress, providerAddress })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to grant update access');
    }

    return await res.json();
}

export async function revokeUpdateAccess(patientAddress, providerAddress) {
    const token = localStorage.getItem("authToken");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const res = await fetch(`${apiBaseUrl}/api/auth/revokeUpdateAccess`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ patientAddress, providerAddress })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to revoke update access');
    }

    return await res.json();
}


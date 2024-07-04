// pages/api/login.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const loginDetails = req.body;

    try {
        // First, invalidate the session
        const sessionOutResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}authentication/sessionOut?username=${loginDetails.userName}`);
        const sessionOutResult = await sessionOutResponse.json();

        // Then, authenticate the user
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}authentication/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        });

        const loginResult = await loginResponse.json();

        if (loginResult?.statusCode === 4004) {
            return res.status(400).json({ message: loginResult?.message });
        }

        if (loginResult?.statusCode === 0) {
            const { accessToken, sessionId } = loginResult?.payload;
            return res.status(200).json({ accessToken, sessionId });
        }

        return res.status(500).json({ message: 'Unexpected error occurred' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

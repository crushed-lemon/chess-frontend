const BASE_URL = 'https://www.crushed-lemon.com/apps/chess/api';

const SubmitUserName = async (userName) => {
    try {
        const response = await fetch(`${BASE_URL}/submit-username`, {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (ex) {
    }
}

export { SubmitUserName };
export class UserAPI {
    async updateUser(user) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:8080/Heladiva/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            const text = await response.text();
            console.log("Raw API Response:", text);

            if (!response.ok) {
                throw new Error(`Update User request failed: ${response.status}`);
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('Invalid JSON response: ' + text);
            }

            return data;
        } catch (error) {
            console.error("Error in updateUser:", error);
            throw error;
        }
    }
}

export class ContactAPI{
    async sendMessage(contactModel) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:8080/Heladiva/api/user/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(contactModel)
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}
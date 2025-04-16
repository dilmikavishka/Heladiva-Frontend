export class OrderAPI{
    async Order(order) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:8080/Heladiva/api/Order/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(order)
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

    async getById(orderId) {
        try {
            const token = localStorage.getItem("authToken"); // Get token inside the function

            console.log("Using Token:", token); // Debugging

            if (!token) {
                throw new Error("No authentication token found.");
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            console.log("Request Headers:", headers);

            const response = await fetch(`http://localhost:8080/Heladiva/api/Order/getById/${orderId}`, {
                method: "GET",
                headers: headers,
            });

            console.log("Response Status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status: ${response.status}, Response: ${errorText}`);
            }

            return await response.json(); // Added await
        } catch (error) {
            console.error("Error fetching article by ID:", error);
            throw error;
        }
    }
}
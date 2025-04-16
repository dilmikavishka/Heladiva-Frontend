export class ProductAPI{
    async getAll() {
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                throw new Error("No authentication token found.");
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            console.log("Request Headers:", headers); // Debugging

            const response = await fetch("http://localhost:8080/Heladiva/api/product/getAll", {
                method: "GET",
                headers: headers,
            });

            console.log("Response Status:", response.status); // Debugging

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status: ${response.status}, Response: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching articles:", error);
            throw error;
        }
    }

    async getById(productId) {
        try {
            const token = localStorage.getItem("authToken");

            console.log("Using Token:", token);

            if (!token) {
                throw new Error("No authentication token found.");
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            console.log("Request Headers:", headers);

            const response = await fetch(`http://localhost:8080/Heladiva/api/product/${productId}`, {
                method: "GET",
                headers: headers,
            });

            console.log("Response Status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status: ${response.status}, Response: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching article by ID:", error);
            throw error;
        }
    }
}
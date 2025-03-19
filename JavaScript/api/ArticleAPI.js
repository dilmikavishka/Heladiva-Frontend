export class ArticleAPI {
    async getAll() {
        try {
            const token = localStorage.getItem("authToken"); // Get token inside the function

            if (!token) {
                throw new Error("No authentication token found.");
            }

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            console.log("Request Headers:", headers); // Debugging

            const response = await fetch("http://localhost:8080/Heladiva/api/article/getAll", {
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

    async getById(articleId) {
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

            console.log("Request Headers:", headers); // Debugging

            const response = await fetch(`http://localhost:8080/Heladiva/api/article/${articleId}`, {
                method: "GET",
                headers: headers,
            });

            console.log("Response Status:", response.status); // Debugging

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

export class AdminMedicineAPI {
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

            const response = await fetch("http://localhost:8080/Heladiva/api/medicine/getAll", {
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

    async getById(medicalID) {
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

            const response = await fetch(`http://localhost:8080/Heladiva/api/medicine/${medicalID}`, {
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

    async create(medicineData) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:8080/Heladiva/api/medicine/admin/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(medicineData)
            });

            const text = await response.text();
            console.log("Raw API Response:", text);

            if (!response.ok) {
                throw new Error(`Create Medicine request failed: ${response.status}`);
            }

            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (error) {
                throw new Error('Invalid JSON response: ' + text);
            }

            return data;
        } catch (error) {
            console.error("Error in createArticle:", error);
            throw error;
        }
    }

    async update(medicineData) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:8080/Heladiva/api/medicine/admin/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(medicineData)
            });

            const text = await response.text();
            console.log("Raw API Response:", text);

            if (!response.ok) {
                throw new Error(`Update Medicine request failed: ${response.status}`);
            }

            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (error) {
                throw new Error('Invalid JSON response: ' + text);
            }

            return data;
        } catch (error) {
            console.error("Error in updateArticle:", error);
            throw error;
        }
    }

    async delete(medicalID) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:8080/Heladiva/api/medicine/admin/delete/${medicalID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });

            const text = await response.text();
            console.log("Raw API Response:", text);

            if (!response.ok) {
                throw new Error(`Delete Medicine request failed: ${response.status}`);
            }

            return text;
        } catch (error) {
            console.error("Error in deleteArticle:", error);
            throw error;
        }
    }
}
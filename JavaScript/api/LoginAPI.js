
export class LoginAPI {
    async login(signInModel) {
        try {
            const response = await fetch('http://localhost:8080/Heladiva/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signInModel)
            });

            if (!response.ok) {
                throw new Error("Login request failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async register(signUpModel) {
        try {
            const response = await fetch('http://localhost:8080/Heladiva/api/auth/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpModel)
            });

            if (!response.ok) {
                throw new Error("Signup request failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

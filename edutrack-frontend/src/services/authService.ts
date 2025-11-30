const API_URL = "http://localhost:8081/auth";

export const authService = {

  // LOGIN : CORRIGÉ POUR LIRE LE JSON
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // On tente de lire le message d'erreur JSON, sinon texte
        try {
            const errJson = await response.json();
            throw new Error(errJson.message || "Identifiants incorrects");
        } catch (e) {
            throw new Error("Identifiants incorrects");
        }
      }

      // IMPORTANT : Le backend renvoie du JSON { token: "...", role: "..." }
      const data = await response.json();
      
      // On stocke le token brut
      localStorage.setItem("token", data.token);
      return data.token;
    } catch (error) {
      throw error;
    }
  },

  // SIGNUP
  signup: async (username: string, password: string, role: string) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Erreur lors de l'inscription");
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  }
};
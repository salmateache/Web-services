import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8081/auth";

interface DecodedToken {
  sub: string; // Le username (matricule ou email)
  role: string;
  exp: number;
}

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        try {
            const errJson = await response.json();
            throw new Error(errJson.message || "Identifiants incorrects");
        } catch (e) {
            throw new Error("Identifiants incorrects");
        }
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      return data.token;
    } catch (error) {
      throw error;
    }
  },

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

  // --- NOUVELLE MÉTHODE CHANGE PASSWORD ---
  changePassword: async (oldPassword: string, newPassword: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non connecté");

    // On récupère le username depuis le token pour savoir QUI change son mot de passe
    const decoded: any = jwtDecode(token);
    const username = decoded.sub;

    const response = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ username, oldPassword, newPassword }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erreur lors du changement de mot de passe");
    }
    return await response.json();
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
  },

  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return {
        username: decoded.sub,
        role: decoded.role
      };
    } catch (error) {
      return null;
    }
  }
};
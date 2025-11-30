// src/services/professorService.ts
const PROFESSOR_API_URL = "http://localhost:8083/api/professors";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Aucun jeton d'authentification trouvé. Veuillez vous reconnecter.");
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const professorService = {
    getAllProfessors: async () => {
        const headers = getAuthHeaders();
        const response = await fetch(PROFESSOR_API_URL, { method: 'GET', headers });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) throw new Error("Accès refusé. Token invalide ou expiré.");
            throw new Error(`Échec de la récupération des professeurs (Status: ${response.status}).`);
        }
        return response.json();
    },

    getProfessorById: async (id: number) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${PROFESSOR_API_URL}/${id}`, { method: 'GET', headers });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) throw new Error("Accès refusé. Token invalide ou expiré.");
            throw new Error(`Impossible de charger le professeur (Status: ${response.status}).`);
        }
        return response.json();
    },

    addProfessor: async (professorData: any) => {
        const headers = getAuthHeaders();
        const response = await fetch(PROFESSOR_API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(professorData),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
            throw new Error(`Échec de l'ajout du professeur (Status: ${response.status}): ${errorBody.message || response.statusText}`);
        }
        return response.json();
    },

    updateProfessor: async (id: number, data: any) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${PROFESSOR_API_URL}/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
            throw new Error(`Échec de la mise à jour (Status: ${response.status}): ${errorBody.message || response.statusText}`);
        }
        return response.json();
    },

    deleteProfessor: async (id: number) => {
        const headers = getAuthHeaders();
        const response = await fetch(`${PROFESSOR_API_URL}/${id}`, {
            method: 'DELETE',
            headers,
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) throw new Error("Accès refusé. Token invalide ou expiré.");
            const errorBody = await response.json().catch(() => ({ message: 'Échec de la suppression' }));
            throw new Error(`Échec de la suppression du professeur (Status: ${response.status}): ${errorBody.message || response.statusText}`);
        }
        return true;
    }
};

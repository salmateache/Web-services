import axios from 'axios';

// URL principale du service de notes (port 8084)
const API_URL = 'http://localhost:8084/api/notes';
// NOUVEL ENDPOINT : L'API Reclamations que nous avons créée
const RECLAMATION_API_URL = 'http://localhost:8084/api/reclamations'; 

export interface Note {
    id?: number;
    valeur: number;
    idEtudiant: number;
    idModule: number;
    remarque?: string;
}

class NoteService {
    
    // Fonction pour récupérer le token (Indispensable)
    private getConfig() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    }

    getAllNotes() {
        return axios.get<Note[]>(API_URL, this.getConfig());
    }

    getNoteById(id: number) {
        return axios.get<Note>(`${API_URL}/${id}`, this.getConfig());
    }

    getNotesByEtudiant(idEtudiant: number) {
        return axios.get<Note[]>(`${API_URL}/etudiant/${idEtudiant}`, this.getConfig());
    }

    getNotesByModule(idModule: number) {
        return axios.get<Note[]>(`${API_URL}/module/${idModule}`, this.getConfig());
    }

    createNote(note: Note) {
        return axios.post<Note>(API_URL, note, this.getConfig());
    }

    updateNote(id: number, note: Note) {
        return axios.put<Note>(`${API_URL}/${id}`, note, this.getConfig());
    }

    deleteNote(id: number) {
        return axios.delete(`${API_URL}/${id}`, this.getConfig());
    }

    getMoyenne(idEtudiant: number) {
        return axios.get<number>(`${API_URL}/moyenne/${idEtudiant}`, this.getConfig());
    }
    
    getBulletin(idEtudiant: number, semestre: number) {
        return axios.get<any>(`${API_URL}/bulletin/${idEtudiant}/${semestre}`, this.getConfig());
    }

    // --- NOUVELLE MÉTHODE : SOUMISSION DE RÉCLAMATION ---
    async submitReclamation(data: { idEtudiant: number, idModule: number, motif: string }) {
        const config = this.getConfig();
        const response = await axios.post<any>(RECLAMATION_API_URL, data, config);
        
        return response.data;
    }

    // --- ✅ CORRECTION : RÉCUPÉRATION DES RÉCLAMATIONS PAR ÉTUDIANT ---
    async getReclamationsByEtudiant(idEtudiant: number) {
        const config = this.getConfig();
        const RECLAMATION_ETUDIANT_URL = `${RECLAMATION_API_URL}/etudiant/${idEtudiant}`;
        
        const response = await axios.get<any[]>(RECLAMATION_ETUDIANT_URL, config);
        
        return response.data; // 👈 C'EST CETTE LIGNE QUI MANQUAIT !
    }

    // ✅ AJOUT 2 : RÉCUPÉRATION DES RÉCLAMATIONS PAR PROFESSEUR (NÉCESSAIRE POUR LA PAGE DU PROF)
    async getReclamationsByProfesseur(idProf: number) {
        const config = this.getConfig();
        const RECLAMATION_PROF_URL = `${RECLAMATION_API_URL}/professeur/${idProf}`;
        const response = await axios.get<any[]>(RECLAMATION_PROF_URL, config);
        return response.data;
    }
    
    // ✅ AJOUT 3 : MISE À JOUR DU STATUT DE LA RÉCLAMATION
    async updateReclamationStatus(reclamationId: number, newStatus: string) {
        const config = this.getConfig();
        const payload = { statut: newStatus }; // Le backend attend un JSON avec le nouveau statut
        const RECLAMATION_UPDATE_URL = `${RECLAMATION_API_URL}/${reclamationId}/status`;
        
        const response = await axios.put<any>(RECLAMATION_UPDATE_URL, payload, config);
        return response.data;
    }
}

export default new NoteService();
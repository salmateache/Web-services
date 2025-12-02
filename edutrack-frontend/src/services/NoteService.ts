import axios from 'axios';

// CORRECTION : URL complète vers le backend
const API_URL = 'http://localhost:8084/api/notes';

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

    // ... (autres méthodes)
    
    // Modification pour accepter le semestre
    getBulletin(idEtudiant: number, semestre: number) {
        // Appel : /api/notes/bulletin/4/2  (Etudiant 4, Semestre 2)
        return axios.get<any>(`${API_URL}/bulletin/${idEtudiant}/${semestre}`, this.getConfig());
    }
}

export default new NoteService();
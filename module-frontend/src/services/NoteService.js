import axios from 'axios';

const API_URL = '/api/notes';

class NoteService {
    getAllNotes() {
        return axios.get(API_URL);
    }

    getNoteById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    getNotesByEtudiant(idEtudiant) {
        return axios.get(`${API_URL}/etudiant/${idEtudiant}`);
    }

    getNotesByModule(idModule) {
        return axios.get(`${API_URL}/module/${idModule}`);
    }

    createNote(note) {
        return axios.post(API_URL, note);
    }

    updateNote(id, note) {
        return axios.put(`${API_URL}/${id}`, note);
    }

    deleteNote(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
    getMoyenne(idEtudiant) {
        return axios.get(`${API_URL}/moyenne/${idEtudiant}`);
    }
    getBulletin(idEtudiant) {
        return axios.get(`${API_URL}/bulletin/${idEtudiant}`);
    }
}

export default new NoteService();
import axios from 'axios';

// 1. URL correcte vers le Backend (Port 8084)
const API_URL = 'http://localhost:8084/api/modules';

// 2. Interface qui correspond EXACTEMENT à votre JSON Postman
export interface Module {
    id_module?: number;      // Postman: "id_module"
    code_module: string;     // Postman: "code_module"
    nom_module: string;      // Postman: "nom_module"
    coefficient: number;     
    semestre: number; 
}

class ModuleService {
    
    // Fonction privée pour récupérer le Token stocké lors du Login
    private getConfig() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`, // Indispensable pour Spring Security
                'Content-Type': 'application/json'
            }
        };
    }

    getAllModules() {
        // On passe this.getConfig() à chaque appel
        return axios.get<Module[]>(API_URL, this.getConfig());
    }

    getModuleById(id: number) {
        return axios.get<Module>(`${API_URL}/${id}`, this.getConfig());
    }

    createModule(module: Module) {
        return axios.post<Module>(API_URL, module, this.getConfig());
    }

    updateModule(id: number, module: Module) {
        return axios.put<Module>(`${API_URL}/${id}`, module, this.getConfig());
    }

    deleteModule(id: number) {
        return axios.delete(`${API_URL}/${id}`, this.getConfig());
    }
}

export default new ModuleService();
import axios from 'axios';

const API_URL = 'http://localhost:8084/api/modules';

export interface Module {
    id_module?: number;
    code_module: string;
    nom_module: string;
    coefficient: number;
    semestre: number; 
    idProfesseur?: number | null;   // <-- AJOUT OBLIGATOIRE
}


class ModuleService {
    private getConfig() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    }

    getAllModules() {
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

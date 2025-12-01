import axios from 'axios';

const API_URL = '/api/modules';

class ModuleService {
    getAllModules() {
        return axios.get(API_URL);
    }

    getModuleById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    createModule(module) {
        return axios.post(API_URL, module);
    }

    updateModule(id, module) {
        return axios.put(`${API_URL}/${id}`, module);
    }

    deleteModule(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new ModuleService();
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Loader2, AlertCircle, X, Save, User, Search } from "lucide-react";
import ModuleService from '../../services/ModuleService';
import axios from 'axios';

const PROF_API_URL = "http://localhost:8083/api/professors";

export default function ModuleList() {
  const [modules, setModules] = useState([]); 
  const [professorsList, setProfessorsList] = useState([]); 
  const [professorsMap, setProfessorsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code_module: '',
    nom_module: '',
    coefficient: '',
    semestre: '',
    id_prof: '' 
  });

  useEffect(() => {
    loadData();
  }, []);

  const getAuthHeader = () => {
      const token = localStorage.getItem('token');
      return { headers: { Authorization: `Bearer ${token}` } };
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
        const profResponse = await axios.get(PROF_API_URL, getAuthHeader());
        const profs = profResponse.data;
        setProfessorsList(profs);

        const profMap = {};
        if (Array.isArray(profs)) {
            profs.forEach(p => {
                profMap[p.id] = `${p.nom.toUpperCase()} ${p.prenom}`;
            });
        }
        setProfessorsMap(profMap);

        const modResponse = await ModuleService.getAllModules();
        let modulesData = [];
        if (Array.isArray(modResponse.data)) {
            modulesData = modResponse.data;
        } else if (modResponse.data && Array.isArray(modResponse.data.content)) {
            modulesData = modResponse.data.content;
        }
        setModules(modulesData);

    } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Impossible de charger les données (Vérifiez les services).");
    } finally {
        setLoading(false);
    }
  };

  const deleteModule = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      ModuleService.deleteModule(id)
        .then(() => loadData())
        .catch(error => alert('Erreur: ' + error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
        ...formData, 
        [name]: (name === 'coefficient' || name === 'semestre') ? Number(value) : value 
    });
  };

  const saveModule = () => {
    const dataToSend = { ...formData, id_prof: formData.id_prof ? Number(formData.id_prof) : null };
    ModuleService.createModule(dataToSend)
      .then(() => { setShowAddModal(false); resetForm(); loadData(); })
      .catch(err => alert('Erreur: ' + err.message));
  };

  const updateModule = () => {
    const dataToSend = { ...formData, id_prof: formData.id_prof ? Number(formData.id_prof) : null };
    ModuleService.updateModule(editId, dataToSend)
      .then(() => { setShowEditModal(false); loadData(); })
      .catch(err => alert('Erreur: ' + err.message));
  };

  const resetForm = () => {
      setFormData({ code_module: '', nom_module: '', coefficient: '', semestre: '', id_prof: '' });
  };

  const openEditModal = (module) => {
    setEditId(module.id_module);
    setFormData({
      code_module: module.code_module,
      nom_module: module.nom_module,
      coefficient: module.coefficient,
      semestre: module.semestre,
      id_prof: module.id_prof || ''
    });
    setShowEditModal(true);
  };

  // Filtrage modules
  const filteredModules = modules.filter(m => {
      const search = searchTerm.toLowerCase();
      const profName = professorsMap[m.id_prof] || "";
      return m.code_module.toLowerCase().includes(search) ||
             m.nom_module.toLowerCase().includes(search) ||
             profName.toLowerCase().includes(search);
  });

  const renderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input 
                type="text" name="code_module" value={formData.code_module} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="M101"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
            <input 
                type="text" name="nom_module" value={formData.nom_module} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Analyse"
            />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Responsable (Professeur)</label>
        <select 
            name="id_prof" value={formData.id_prof} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        >
            <option value="">-- Sélectionner un professeur --</option>
            {professorsList.map(prof => (
                <option key={prof.id} value={prof.id}>
                    {prof.nom.toUpperCase()} {prof.prenom} ({prof.specialite || "Général"})
                </option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
            <input 
                type="number" name="coefficient" value={formData.coefficient} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
            <input 
                type="number" name="semestre" value={formData.semestre} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-0 font-sans bg-gray-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Modules</h1>
            <p className="text-gray-500 text-sm mt-1">{filteredModules.length} module(s) trouvé(s)</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Filtrer (Code, Nom, Prof)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64"
                />
            </div>
            <button 
                onClick={() => { resetForm(); setShowAddModal(true); }} 
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-md whitespace-nowrap"
            >
            <Plus size={20} /> Ajouter
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="mr-2" size={20} /><strong>Erreur:</strong> {error}
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 italic">Aucun module ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Code</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Module</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Responsable</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-center">Coeff.</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-center">Sem.</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredModules.map(module => (
                  <tr key={module.id_module} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-blue-600 font-medium">{module.code_module}</td>
                    <td className="p-4 font-medium text-gray-900">{module.nom_module}</td>
                    <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            {module.id_prof ? (
                                <span className="font-medium text-gray-800">
                                    {professorsMap[module.id_prof] || "Chargement..."}
                                </span>
                            ) : (
                                <span className="text-gray-400 italic text-xs">Non assigné</span>
                            )}
                        </div>
                    </td>
                    <td className="p-4 text-center"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-bold">{module.coefficient}</span></td>
                    <td className="p-4 text-center"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">S{module.semestre}</span></td>
                    <td className="p-4 flex justify-end gap-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(module)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={18} /></button>
                      <button onClick={() => deleteModule(module.id_module)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">{showAddModal ? "Nouveau Module" : "Modifier Module"}</h2>
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }}><X size={24} className="text-gray-400" /></button>
            </div>
            {renderForm()}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Annuler</button>
              <button onClick={showAddModal ? saveModule : updateModule} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow">
                <Save size={18} /> {showAddModal ? "Enregistrer" : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import ModuleService from '../services/ModuleService';
import '../App.css';

function ModuleList() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    code_module: '',
    nom_module: '',
    coefficient: '',
    semestre: ''
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = () => {
    ModuleService.getAllModules()
      .then(response => {
        setModules(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const deleteModule = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      ModuleService.deleteModule(id)
        .then(() => loadModules())
        .catch(error => alert('Erreur: ' + error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveModule = () => {
    ModuleService.createModule(formData)
      .then(() => {
        setShowAddModal(false);
        setFormData({ code_module: '', nom_module: '', coefficient: '', semestre: '' });
        loadModules();
      })
      .catch(err => alert('Erreur: ' + err.message));
  };

  const openEditModal = (module) => {
    setEditId(module.id_module);
    setFormData({
      code_module: module.code_module,
      nom_module: module.nom_module,
      coefficient: module.coefficient,
      semestre: module.semestre
    });
    setShowEditModal(true);
  };

  const updateModule = () => {
    ModuleService.updateModule(editId, formData)
      .then(() => {
        setShowEditModal(false);
        loadModules();
      })
      .catch(err => alert('Erreur: ' + err.message));
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="main-container">
      <div className="content-box">
        <div className="content-header">
          <button className="btn-add" onClick={() => {
              setShowAddModal(true);
              setFormData({ code_module: '', nom_module: '', coefficient: '', semestre: '' });
            }}>
            + Ajouter un Module
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Coefficient</th>
              <th>Semestre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Aucun module trouvé</td>
              </tr>
            ) : (
              modules.map(module => (
                <tr key={module.id_module}>
                  <td>{module.code_module}</td>
                  <td>{module.nom_module}</td>
                  <td>{module.coefficient}</td>
                  <td>{module.semestre}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openEditModal(module)}>
                      Modifier
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => deleteModule(module.id_module)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Ajouter un module</h2>
            <input type="text" name="code_module" placeholder="Code" onChange={handleChange} value={formData.code_module} />
            <input type="text" name="nom_module" placeholder="Nom" onChange={handleChange} value={formData.nom_module} />
            <input type="number" name="coefficient" placeholder="Coefficient" onChange={handleChange} value={formData.coefficient} />
            <input type="number" name="semestre" placeholder="Semestre" onChange={handleChange} value={formData.semestre} />
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Annuler</button>
              <button className="btn-save" onClick={saveModule}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Modifier le module</h2>
            <input type="text" name="code_module" value={formData.code_module} onChange={handleChange} />
            <input type="text" name="nom_module" value={formData.nom_module} onChange={handleChange} />
            <input type="number" name="coefficient" value={formData.coefficient} onChange={handleChange} />
            <input type="number" name="semestre" value={formData.semestre} onChange={handleChange} />
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
              <button className="btn-save" onClick={updateModule}>Modifier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleList;
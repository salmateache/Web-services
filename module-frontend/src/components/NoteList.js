import React, { useState, useEffect } from 'react';
import NoteService from '../services/NoteService';
import ModuleService from '../services/ModuleService';
import '../App.css';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    id_etudiant: '',
    id_module: '',
    valeur: '',
    session: 'normal'
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadNotes();
    loadModules();
  }, []);

  const loadNotes = () => {
    NoteService.getAllNotes()
      .then(response => {
        setNotes(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const loadModules = () => {
    ModuleService.getAllModules()
      .then(response => {
        setModules(response.data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des modules:', error);
      });
  };

  const deleteNote = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      NoteService.deleteNote(id)
        .then(() => loadNotes())
        .catch(error => alert('Erreur: ' + error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveNote = () => {
    const noteData = {
      id_etudiant: parseInt(formData.id_etudiant),
      id_module: parseInt(formData.id_module),
      valeur: parseFloat(formData.valeur),
      session: formData.session
    };

    NoteService.createNote(noteData)
      .then(() => {
        setShowAddModal(false);
        setFormData({ id_etudiant: '', id_module: '', valeur: '', session: 'normal' });
        loadNotes();
      })
      .catch(err => alert('Erreur: ' + err.message));
  };

  const openEditModal = (note) => {
    setEditId(note.id_note);
    setFormData({
      id_etudiant: note.id_etudiant,
      id_module: note.id_module,
      valeur: note.valeur,
      session: note.session
    });
    setShowEditModal(true);
  };

  const updateNote = () => {
    const noteData = {
      id_etudiant: parseInt(formData.id_etudiant),
      id_module: parseInt(formData.id_module),
      valeur: parseFloat(formData.valeur),
      session: formData.session
    };

    NoteService.updateNote(editId, noteData)
      .then(() => {
        setShowEditModal(false);
        loadNotes();
      })
      .catch(err => alert('Erreur: ' + err.message));
  };

  const getModuleName = (idModule) => {
    const module = modules.find(m => m.id_module === idModule);
    return module ? module.nom_module : 'Module inconnu';
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="main-container">
      <div className="content-box">
        <div className="content-header">
          <button className="btn-add" onClick={() => {
              setShowAddModal(true);
              setFormData({ id_etudiant: '', id_module: '', valeur: '', session: 'normal' });
            }}>
            + Ajouter une Note
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID Note</th>
              <th>ID Étudiant</th>
              <th>Module</th>
              <th>Note</th>
              <th>Session</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Aucune note trouvée</td>
              </tr>
            ) : (
              notes.map(note => (
                <tr key={note.id_note}>
                  <td>{note.id_note}</td>
                  <td>{note.id_etudiant}</td>
                  <td>{getModuleName(note.id_module)}</td>
                  <td>
                    <span style={{ 
                      color: note.valeur >= 10 ? '#4CAF50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      {note.valeur}/20
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: note.session === 'rattrapage' ? '#fff3e0' : '#e3f2fd',
                      color: note.session === 'rattrapage' ? '#f57c00' : '#1976d2'
                    }}>
                      {note.session}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => openEditModal(note)}>Modifier</button>
                    <button className="btn-delete" onClick={() => deleteNote(note.id_note)}>Supprimer</button>
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
            <h2>Ajouter une note</h2>
            
            <input 
              type="number" 
              name="id_etudiant" 
              placeholder="ID Étudiant" 
              onChange={handleChange} 
              value={formData.id_etudiant} 
            />
            
            <select 
              name="id_module" 
              onChange={handleChange} 
              value={formData.id_module}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <option value="">Sélectionnez un module</option>
              {modules.map(module => (
                <option key={module.id_module} value={module.id_module}>
                  {module.code_module} - {module.nom_module}
                </option>
              ))}
            </select>
            
            <input 
              type="number" 
              step="0.01"
              min="0"
              max="20"
              name="valeur" 
              placeholder="Note (sur 20)" 
              onChange={handleChange} 
              value={formData.valeur} 
            />
            
            <select 
              name="session" 
              onChange={handleChange} 
              value={formData.session}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <option value="normal">Normal</option>
              <option value="rattrapage">Rattrapage</option>
            </select>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Annuler</button>
              <button className="btn-save" onClick={saveNote}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Modifier la note</h2>
            
            <input 
              type="number" 
              name="id_etudiant" 
              placeholder="ID Étudiant" 
              onChange={handleChange} 
              value={formData.id_etudiant} 
            />
            
            <select 
              name="id_module" 
              onChange={handleChange} 
              value={formData.id_module}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <option value="">Sélectionnez un module</option>
              {modules.map(module => (
                <option key={module.id_module} value={module.id_module}>
                  {module.code_module} - {module.nom_module}
                </option>
              ))}
            </select>
            
            <input 
              type="number" 
              step="0.01"
              min="0"
              max="20"
              name="valeur" 
              onChange={handleChange} 
              value={formData.valeur} 
            />
            
            <select 
              name="session" 
              onChange={handleChange} 
              value={formData.session}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <option value="normal">Normal</option>
              <option value="rattrapage">Rattrapage</option>
            </select>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
              <button className="btn-save" onClick={updateNote}>Modifier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteList;
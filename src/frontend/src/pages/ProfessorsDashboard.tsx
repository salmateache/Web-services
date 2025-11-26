import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom"; 
import { Edit, Trash2, Plus } from "lucide-react"; 

// DEFINITION DE L'INTERFACE alignée sur le backend
interface Professor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  grade: string;
}

export default function ProfessorsDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [status, setStatus] = useState<string>("Chargement...");
  const [error, setError] = useState<string | null>(null);
  
  const apiUrl = "http://localhost:8083/api/professors";

  const fetchData = useCallback(() => {
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
            setStatus("Erreur de chargement");
            throw new Error(`Erreur Serveur: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Professor[]) => {
        setProfessors(data);
        setStatus("Prêt");
        setError(null);
      })
      .catch((err) => {
        setStatus("Échec de la récupération.");
        setError(err instanceof TypeError ? "Connexion impossible (Backend éteint)." : err.message);
        console.error("Erreur Fetch détaillée:", err);
      });
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // FONCTION DE SUPPRESSION (DELETE)
  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce professeur ?")) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            fetchData(); 
          } else {
            alert("Échec de la suppression. Le professeur est peut-être lié à un module.");
          }
        })
        .catch((err) => console.error("Erreur DELETE:", err));
    }
  };

  return (
    <div className="p-10 font-sans bg-gray-50">
      
      {/* 🚨 BLOC 1 : EN-TÊTE DE LA PAGE (Bouton Ajouter) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Liste des Professeurs</h1>
        
        {/* Bouton pour aller vers le formulaire d'ajout */}
        <Link to="/professors/add" className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-md">
          <Plus size={20} /> Ajouter Professeur
        </Link>
      </div>

      
      {/* Rendu du Tableau ou du Message d'attente/vide */}
      {professors.length === 0 && status === 'Prêt' && !error ? ( 
        <p className="text-gray-500 italic p-4 bg-white rounded shadow">Aucun professeur trouvé. Ajoutez-en un!</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Ajout de la div pour le débordement horizontal */}
            <div className="overflow-x-auto"> 
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold text-gray-600">ID</th>
                      <th className="p-4 font-semibold text-gray-600">Nom Complet</th>
                      <th className="p-4 font-semibold text-gray-600">Email</th>
                      <th className="p-4 font-semibold text-gray-600">Spécialité</th> 
                      <th className="p-4 font-semibold text-gray-600">Grade</th> 
                      <th className="p-4 font-semibold text-gray-600 text-right w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {professors.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition"> 
                        <td className="p-4 text-gray-600">#{p.id}</td> 
                        <td className="p-4 font-medium text-gray-900">{p.nom} {p.prenom}</td>
                        <td className="p-4 text-gray-600">{p.email}</td>
                        <td className="p-4 text-gray-600">{p.specialite}</td> 
                        <td className="p-4 text-gray-600">{p.grade}</td> 
                        
                        <td className="p-4 flex justify-end gap-2 whitespace-nowrap"> 
                            {/* Bouton Modifier */}
                            <Link 
                              to={`/professors/edit/${p.id}`} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </Link>
                            
                            {/* Bouton Supprimer */}
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div> {/* Fin overflow-x-auto */}
        </div>
      )}
    </div>
  );
}
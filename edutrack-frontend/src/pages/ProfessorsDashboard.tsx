// src/pages/ProfessorsDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";
import { professorService } from '../services/professorService';
import AddProfessor from "./AddProfessor";

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await professorService.getAllProfessors();
            setProfessors(data);
        } catch (err: any) {
            setError(err.message || "Erreur de connexion au service Professeurs.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce professeur ?")) return;
        try {
            await professorService.deleteProfessor(id);
            // rafraîchir la liste
            fetchData();
        } catch (err: any) {
            alert(err.message || "Erreur lors de la suppression.");
        }
    };

    if (loading) return (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" size={32}/></div>
    );

    if (error) return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <strong>Erreur :</strong> <span className="ml-2">{error}</span>
        </div>
    );

    return (
        <div className="p-0 font-sans bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Liste des Professeurs</h1>
                    <p className="text-gray-500">Gérer les professeurs : ajouter, modifier ou supprimer.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                       onClick={() => setShowAddModal(true)}
                       className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} /> Ajouter
                    </button>
                </div>
            </div>

            {/* Modal ajout */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 p-6">
                    <div className="w-full max-w-3xl">
                        <AddProfessor 
                            onProfessorAdded={() => { fetchData(); setShowAddModal(false); }}
                            onClose={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                {professors.length === 0 ? (
                    <p className="text-gray-500 italic p-4 bg-white rounded shadow">Aucun professeur trouvé. Ajoutez-en un!</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                                            <Link
                                                to={`/admin/professors/edit/${p.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </Link>

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
                    </div>
                )}
            </div>
        </div>
    );
}

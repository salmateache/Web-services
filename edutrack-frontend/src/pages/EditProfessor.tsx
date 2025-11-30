// src/pages/EditProfessor.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Save } from "lucide-react";
import { professorService } from "../services/professorService";

interface Professor {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    specialite: string;
    grade: string;
}

export default function EditProfessor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Professor | null>(null);
    const [status, setStatus] = useState<string>("Chargement des données...");

    useEffect(() => {
        if (!id) return;
        setStatus("Chargement...");
        professorService.getProfessorById(Number(id))
            .then((data) => {
                setFormData(data);
                setStatus("Prêt à modifier");
            })
            .catch((error) => {
                setStatus(`Erreur de chargement: ${error.message}`);
                console.error("Erreur GET par ID:", error);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (formData) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            } as Professor);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !id) return;
        setStatus("Mise à jour en cours...");
        try {
            await professorService.updateProfessor(Number(id), formData);
            setStatus("Professeur mis à jour avec succès !");
            // rediriger vers la liste admin
            navigate("/admin/professors");
        } catch (error: any) {
            setStatus(`Erreur: ${error.message || "Échec de la mise à jour"}`);
            console.error("Erreur PUT:", error);
        }
    };

    if (status.toLowerCase().includes("charg") && !formData) {
        return <div className="p-10 text-center text-gray-500">{status}</div>;
    }

    if (!formData) {
        return <div className="p-10 text-center text-red-600 font-bold">Professeur introuvable.</div>;
    }

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Edit size={24} /> Modifier le Professeur #{formData.id}
            </h2>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                id="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">Spécialité</label>
                            <input
                                type="text"
                                name="specialite"
                                id="specialite"
                                value={formData.specialite}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
                            <input
                                type="text"
                                name="grade"
                                id="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 border"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {status && (
                            <p className={`self-center font-medium ${status.includes("succès") ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                {status}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate("/admin/professors")}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow-md"
                        >
                            <Save size={20} /> Mettre à jour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

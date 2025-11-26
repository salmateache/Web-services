import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Pour récupérer l'ID et naviguer
import { Edit, Save } from "lucide-react";

interface Professor {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    specialite: string;
    grade: string;
}

const apiUrl = "http://localhost:8083/api/professors";

export default function EditProfessor() {
    // 1. Récupérer l'ID dans l'URL (ex: /professors/edit/1)
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Professor | null>(null);
    const [status, setStatus] = useState<string>("Chargement des données...");

    // 2. useEffect pour CHARGER les données du professeur (méthode GET by ID)
    useEffect(() => {
        if (!id) return;

        fetch(`${apiUrl}/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Professeur non trouvé (Erreur 404)");
                }
                return res.json();
            })
            .then((data: Professor) => {
                setFormData(data); // Pré-remplir le formulaire
                setStatus("Prêt à modifier");
            })
            .catch((error) => {
                setStatus(`Erreur de chargement: ${error.message}`);
                console.error("Erreur GET par ID:", error);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    // 3. Soumission du formulaire (méthode PUT)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !id) return;
        setStatus("Mise à jour en cours...");

        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Échec de la mise à jour.");
                }
                setStatus("Professeur mis à jour avec succès !");
                // Rediriger vers la liste après 1 seconde
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            })
            .catch((error) => {
                setStatus(`Erreur: ${error.message}. Vérifiez les données.`);
                console.error("Erreur PUT:", error);
            });
    };

    if (status.includes("chargement") && !formData) {
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
                    {/* Les champs sont les mêmes que pour l'ajout, mais pré-remplis */}
                    
                    {/* Ligne Nom et Prénom */}
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
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
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
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            />
                        </div>
                    </div>
                    
                    {/* Ligne Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                        />
                    </div>

                    {/* Ligne Spécialité et Grade */}
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
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
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
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            />
                        </div>
                    </div>

                    {/* Boutons et statut */}
                    <div className="flex justify-end gap-3 pt-4">
                        {status && (
                            <p className={`self-center font-medium ${status.includes("succès") ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                {status}
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
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
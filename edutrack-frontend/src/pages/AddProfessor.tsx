// src/pages/AddProfessor.tsx
import React, { useState } from "react";
import { Save, X, Loader2, AlertCircle } from "lucide-react";
import { professorService } from "../services/professorService";

interface ProfessorData {
    nom: string;
    prenom: string;
    email: string;
    specialite: string;
    grade: string;
}

interface AddProfessorProps {
    onProfessorAdded: () => void;
    onClose: () => void;
}

export default function AddProfessor({ onProfessorAdded, onClose }: AddProfessorProps) {
    const [formData, setFormData] = useState<ProfessorData>({
        nom: "",
        prenom: "",
        email: "",
        specialite: "",
        grade: "PA"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await professorService.addProfessor(formData);
            onProfessorAdded();
            onClose();
        } catch (err: any) {
            setError(err.message || "Échec de l'ajout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Nouveau Professeur</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" name="nom" required value={formData.nom} onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-200 outline-none" placeholder="Ex: Alami" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Prénom</label>
                            <input type="text" name="prenom" required value={formData.prenom} onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-200 outline-none" placeholder="Ex: Sara" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Académique</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-200 outline-none" placeholder="nom.prenom@uiz.ac.ma" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Spécialité</label>
                            <input type="text" name="specialite" required value={formData.specialite} onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-200 outline-none" placeholder="Ex: Big Data" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Grade</label>
                            <select name="grade" value={formData.grade} onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-200 outline-none bg-white">
                                <option value="PA">PA</option>
                                <option value="PH">PH</option>
                                <option value="PES">PES</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-50">Annuler</button>
                        <button type="submit" disabled={loading}
                            className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? <Loader2 size={20} className="animate-spin"/> : <Save size={20} />} Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

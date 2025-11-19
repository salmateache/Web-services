import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { motion } from "framer-motion";

export default function AddProfessor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
    grade: "PA"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Appel API vers le backend (Port 8083)
    fetch("http://localhost:8083/api/professors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        // Redirection vers le tableau de bord après succès
        navigate("/");
      })
      .catch((err) => console.error("Erreur ajout:", err));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Nouveau Professeur</h2>
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text" name="nom" required
                value={formData.nom} onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Ex: Alami"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text" name="prenom" required
                value={formData.prenom} onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Ex: Sara"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Académique</label>
            <input
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="nom.prenom@uiz.ac.ma"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Spécialité</label>
              <input
                type="text" name="specialite" required
                value={formData.specialite} onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Ex: Big Data, Sécurité..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Grade</label>
              <select
                name="grade"
                value={formData.grade} onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="PA">PA (Professeur Assistant)</option>
                <option value="PH">PH (Professeur Habilité)</option>
                <option value="PES">PES (Ens. Supérieur)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              <Save size={20} />
              Enregistrer le Professeur
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
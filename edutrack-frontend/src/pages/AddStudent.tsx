import React, { useState } from "react";
import { studentService } from "../services/studentService";
import { useNavigate } from "react-router-dom";
import { Save, X, User, BookOpen, GraduationCap } from "lucide-react";

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    matricule: "",
    email: "",
    filiere: "",
    niveau: "Licence", // Valeur par défaut
    semestreActuel: 1, // Valeur par défaut
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'semestreActuel' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.createStudent(form);
      navigate("/admin/students");
    } catch (error) {
      alert("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User size={24} /> Ajouter un Étudiant
            </h2>
            <p className="text-emerald-100 text-sm mt-1">Saisissez les informations du nouvel étudiant.</p>
          </div>
          <button onClick={() => navigate("/admin/students")} className="text-white/80 hover:text-white transition">
            <X size={28} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input required name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: El Idrissi" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input required name="prenom" value={form.prenom} onChange={handleChange} placeholder="Ex: Youssef" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
              <input required name="matricule" value={form.matricule} onChange={handleChange} placeholder="Ex: MAT2025001" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Ex: youssef@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Cursus (LMD) */}
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <GraduationCap size={20} className="text-emerald-600" /> Cursus Académique
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select name="niveau" value={form.niveau} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
                <option value="Ingénieur">Cycle Ingénieur</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <input required name="filiere" value={form.filiere} onChange={handleChange} placeholder="Ex: Génie Logiciel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre Actuel</label>
            <div className="flex items-center gap-4">
               <input 
                 type="range" 
                 min="1" 
                 max="10" 
                 name="semestreActuel"
                 value={form.semestreActuel} 
                 onChange={handleChange} 
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
               />
               <span className="text-xl font-bold text-emerald-600 w-12 text-center">S{form.semestreActuel}</span>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Save size={20} /> {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
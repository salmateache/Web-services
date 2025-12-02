import React, { useState, useEffect } from "react";
import { studentService } from "../services/studentService";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, UserPen, GraduationCap } from "lucide-react";

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    matricule: "",
    email: "",
    filiere: "",
    niveau: "Licence",
    semestreActuel: 1,
  });

  // Charger les données de l'étudiant au démarrage
  useEffect(() => {
    if (id) {
      loadStudentData(Number(id));
    }
  }, [id]);

  const loadStudentData = async (studentId: number) => {
    try {
      const data = await studentService.getStudentById(studentId);
      setForm(data);
    } catch (error) {
      alert("Erreur lors du chargement de l'étudiant");
      navigate("/admin/students");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'semestreActuel' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await studentService.updateStudent(Number(id), form);
        navigate("/admin/students");
      }
    } catch (error) {
      alert("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header - Bleu pour l'édition */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <UserPen size={24} /> Modifier l'Étudiant
            </h2>
            <p className="text-blue-100 text-sm mt-1">Mettre à jour les informations académiques.</p>
          </div>
          <button onClick={() => navigate("/admin/students")} className="text-white/80 hover:text-white transition">
            <X size={28} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input required name="nom" value={form.nom} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input required name="prenom" value={form.prenom} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
              <input required name="matricule" value={form.matricule} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <GraduationCap size={20} className="text-blue-600" /> Cursus Académique
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select name="niveau" value={form.niveau} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
                <option value="Ingénieur">Cycle Ingénieur</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <input required name="filiere" value={form.filiere} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <span className="text-xl font-bold text-blue-600 w-12 text-center">S{form.semestreActuel}</span>
            </div>
          </div>

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
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Save size={20} /> {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
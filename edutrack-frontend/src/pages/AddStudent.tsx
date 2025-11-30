import { useState } from "react";
import { studentService } from "../services/studentService";
import { useNavigate } from "react-router-dom";

interface Student {
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
}

const AddStudent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<Student>({
    nom: "",
    prenom: "",
    matricule: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await studentService.createStudent(form);
    navigate("/admin/students");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Ajouter un étudiant</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} className="border p-3 w-full rounded-lg" />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Prénom</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} className="border p-3 w-full rounded-lg" />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Matricule</label>
          <input name="matricule" value={form.matricule} onChange={handleChange} className="border p-3 w-full rounded-lg" />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="border p-3 w-full rounded-lg" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/students")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;

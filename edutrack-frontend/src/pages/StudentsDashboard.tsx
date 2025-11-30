import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, Loader2, AlertCircle, Download } from "lucide-react";
import { studentService } from "../services/studentService";

interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
}

export default function StudentsDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err: any) {
      setError("Impossible de charger les étudiants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous supprimer cet étudiant ?")) return;
    try { await studentService.deleteStudent(id); loadStudents(); }
    catch { alert("Erreur lors de la suppression."); }
  };

  return (
    <div className="p-0 font-sans bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h1>
        <div className="flex gap-2">
          <Link to="/admin/students/add" className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-md">
            <Plus size={20} /> Ajouter
          </Link>
          <button onClick={studentService.exportStudentsExcel} className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition shadow-md">
            <Download size={20} /> Exporter Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} /><strong>Erreur:</strong> {error}
        </div>
      ) : students.length === 0 ? (
        <p className="text-gray-500 italic p-4 bg-white rounded shadow">Aucun étudiant trouvé.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">ID</th>
                  <th className="p-4 font-semibold text-gray-600">Nom Complet</th>
                  <th className="p-4 font-semibold text-gray-600">Matricule</th>
                  <th className="p-4 font-semibold text-gray-600">Email</th>
                  <th className="p-4 font-semibold text-gray-600 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600">#{s.id}</td>
                    <td className="p-4 font-medium text-gray-900">{s.nom} {s.prenom}</td>
                    <td className="p-4 text-gray-600">{s.matricule}</td>
                    <td className="p-4 text-gray-600">{s.email}</td>
                    <td className="p-4 flex justify-end gap-2 whitespace-nowrap">
                      <Link to={`/admin/students/edit/${s.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

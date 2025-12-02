import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, Loader2, AlertCircle, Download, GraduationCap, BookOpen, Search } from "lucide-react";
import { studentService } from "../services/studentService";

interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  filiere: string;
  niveau: string;
  semestreActuel: number;
}

export default function StudentsDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filtrage en temps réel
  const filteredStudents = students.filter(student => 
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0 font-sans bg-gray-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h1>
            <p className="text-gray-500 text-sm mt-1">{filteredStudents.length} étudiant(s) trouvé(s)</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64"
            />
          </div>

          <div className="flex gap-2">
            <Link to="/admin/students/add" className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-md whitespace-nowrap">
                <Plus size={20} /> Ajouter
            </Link>
            <button onClick={studentService.exportStudentsExcel} className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition shadow-md whitespace-nowrap">
                <Download size={20} /> Excel
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} /><strong>Erreur:</strong> {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 italic">Aucun étudiant ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Matricule</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Nom Complet</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Filière & Niveau</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-center">Semestre</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-blue-600 font-medium">{s.matricule}</td>
                    <td className="p-4">
                        <div className="font-medium text-gray-900">{s.nom.toUpperCase()} {s.prenom}</div>
                        <div className="text-gray-500 text-xs">{s.email}</div>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-gray-400"/>
                            <span className="text-gray-700">{s.filiere}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <GraduationCap size={16} className="text-gray-400"/>
                            <span className="text-gray-500 text-xs">{s.niveau}</span>
                        </div>
                    </td>
                    <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold text-xs">
                            S{s.semestreActuel}
                        </span>
                    </td>
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
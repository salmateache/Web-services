import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import AddStudent from "./AddStudent"; // formulaire
import * as XLSX from "xlsx"; // pour export XLSX

interface Student {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Student | null>(null);

  // Chargement des étudiants
  const loadStudents = () => {
    setLoading(true);
    fetch("http://localhost:8082/api/students")
      .then(res => res.json())
      .then(data => { setStudents(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadStudents(); }, []);

  // Supprimer un étudiant
  const deleteStudent = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")) return;
    try {
      const res = await fetch(`http://localhost:8082/api/students/${id}`, { method: "DELETE" });
      if (res.ok) loadStudents();
      else alert("Erreur lors de la suppression !");
    } catch { alert("Erreur réseau !"); }
  };

  // Éditer un étudiant
  const handleEdit = (student: Student) => { setStudentToEdit(student); };

  // Recherche par ID ou matricule
  const handleSearch = async () => {
    if (!searchTerm.trim()) return setSearchResult(null);
    try {
      const res = await fetch(`http://localhost:8082/api/students/search/${searchTerm}`);
      if (!res.ok) { alert("Étudiant introuvable !"); setSearchResult(null); return; }
      const data = await res.json();
      setSearchResult(data);
    } catch (err) { console.error(err); alert("Erreur réseau !"); }
  };

  // Exporter en XLSX
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  if (loading) return <div className="p-6 text-xl text-blue-700">Chargement...</div>;

  return (
    <div className="p-6 grid grid-cols-12 gap-6 bg-beige-50 min-h-screen">

      {/* Formulaire édition ou ajout */}
      {studentToEdit && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-12">
          <AddStudent
            studentToEdit={studentToEdit}
            onSaved={() => { setStudentToEdit(null); loadStudents(); }}
          />
        </motion.div>
      )}

      {/* Recherche et Export */}
      <motion.div className="col-span-12 lg:col-span-8 flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Rechercher par ID ou matricule"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </div>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Exporter XLSX
        </button>
      </motion.div>

      {/* Résultat recherche */}
      {searchResult && (
        <motion.div className="col-span-12 mb-6">
          <Card className="rounded-2xl shadow-lg border border-blue-200 bg-white">
            <CardContent className="p-4">
              <h3 className="font-bold text-blue-700 text-lg mb-2">Profil de l'étudiant</h3>
              <p><strong>ID:</strong> {searchResult.id}</p>
              <p><strong>Nom:</strong> {searchResult.nom} {searchResult.prenom}</p>
              <p><strong>Matricule:</strong> {searchResult.matricule}</p>
              <p><strong>Email:</strong> {searchResult.email}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tableau étudiants */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 lg:col-span-8 space-y-6">
        <Card className="rounded-2xl shadow-lg border border-blue-200 bg-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Liste des étudiants</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-blue-900">ID</th>
                    <th className="px-4 py-2 text-blue-900">Nom</th>
                    <th className="px-4 py-2 text-blue-900">Prénom</th>
                    <th className="px-4 py-2 text-blue-900">Matricule</th>
                    <th className="px-4 py-2 text-blue-900">Email</th>
                    <th className="px-4 py-2 text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b hover:bg-blue-50 transition">
                      <td className="px-4 py-2">{s.id}</td>
                      <td className="px-4 py-2">{s.nom}</td>
                      <td className="px-4 py-2">{s.prenom}</td>
                      <td className="px-4 py-2">{s.matricule}</td>
                      <td className="px-4 py-2">{s.email}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button onClick={() => handleEdit(s)} className="text-blue-500 hover:text-blue-700">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => deleteStudent(s.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques et derniers inscrits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 lg:col-span-4 space-y-6">
        <Card className="rounded-2xl shadow-lg border border-blue-200 bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Statistiques</h3>
            <div className="h-48">
              {/* BarChart ou autre graphique peut être ajouté ici */}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-blue-200 bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Derniers inscrits</h3>
            <ul className="space-y-2">
              {students.slice(-3).map(s => (
                <li key={s.id} className="text-gray-800 font-medium bg-blue-50 p-2 rounded-lg">
                  {s.nom} {s.prenom} — {s.matricule}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

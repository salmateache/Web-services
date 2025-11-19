import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Liste des étudiants</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Prénom</th>
            <th className="px-4 py-2">Matricule</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-2">{s.id}</td>
              <td className="px-4 py-2">{s.nom}</td>
              <td className="px-4 py-2">{s.prenom}</td>
              <td className="px-4 py-2">{s.matricule}</td>
              <td className="px-4 py-2">{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/SimpleCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

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

  useEffect(() => {
    fetch("http://localhost:8082/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-xl">Chargement des données...</div>;

  const chartData = [
    { name: "Total Étudiants", count: students.length },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* --- Liste des étudiants --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-8 space-y-6"
      >
        <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Liste des étudiants</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ID</th>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Prénom</th>
                    <th className="px-4 py-3">Matricule</th>
                    <th className="px-4 py-3 rounded-tr-lg">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition">
                      <td className="px-4 py-3 text-gray-600">{s.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{s.nom}</td>
                      <td className="px-4 py-3 text-gray-700">{s.prenom}</td>
                      <td className="px-4 py-3 text-gray-500">{s.matricule}</td>
                      <td className="px-4 py-3 text-blue-600">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- Statistiques --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-12 lg:col-span-4 space-y-6"
      >
        <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Statistiques</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
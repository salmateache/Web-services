import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
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
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-xl text-blue-700">Chargement...</div>;

  const chartData = [{ name: "Étudiants", count: students.length }];

  return (
    <div className="p-6 grid grid-cols-12 gap-6 bg-beige-50 min-h-screen">
      {/* Tableau étudiants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-8 space-y-6"
      >
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques et derniers inscrits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-4 space-y-6"
      >
        <Card className="rounded-2xl shadow-lg border border-blue-200 bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Statistiques</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#1D4ED8" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1D4ED8" />
                </BarChart>
              </ResponsiveContainer>
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

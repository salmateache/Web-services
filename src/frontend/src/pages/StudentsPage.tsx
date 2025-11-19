import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface Student {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
}

export default function StudentsDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8082/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-xl">Chargement...</div>;

  const chartData = [
    { name: "Étudiants", count: students.length },
  ];

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-8 space-y-6"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Liste des étudiants</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prénom</th>
                    <th className="px-4 py-2">Matricule</th>
                    <th className="px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50 transition">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-4 space-y-6"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Statistiques</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Derniers inscrits</h3>
            <ul className="space-y-2">
              {students.slice(-3).map((s) => (
                <li key={s.id} className="text-gray-700 font-medium">
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

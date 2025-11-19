import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Interface adaptée pour le Professeur
interface Professor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  grade: string;
}

export default function ProfessorsDashboard() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch des données API
  useEffect(() => {
    fetch("http://localhost:8083/api/professors") // Port 8083
      .then((res) => res.json())
      .then((data) => {
        setProfessors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
      Chargement des données...
    </div>
  );

  const chartData = [
    { name: "Total Professeurs", count: professors.length },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* --- Colonne Gauche : Liste des Professeurs (Style 'Card') --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-8 space-y-6"
      >
        {/* Simulation du composant Card */}
        <div className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-800">Liste des Professeurs</h2>
               <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                 {professors.length} actifs
               </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Nom complet</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Spécialité</th>
                    <th className="px-4 py-3 rounded-tr-lg">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {professors.map((p) => (
                    <tr key={p.id} className="hover:bg-emerald-50/30 transition duration-150">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {p.nom.toUpperCase()} {p.prenom}
                      </td>
                      <td className="px-4 py-4 text-gray-500">{p.email}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {p.specialite}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700 font-medium">{p.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Colonne Droite : Statistiques --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-12 lg:col-span-4 space-y-6"
      >
        <div className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Aperçu Rapide</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#ecfdf5'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  {/* Couleur Emerald pour correspondre au thème Professeur */}
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Répartition actuelle des effectifs
            </div>
          </div>
        </div>

        {/* Carte Info supplémentaire (Bonus) */}
        <div className="rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6">
          <h4 className="font-bold text-lg mb-2">Besoin d'aide ?</h4>
          <p className="text-emerald-100 text-sm mb-4">Contactez l'administration pour ajouter un nouveau professeur.</p>
          <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition">
            Contacter Admin
          </button>
        </div>

      </motion.div>
    </div>
  );
}
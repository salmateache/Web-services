import React, { useEffect, useState } from "react";
import { 
  Users, BookOpen, GraduationCap, TrendingUp, 
  Activity, PlusCircle, ArrowRight, UserCheck 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";
import { studentService } from "../services/studentService";
import { professorService } from "../services/professorService";
import ModuleService from "../services/ModuleService"; // Vérifie si c'est majuscule ou minuscule selon ton fichier
import { Link } from "react-router-dom";

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfs: 0,
    totalModules: 0,
    studentsByLevel: [] as any[],
    profsByGrade: [] as any[],
    recentStudents: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. Chargement parallèle des données pour la rapidité
      const [students, profs, modulesResponse] = await Promise.all([
        studentService.getAllStudents(),
        professorService.getAllProfessors(),
        ModuleService.getAllModules()
      ]);

      // Gestion des modules (structure API parfois différente)
// On "cast" en 'any' pour dire à TypeScript de nous laisser vérifier si c'est une pagination ou une liste
const modulesData = modulesResponse.data as any; 
const modules = Array.isArray(modulesData) ? modulesData : (modulesData.content || []);
      // 2. Calcul des Stats : Étudiants par Niveau
      const levelCounts = students.reduce((acc: any, curr: any) => {
        const niveau = curr.niveau || "Non défini";
        acc[niveau] = (acc[niveau] || 0) + 1;
        return acc;
      }, {});
      const chartDataLevels = Object.keys(levelCounts).map(key => ({ name: key, value: levelCounts[key] }));

      // 3. Calcul des Stats : Profs par Grade
      const gradeCounts = profs.reduce((acc: any, curr: any) => {
        const grade = curr.grade || "Autre";
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
      }, {});
      const chartDataGrades = Object.keys(gradeCounts).map(key => ({ name: key, value: gradeCounts[key] }));

      // 4. Derniers inscrits (les 5 derniers)
      const recent = students.slice(-5).reverse();

      setStats({
        totalStudents: students.length,
        totalProfs: profs.length,
        totalModules: modules.length,
        studentsByLevel: chartDataLevels,
        profsByGrade: chartDataGrades,
        recentStudents: recent
      });

    } catch (error) {
      console.error("Erreur chargement dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full font-sans">
      
      {/* --- EN-TÊTE --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans l'espace d'administration EduTrack.</p>
      </div>

      {/* --- STAT CARDS (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte Étudiants */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium mb-1">Total Étudiants</p>
              <h3 className="text-4xl font-bold">{stats.totalStudents}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <GraduationCap size={28} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-100">
            <TrendingUp size={16} className="mr-1" />
            <span>Actifs ce semestre</span>
          </div>
        </div>

        {/* Carte Professeurs */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 font-medium mb-1">Corps Professoral</p>
              <h3 className="text-4xl font-bold">{stats.totalProfs}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <UserCheck size={28} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-100">
            <Activity size={16} className="mr-1" />
            <span>En service</span>
          </div>
        </div>

        {/* Carte Modules */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 font-medium mb-1">Modules Enseignés</p>
              <h3 className="text-4xl font-bold">{stats.totalModules}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen size={28} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-100">
            <PlusCircle size={16} className="mr-1" />
            <span>Répartis sur les semestres</span>
          </div>
        </div>
      </div>

      {/* --- GRAPHIQUES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Graphique 1 : Répartition par Niveau */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Répartition des Étudiants (LMD)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.studentsByLevel}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 2 : Grades Professeurs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Grades des Professeurs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.profsByGrade}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.profsByGrade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- DERNIERS INSCRITS & ACTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tableau derniers étudiants (Prend 2/3 largeur) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Dernières Inscriptions</h3>
            <Link to="/admin/students" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Voir tout <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Étudiant</th>
                  <th className="px-6 py-3 font-semibold">Matricule</th>
                  <th className="px-6 py-3 font-semibold">Filière</th>
                  <th className="px-6 py-3 font-semibold text-center">Niveau</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentStudents.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{s.nom.toUpperCase()} {s.prenom}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{s.matricule}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{s.filiere}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs font-bold">{s.niveau}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions Rapides (Prend 1/3 largeur) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Link to="/admin/students/add" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition group">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Ajouter un Étudiant</h4>
                  <p className="text-xs text-gray-500">Inscrire un nouvel élève</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/professors" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition group">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Gérer Professeurs</h4>
                  <p className="text-xs text-gray-500">Voir l'équipe enseignante</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/modules" className="block w-full p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition group">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Gérer les Modules</h4>
                  <p className="text-xs text-gray-500">Affecter des cours</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}